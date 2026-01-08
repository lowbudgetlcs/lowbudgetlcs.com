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

const runPlayerUpdate = async () => {
  try {
    console.log("--- Triggering Scheduled Player Update ---");
    const playerTypes: PlayerTypeProps | null = await playerSheetUpdaterService();

    if (!playerTypes || playerTypes.players.length === 0) {
      console.log("[DB Player Updater] ✅ Job Finished: No players from sheet to process.");
      return;
    }

    // Update summoner names and ensure players exist in DB
    await playerDbNameUpdater(playerTypes.uniquePlayers);

    // Update teams and team history
    await teamHistoryUpdate(playerTypes.players);
  } catch (err) {
    console.error("❌ [DB Player Updater] An error occurred while updating player names:", err);
  }
};

const schedulePlayerDbUpdate = async () => {
  // Check time in Chicago (Target: 3:00 AM)
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    hour12: false,
  });
  const currentHour = parseInt(formatter.format(new Date()));

  // Skip if it's 2 AM (2:00-2:59), as the 3 AM cron will run soon
  if (currentHour === 2) {
    console.log(
      "--- Skipping Initial Player DB Update (Close to scheduled 3:00 AM run) ---"
    );
  } else {
    // Run on startup
    console.log("--- Running Initial Player DB Update ---");
    await runPlayerUpdate();
  }

  const task = nodeCron.schedule(
    "0 3 * * *",
    runPlayerUpdate,
    {
      timezone: "America/Chicago",
    }
  );

  console.log("👍 Player update job scheduled to run daily at 3:00 AM.");
  task.start();
};

export default schedulePlayerDbUpdate;
