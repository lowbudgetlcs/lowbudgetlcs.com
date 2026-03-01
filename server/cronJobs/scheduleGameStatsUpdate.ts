import nodeCron from "node-cron";
import runDailyGameUpdate from "../stats/runDailyStatsUpdate";

const scheduleGameStatsUpdate = () => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    hour12: false,
  });
  const currentHour = parseInt(formatter.format(new Date()));

  if (currentHour === 3) {
    console.log("--- Skipping Initial Game Stats Update (Close to scheduled 4:00 AM run) ---");
  } else {
    // Run on startup
    console.log("--- Running Initial Game Stats Update ---");
    runDailyGameUpdate();
  }

  const task = nodeCron.schedule(
    "0 4 * * *",
    async () => {
      try {
        console.log("--- Triggering Scheduled Game Stats Update ---");
        await runDailyGameUpdate();
      } catch (err) {
        console.error("❌ [Game Stats Updater] An error occurred while updating game stats:", err);
      }
    },
    {
      timezone: "America/Chicago",
    },
  );

  console.log("👍 Game stats update job scheduled to run daily at 4:00 AM.");
  task.start();
};

export default scheduleGameStatsUpdate;
