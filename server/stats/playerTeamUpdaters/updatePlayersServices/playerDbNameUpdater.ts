import { getPlayersByPuuid } from "../../../db/queries/select";
import { updateSummonerNames } from "../../../db/queries/update";
import { playerSheetUpdaterService } from "./playerSheetUpdaterService";

export interface DbPlayer {
  summonerName: string;
  tagLine: string;
  puuid: string;
  teamState: "Add" | "Remove";
  teamName: string;
  date: Date;
  divisionId: number | null;
}

const playerDbNameUpdater = async () => {
  try {
    const playersFromSheet = await playerSheetUpdaterService();

    if (!playersFromSheet || playersFromSheet.length === 0) {
      console.log("[DB Player Updater] No players from sheet to process.");
      return;
    }

    const puuidsToCheck = playersFromSheet.map((p) => p.puuid);

    const dbPlayers = await getPlayersByPuuid(puuidsToCheck);
    const dbPlayerMap = new Map(dbPlayers.map((p) => [p.puuid, p]));

    const playersToUpdate: DbPlayer[] = [];
    const playersToInsert: DbPlayer[] = [];

    for (const sheetPlayer of playersFromSheet) {
      const dbPlayer = dbPlayerMap.get(sheetPlayer.puuid);

      if (dbPlayer) {
        // This player EXISTS in the DB. Checks if it needs an update.
        if (
          dbPlayer.summonerName !== sheetPlayer.summonerName ||
          dbPlayer.tagLine !== sheetPlayer.tagLine
        ) {
          playersToUpdate.push(sheetPlayer);
        }
      } else {
        // This player does NOT exist in the DB. Adds it to the insert list.
        playersToInsert.push(sheetPlayer);
      }
    }

    if (playersToInsert.length === 0 && playersToUpdate.length === 0) {
      console.log("✅ [DB Player Updater] All players are present and up to date.");
      return;
    }

    await updateSummonerNames(playersToUpdate, playersToInsert);

    console.log(
      `✅ [DB Player Updater] Updated ${playersToUpdate.length} & Inserted ${playersToInsert.length} players.`
    );
    return;
  } catch (err) {
    console.error("❌ [DB Player Updater] An error occurred while updating player names:", err);
  }
};

export default playerDbNameUpdater;