import { useNavigate } from "react-router-dom";

export const handlePlayerSearch = async (
    summonerName: string,
    setGameList: React.Dispatch<React.SetStateAction<Array<object>>>,
    navigate: ReturnType<typeof useNavigate>
  ) => {
    setGameList([]);
    try {

      const splitSummoner = summonerName.trim().split("");
      const hashtagIndex = splitSummoner.indexOf("#");
      if (hashtagIndex !== -1) {
        splitSummoner[hashtagIndex] = "%23";
      }
      const trimmedSummoner = splitSummoner.join("");
      const summonerDisplay = summonerName.split("#").join(" #")
  
      const gameResponse = await fetch(
        `http://localhost:8080/api/stats/${trimmedSummoner}`
      );
      const gameData: Array<object> = await gameResponse.json();
      const flatArr = gameData.flat();
      setGameList(flatArr);
  
      navigate(`/stats/${trimmedSummoner}`, { state: { gameData: gameData, summonerName: summonerDisplay } });
    } catch (err) {
      console.log(err);
    }
  };
  