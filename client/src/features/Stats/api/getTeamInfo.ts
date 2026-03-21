const getTeamInfo = async (teamId: number) => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const url = `${import.meta.env.VITE_BACKEND_URL}/stats/api/team/${teamId}`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch team info");
    }

    const teamInfo = await response.json();
    return teamInfo;
  } catch (error) {
    console.error("Error fetching team info:", error);
    return null;
  }
};

export default getTeamInfo;