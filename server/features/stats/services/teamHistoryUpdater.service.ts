import { insertPlayerTeamHistory, insertTeams } from "../../../db/queries/insert";
import {
  getAllDivisions,
  getAllOpenHistories,
  getAllSeasons,
  getAllTeams,
  getSelectTeams,
  getHistoriesForPlayers,
} from "../../../db/queries/select";
import { closeHistoryRecord } from "../../../db/queries/update";
import { DbPlayer } from "./playerDbNameUpdater.service";

export interface DbTeamData {
  teamName: string;
  teamTag: string | null;
  divisionId: number | null;
}

const teamHistoryUpdate = async (players: DbPlayer[]) => {
  if (!players || players.length === 0) return;

  console.log("[DB Team History Updater] Starting history update...");

  const teamNamesFromSheet = [...new Set(players.map((p) => p.teamName))];
  const existingTeams = await getSelectTeams(teamNamesFromSheet);
  const existingTeamMap = new Map(existingTeams.map((t) => [`${t.teamName}:${t.divisionId}`, t]));

  const newTeamData: DbTeamData[] = [];
  for (const playerEvent of players) {
    if (!existingTeamMap.has(`${playerEvent.teamName}:${playerEvent.divisionId}`)) {
      newTeamData.push({
        teamName: playerEvent.teamName,
        teamTag: null,
        divisionId: playerEvent.divisionId,
      });
    }
  }

  if (newTeamData.length > 0) {
    const uniqueNewTeams = [
      ...new Map(newTeamData.map((item) => [`${item.teamName}:${item.divisionId}`, item])).values(),
    ];
    console.log(`[DB Team History Updater] Creating ${uniqueNewTeams.length} new teams...`);
    await insertTeams(uniqueNewTeams);
  }

  const allTeams = await getAllTeams();
  const allTeamMap = new Map(allTeams.map((t) => [`${t.teamName}:${t.divisionId}`, t]));
  const teamByIdMap = new Map(allTeams.map((t) => [t.id, t]));

  // Fetch all divisions and seasons to derive season dates for teams
  const allDivisions = await getAllDivisions();
  const allSeasons = await getAllSeasons(); // ordered by id asc

  const divisionSeasonMap = new Map(allDivisions.map((d) => [d.id, d.seasonId]));
  const seasonMap = new Map(allSeasons.map((s) => [s.id, s]));

  // Build next season start map: seasonId → next season's created_at
  const nextSeasonStartMap = new Map<number, string>();
  for (let i = 0; i < allSeasons.length - 1; i++) {
    const nextSeason = allSeasons[i + 1];
    if (nextSeason.createdAt) {
      nextSeasonStartMap.set(allSeasons[i].id, nextSeason.createdAt);
    }
  }

  const getSeasonIdForTeam = (divisionId: number | null): number | null => {
    if (!divisionId) return null;
    return divisionSeasonMap.get(divisionId) ?? null;
  };

  const getSeasonStartForTeam = (divisionId: number | null): Date | null => {
    const seasonId = getSeasonIdForTeam(divisionId);
    if (!seasonId) return null;
    const season = seasonMap.get(seasonId);
    if (!season?.createdAt) return null;
    return new Date(season.createdAt);
  };

  const sortedPlayersByDate = players.sort((a, b) => a.date!.getTime() - b.date!.getTime());

  // Batch fetch all history records for involved PUUIDs to avoid N+1 queries
  const uniquePuuids = [...new Set(sortedPlayersByDate.map((p) => p.puuid).filter(Boolean))];
  const allHistories = await getHistoriesForPlayers(uniquePuuids);

  // Build in-memory state from fetched data
  const existingHistoryKeys = new Set(
    allHistories.map((h) => `${h.playerPuuid}:${h.teamId}:${h.startDate}`)
  );

  // Map of puuid -> most recent open history (no endDate)
  const openHistoryMap = new Map<string, { id: number; teamId: number; startDate: string }>();
  for (const h of allHistories) {
    if (!h.endDate) {
      const existing = openHistoryMap.get(h.playerPuuid);
      if (!existing || h.startDate > existing.startDate) {
        openHistoryMap.set(h.playerPuuid, { id: h.id, teamId: h.teamId, startDate: h.startDate });
      }
    }
  }

  for (const player of sortedPlayersByDate) {
    const team = allTeamMap.get(`${player.teamName}:${player.divisionId}`);
    if (!team || !player.puuid || !player.date) continue;

    const playerDate = player.date;

    if (player.teamState.toLowerCase() === "add") {
      // Use the season's created_at only when the sheet has no date (initial players)
      // Otherwise respect the date from the Google Sheet
      const seasonStart = getSeasonStartForTeam(team.divisionId);
      const startDate = player.hasSheetDate ? playerDate : (seasonStart ?? playerDate);
      const startDateStr = startDate.toISOString().split("T")[0];

      const historyKey = `${player.puuid}:${team.id}:${startDateStr}`;
      // Checks if this exact history record already exists (in-memory lookup)
      if (!existingHistoryKeys.has(historyKey)) {
        // Closes any other open history record
        const openHistory = openHistoryMap.get(player.puuid);
        if (openHistory) {
          // Determine the close date based on season boundaries
          const oldTeam = teamByIdMap.get(openHistory.teamId);
          const oldSeasonId = getSeasonIdForTeam(oldTeam?.divisionId ?? null);
          const newSeasonId = getSeasonIdForTeam(team.divisionId);

          let closeDate: Date;
          if (oldSeasonId && newSeasonId && oldSeasonId !== newSeasonId && seasonStart) {
            // Cross-season transition: close with new season's start date
            closeDate = seasonStart;
          } else {
            // Same season mid-season change: close with day before event
            closeDate = new Date(playerDate);
            closeDate.setDate(playerDate.getDate() - 1);
          }
          await closeHistoryRecord(openHistory.id, closeDate);
          openHistoryMap.delete(player.puuid);
        }
        // Inserts new team history with season start date
        const newId = await insertPlayerTeamHistory(player.puuid, team.id, startDate);
        existingHistoryKeys.add(historyKey);
        if (newId) {
          openHistoryMap.set(player.puuid, { id: newId, teamId: team.id, startDate: startDateStr });
        }
      }
    } else if (player.teamState.toLowerCase() === "remove") {
      const openHistory = openHistoryMap.get(player.puuid);
      if (openHistory) {
        await closeHistoryRecord(openHistory.id, playerDate);
        openHistoryMap.delete(player.puuid);
      }
    }
  }

  // Close all remaining open histories from previous seasons
  const currentSeasonIds = new Set(
    players
      .map((p) => getSeasonIdForTeam(p.divisionId))
      .filter((id): id is number => id !== null)
  );

  if (currentSeasonIds.size > 0) {
    const allOpenHistories = await getAllOpenHistories();
    let closedCount = 0;
    for (const history of allOpenHistories) {
      const historyTeam = teamByIdMap.get(history.teamId);
      const historySeasonId = getSeasonIdForTeam(historyTeam?.divisionId ?? null);
      if (historySeasonId && !currentSeasonIds.has(historySeasonId)) {
        const nextSeasonStart = nextSeasonStartMap.get(historySeasonId);
        if (nextSeasonStart) {
          await closeHistoryRecord(history.id, new Date(nextSeasonStart));
          closedCount++;
        }
      }
    }
    if (closedCount > 0) {
      console.log(`[DB Team History Updater] Closed ${closedCount} open histories from previous seasons.`);
    }
  }
};

export default teamHistoryUpdate;
