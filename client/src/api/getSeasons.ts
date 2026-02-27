import { Seasons } from "../types/Seasons";

const getSeasons = async (): Promise<Seasons[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stats/api/seasons`);

    if (!response.ok) {
      throw new Error("Failed to fetch seasons data");
    }
    const seasonsData: Seasons[] = await response.json();

    return seasonsData;
  } catch (error) {
    console.error("Error fetching seasons data:", error);
    throw error;
  }
};

export default getSeasons;
