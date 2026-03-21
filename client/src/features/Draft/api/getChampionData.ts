const getChampionData = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/draft/api/championData`);
    if (!response.ok) {
      throw new Error("Failed to fetch champion data");
    }
    const data = await response.json();
    return data.map((champion: any) => ({
      id: champion.id,
      name: champion.name,
      roles: champion.roles,
      displayName: champion.displayName,
    }));
  } catch (error) {
    console.error("Error fetching champion data:", error);
    return [];
  }
};
export default getChampionData;