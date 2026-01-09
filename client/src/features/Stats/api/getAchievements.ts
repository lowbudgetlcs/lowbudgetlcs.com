export interface StatAchievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const getAchievements = async (): Promise<StatAchievement[]> => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const url = `${import.meta.env.VITE_BACKEND_URL}/stats/api/achievements`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch achievements");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getAchievements;
