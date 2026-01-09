import { useNavigate } from "react-router-dom";

export const handlePlayerSearch = async (
    summonerName: string,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    navigate: ReturnType<typeof useNavigate>
  ) => {
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
      const splitSummoner = summonerName.trim().split("#");
      const actualSummonerName = splitSummoner[0]
      const tagLine = splitSummoner[1]
  
      const gameResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/stats/api/player/check/${actualSummonerName.toLowerCase()}/${tagLine.toLowerCase()}`,
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
  
      navigate(`/stats/player/${encodeURIComponent(actualSummonerName)}-${encodeURIComponent(tagLine)}`);
    } catch (err: any) {
       setError(err.message || "An unexpected error occurred");   
    }
  };
  