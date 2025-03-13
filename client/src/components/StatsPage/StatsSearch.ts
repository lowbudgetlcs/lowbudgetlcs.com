import { useNavigate } from "react-router-dom";

export const handlePlayerSearch = async (
    summonerName: string,
    setGameList: React.Dispatch<React.SetStateAction<Array<object>>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    navigate: ReturnType<typeof useNavigate>
  ) => {
    setGameList([]);
    setError(null);
    try {
      const apiKey = process.env.VITE_BACKEND_API_KEY || "";
      const splitSummoner = summonerName.trim().split("");
      const hashtagIndex = splitSummoner.indexOf("#");
      if (hashtagIndex !== -1) {
        splitSummoner[hashtagIndex] = "%23";
      }
      const trimmedSummoner = splitSummoner.join("");
      const summonerDisplay = summonerName.split("#").join(" #")
  
      const gameResponse = await fetch(
        `https://backend.lowbudgetlcs.com/api/stats/player/${trimmedSummoner}`,
        {
          headers: {
            "x-api-key": apiKey,
          },
        }
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
      const gameData: Array<object> = await gameResponse.json();
      const flatArr = gameData.flat();
      setGameList(flatArr);
  
      navigate(`/stats/player/${trimmedSummoner}`, { state: { gameData: gameData, summonerName: summonerDisplay } });
    } catch (err: any) {
       setError(err.message || "An unexpected error occurred");   
    }
  };
  