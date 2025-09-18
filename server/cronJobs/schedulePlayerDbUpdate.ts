import nodeCron from "node-cron";
import playerDbNameUpdater from "../stats/updatePlayersServices/playerDbNameUpdater";

const schedulePlayerDbUpdate = () => {
  nodeCron.schedule(
    "0 3 * * *",
    () => {
      console.log("--- Triggering Scheduled Player Update ---");
      playerDbNameUpdater();
    },
    {
      timezone: "America/Chicago",
    }
  );

  console.log("👍 Player update job scheduled to run daily at 3:00 AM.");
};

export default schedulePlayerDbUpdate;