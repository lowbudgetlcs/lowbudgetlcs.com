import { RosterData } from "../types/RosterTypes";

const getRosterData = async (): Promise<RosterData> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/roster/api/rosterdata`);

    if (!response.ok) {
      throw new Error("Failed to fetch roster data");
    }
    const rosterData: RosterData = await response.json();

    return rosterData;
  } catch (error) {
    console.error("Error fetching roster data:", error);
    throw error;
  }
};

export default getRosterData;
