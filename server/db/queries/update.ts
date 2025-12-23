import { eq } from "drizzle-orm";
import { db } from "..";
import { DbPlayer } from "../../stats/playerTeamUpdaters/updatePlayersServices/playerDbNameUpdater";
import { playersInWebsite, playerTeamHistoryInWebsite } from "../schema";
import formatDate from "../../stats/utils/formatDate";

export const updateSummonerNames = async (
  playersToUpdate: DbPlayer[],
  playersToInsert: DbPlayer[]
) => {
  try {
    await db.transaction(async (t) => {
      if (playersToInsert.length > 0) {
        console.log(
          `[DB Player Updater] Found ${playersToInsert.length} new players. Inserting now...`
        );
        await t.insert(playersInWebsite).values(playersToInsert);
      }

      // Handle updates if there are any
      if (playersToUpdate.length > 0) {
        console.log(
          `[DB Player Updater] Found ${playersToUpdate.length} players with changes. Updating now...`
        );
        const updatePromises = playersToUpdate.map((player) =>
          t
            .update(playersInWebsite)
            .set({
              summonerName: player.summonerName,
              tagLine: player.tagLine,
            })
            .where(eq(playersInWebsite.puuid, player.puuid))
        );
        await Promise.all(updatePromises);
      }
      return;
    });
  } catch (err) {
    console.error("[DB Player Updater] Error in database update transaction: ", err);
    throw new Error("Failed to update database");
  }
};

export const closeHistoryRecord = async (id: number, date: Date) => {
  try {
    const formattedDate = date.toISOString().split("T")[0];
    await db
      .update(playerTeamHistoryInWebsite)
      .set({ endDate: formattedDate })
      .where(eq(playerTeamHistoryInWebsite.id, id));
  } catch (err) {
    console.error("[DB History Updater] Error in record closing: ", err);
    throw new Error("Failed to update database");
  }
};
