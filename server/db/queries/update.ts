import { eq } from "drizzle-orm";
import { db } from "..";
import { DbPlayer } from "../../stats/updatePlayersServices/playerDbNameUpdater";
import { playersInWebsite } from "../schema";

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
