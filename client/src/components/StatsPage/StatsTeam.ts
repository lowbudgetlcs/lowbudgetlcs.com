
export const handleTeamSearch = async (
  teamID: number,
  // React Hooks
  setGameList: React.Dispatch<React.SetStateAction<Array<object>>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  setGameList([]);
  setError(null);
  try {
    // Fetch game data from db
    const gameResponse = await fetch(
      `http://localhost:8080/api/stats/team/${teamID}`
    );

    if (!gameResponse.ok) {
      // Handle specific status codes
      switch (gameResponse.status) {
        case 404:
          throw new Error("Player not found. Did you spell correctly?");
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error("Failed to fetch player data.");
      }
    }
    // Get game data and update gameList
    const gameData: Array<object> = await gameResponse.json();
    setGameList(gameData);
  } catch (err: any) {
    setError(err.message || "An unexpected error occurred");
  }
};
