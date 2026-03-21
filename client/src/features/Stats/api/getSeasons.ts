import { Seasons } from "../../../types/Seasons";

const getSeasons = async () => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const url = `${import.meta.env.VITE_BACKEND_URL}/stats/api/seasons`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch seasons");
    }

    const seasons: Seasons[] = await response.json();
    return seasons;
  } catch (error) {
    console.error("Error fetching seasons:", error);
    return [];
  }
};

export default getSeasons;