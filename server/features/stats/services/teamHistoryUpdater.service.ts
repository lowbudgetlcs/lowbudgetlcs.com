import { insertPlayerTeamHistory, insertTeams } from "../../../db/queries/insert";
import {
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
  const existingTeamMap = new Map(existingTeams.map((t) => [t.teamName, t]));

  const newTeamData: DbTeamData[] = [];
  for (const playerEvent of players) {
    if (!existingTeamMap.has(playerEvent.teamName)) {
      newTeamData.push({
        teamName: playerEvent.teamName,
        teamTag: null,
        divisionId: playerEvent.divisionId,
      });
    }
  }

  if (newTeamData.length > 0) {
    const uniqueNewTeams = [
      ...new Map(newTeamData.map((item) => [item["teamName"], item])).values(),
    ];
    console.log(`[DB Team History Updater] Creating ${uniqueNewTeams.length} new teams...`);
    await insertTeams(uniqueNewTeams);
  }

  const allTeams = await getAllTeams();
  const allTeamMap = new Map(allTeams.map((t) => [t.teamName, t]));

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
    const team = allTeamMap.get(player.teamName);
    if (!team || !player.puuid || !player.date) continue;

    const playerDate = player.date;
    const dateStr = playerDate.toISOString().split("T")[0];

    if (player.teamState.toLowerCase() === "add") {
      const historyKey = `${player.puuid}:${team.id}:${dateStr}`;
      // Checks if this exact history record already exists (in-memory lookup)
      if (!existingHistoryKeys.has(historyKey)) {
        // Closes any other open history record
        const openHistory = openHistoryMap.get(player.puuid);
        if (openHistory) {
          const prevDay = new Date(playerDate);
          prevDay.setDate(playerDate.getDate() - 1);
          await closeHistoryRecord(openHistory.id, prevDay);
          openHistoryMap.delete(player.puuid);
        }
        // Inserts new team history
        const newId = await insertPlayerTeamHistory(player.puuid, team.id, playerDate);
        existingHistoryKeys.add(historyKey);
        if (newId) {
          openHistoryMap.set(player.puuid, { id: newId, teamId: team.id, startDate: dateStr });
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
};

export default teamHistoryUpdate;
