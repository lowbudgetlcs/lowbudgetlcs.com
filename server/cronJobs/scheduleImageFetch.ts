import nodeCron from "node-cron";
import { storeAllImages } from "../images/storeAllImages";

const scheduleImageFetch = () => {
  // Run on startup
  console.log("--- Running Initial Image Fetch ---");
  storeAllImages();

  // Schedule for 2am
  const task = nodeCron.schedule(
    "0 2 * * *",
    async () => {
      try {
        console.log("--- Triggering Scheduled Image Update ---");
        await storeAllImages();
      } catch (err) {
        console.error("❌ [Image Updater] An error occurred while updating images:", err);
      }
    },
    {
      timezone: "America/Chicago",
    }
  );

  console.log("👍 Image update job scheduled to run daily at 2:00 AM.");
  task.start();
};

export default scheduleImageFetch;