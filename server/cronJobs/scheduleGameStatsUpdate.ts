import nodeCron from "node-cron";
import runDailyGameUpdate from "../stats/runDailyStatsUpdate";

const scheduleGameStatsUpdate = () => {
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
    }
  );

  console.log("👍 Game stats update job scheduled to run daily at 4:00 AM.");
  task.start();
};

export default scheduleGameStatsUpdate;
