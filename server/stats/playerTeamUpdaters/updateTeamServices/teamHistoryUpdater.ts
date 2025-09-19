import { insertPlayerTeamHistory, insertTeams } from "../../../db/queries/insert";
import {
  doesHistoryExist,
  findOpenHistoryForPlayer,
  getAllTeams,
  getSelectTeams,
} from "../../../db/queries/select";
import { closeHistoryRecord } from "../../../db/queries/update";
import { DbPlayer } from "../updatePlayersServices/playerDbNameUpdater";

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

  const sortedPlayersByDate = players.sort(
    (a, b) => a.date!.getTime() - b.date!.getTime()
  );

  for (const player of sortedPlayersByDate) {
    const team = allTeamMap.get(player.teamName);
    if (!team || !player.puuid) continue;

    const playerDate = player.date;

    if (player.teamState.toLowerCase() === "add") {
      // Checks if this exact history record already exists in the database.
      const alreadyExists = await doesHistoryExist(player.puuid, team.id, playerDate);
      if (!alreadyExists) {
        // Closes any other open history record
        const openHistory = await findOpenHistoryForPlayer(player.puuid);
        if (openHistory) {
          const prevDay = new Date(playerDate);
          prevDay.setDate(playerDate.getDate() - 1);
          await closeHistoryRecord(openHistory.id, prevDay);
        }
        // Inserts new team history
        await insertPlayerTeamHistory(player.puuid, team.id, playerDate);
      }
    } else if (player.teamState.toLowerCase() === "remove") {
      const openHistory = await findOpenHistoryForPlayer(player.puuid);
      if (openHistory) {
        await closeHistoryRecord(openHistory.id, playerDate);
      }
    }
  }
};

export default teamHistoryUpdate;
