import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const handlePlayerSearch = async (summonerName: string) => {
  const [gameList, setGameList] = useState<Array<object>>([]);
  const navigate = useNavigate();
  setGameList([]);
  try {
    const splitSummoner = summonerName.trim().split("");
    const hashtagindex = splitSummoner.indexOf("#");
    if (hashtagindex) {
      splitSummoner[hashtagindex] = "%23";
    }
    const trimmedSummoner = splitSummoner.join("");
    console.log(trimmedSummoner);
    const gameResponse = await fetch(
      `http://localhost:8080/api/stats/${trimmedSummoner}`
    );
    const gameData: Array<object> = await gameResponse.json();
    const flatArr = gameData.flat();
    for (let i = 0; i < flatArr.length; i++) {
      gameList.push(flatArr[i]);
    }
    navigate(`/stats/${trimmedSummoner}`, { state: { gameData: gameData } });
  } catch (err) {
    console.log(err);
  }
};
