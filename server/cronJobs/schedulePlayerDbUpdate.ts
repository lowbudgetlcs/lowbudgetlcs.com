import nodeCron from "node-cron";
import playerDbNameUpdater, {
  DbPlayer,
} from "../stats/playerTeamUpdaters/updatePlayersServices/playerDbNameUpdater";
import { playerSheetUpdaterService } from "../stats/playerTeamUpdaters/updatePlayersServices/playerSheetUpdaterService";
import teamHistoryUpdate from "../stats/playerTeamUpdaters/updateTeamServices/teamHistoryUpdater";

interface PlayerTypeProps {
  players: DbPlayer[];
  uniquePlayers: DbPlayer[];
}

const schedulePlayerDbUpdate = () => {
  const task = nodeCron.schedule(
    "0 3 * * *",
    async () => {
      try {
        console.log("--- Triggering Scheduled Player Update ---");
        const playerTypes: PlayerTypeProps | null = await playerSheetUpdaterService();

        if (!playerTypes || playerTypes.players.length === 0) {
          console.log("[DB Player Updater] No players from sheet to process.");
          return;
        }

        // Update teams and team history
        await teamHistoryUpdate(playerTypes.players);

        // Update summoner names
        await playerDbNameUpdater(playerTypes.uniquePlayers);
      } catch (err) {
        console.error("❌ [DB Player Updater] An error occurred while updating player names:", err);
      }
    },
    {
      timezone: "America/Chicago",
    }
  );

  console.log("👍 Player update job scheduled to run daily at 3:00 AM.");
  task.start();
};

export default schedulePlayerDbUpdate;
