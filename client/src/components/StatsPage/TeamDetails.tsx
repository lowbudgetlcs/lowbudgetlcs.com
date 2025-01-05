import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  GameStatsProps,
  RosterProps,
  ChampionProps,
  BannedProps,
} from "./StatsTeam";

function Details({ gameList }: { gameList: Array<GameStatsProps> }) {
  const [champImages, setChampImages] = useState<Record<string, string>>({});
  useEffect(() => {
    const modules = import.meta.glob("../../assets/champion/*.png");
    const images: Record<string, string> = {};

    // Get champion images from folder
    const loadImages = async () => {
      for (const path in modules) {
        const name = path.match(/([^/]+)(?=\.\w+$)/)?.[0];
        if (name) {
          const module = (await modules[path]()) as { default: string };
          images[name] = module.default;
        }
      }
      setChampImages(images);
    };
    loadImages();
  }, []);
  const teamCalculations = useMemo(() => {
    const league: string = "";
    const gamesPlayed = gameList.length;
    let wins: number = 0;
    let losses: number = 0;
    const totalGames: number = gameList.length;
    let totalGameTime: number = 0;
    let averageGTMinutes: number;
    let averageGTSeconds: number;
    const roster: Array<RosterProps> = [];
    const champions: ChampionProps[] = [];
    const bannedChampions: BannedProps[] = [];

    // Adds a win to total win count per won game
    gameList.forEach((game) => {
      if (game.win) {
        wins++;
      } else {
        losses++;
      }
      // Adds total game time from a singular player in the game since it is saved per player
      totalGameTime += game.players[0].stats.gameLength;

      game.players.forEach((player) => {
        // Adds champion object to champions array if the champion does not exist
        if (
          !champions.some(
            (champion) => champion.championName === player.stats.championName
          )
        ) {
          champions.push({
            championName: player.stats.championName,
            gamesPlayed: 1,
          });
        } else {
          // Find the champion object in the array and add 1 to gamesPlayed
          const selectedChampion = champions.find(
            (champion) => champion.championName === player.stats.championName
          );
          if (selectedChampion) {
            selectedChampion.gamesPlayed++;
          } else {
            console.error(
              "Error: Cannot find champion even though if it does not exist it should be created...?"
            );
          }
        }
      });
    });
    const sortedChampions = champions.sort(
      (a, b) => b.gamesPlayed - a.gamesPlayed
    );
    averageGTMinutes = Math.floor(totalGameTime / gameList.length / 60);
    averageGTSeconds = Math.floor((totalGameTime / gameList.length) % 60);
    const averageGameTime: string =
      averageGTMinutes + ":" + averageGTSeconds.toString().padStart(2, "0");
    const winLossRatio: number = Number(((wins / totalGames) * 100).toFixed(0));

    //Add players to roster with player Id hidden
    gameList[0].players.forEach((player) => {
      roster.push({
        id: player.playerId,
        playerName: player.playerName,
      });
    });
    return {
      winLossRatio,
      wins,
      losses,
      averageGameTime,
      roster,
      sortedChampions,
      gamesPlayed,
    };
  }, [gameList]);
  return (
    <div className="detailsSection text-white flex md:flex-row flex-col items-center p-4">
      <div className="statContainer flex flex-col md:grid grid-cols-2 md:grid-cols-3 grid-rows-3 gap-6 p-4 md:p-8 lg:py-12 lg:px-24">
        {/* Win Loss Ratio */}
        <div className="winLossRatio col-start-1 md:col-start-2 p-4 bg-gray flex flex-col gap-4 justify-center items-center rounded-md">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <p className="text-4xl text-orange">
                {teamCalculations.gamesPlayed}
              </p>
              <p className="text-lg text-wrap text-center">Games</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-4xl text-blue">{teamCalculations.wins}</p>
              <p className="text-lg text-center">Wins</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-4xl text-red">{teamCalculations.losses}</p>
              <p className="text-lg text-center">losses</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p
              className={`text-6xl ${
                teamCalculations.winLossRatio >= 50 ? "text-blue" : "text-red"
              }`}
            >
              {teamCalculations.winLossRatio}%
            </p>
            <p className="text-xl text-wrap text-center">Win Rate</p>
          </div>
        </div>
        {/* Average Game Time */}
        <div className="AvgGameTime col-start-2 md:col-start-3 p-4 bg-gray flex flex-col justify-center items-center rounded-md">
          <p className="text-6xl text-orange">
            {teamCalculations.averageGameTime}
          </p>
          <p className="text-lg">Average Game Time </p>
        </div>
        {/* Team Roster */}
        <div className="roster col-start-1 col-end-3 md:col-end-2 row-start-4 md:row-start-1 row-end-6 md:row-end-3 flex flex-col p-4 bg-gray rounded-md">
          <div className="flex justify-center pb-4">
            <h2 className="font-bold text-2xl">Roster</h2>
          </div>
          <ul className="rosterList flex flex-col gap-4 p-4">
            {teamCalculations.roster.map((player) => {
              const modifiedPlayerName = player.playerName.replace("#", " #");
              return (
                // TODO: Refactor code to allow link to work
                <div key={player.id}>
                  <li className="text-lg lg:text-xl  duration-500">
                    {modifiedPlayerName}
                  </li>
                </div>
              );
            })}
          </ul>
        </div>
        {/* Champion Bans */}
        <div className="roster col-start-1 col-end-3 md:col-end-2 row-start-6 md:row-start-3 md:row-span-1 flex flex-col p-4 bg-gray rounded-md">
          <div className="flex justify-center pb-4">
            <h2 className="font-bold text-2xl text-center text-wrap">
              Commonly Banned Champions
            </h2>
          </div>
          <ul className="rosterList flex flex-col gap-2 items-center justify-center">
            <p className="text-4xl text-wrap text-center">Coming Soon™</p>
          </ul>
        </div>
                {/* Champions Played */}
                <div className="champsPlayed row-start-2 row-span-1 md:row-span-2 lg:row-span-1 col-start-1 md:col-start-2 col-end-3 md:col-end-4 flex flex-col p-4 bg-gray rounded-md items-center">
          <h2 className="font-bold text-2xl">Champions Played</h2>
          <div className="championContainer flex flex-wrap gap-2 p-4">
            {teamCalculations.sortedChampions.map((champion) => {
              return (
                <div className="champion relative w-[50px] h-[50px]">
                  <img
                    className="w-[50px] h-[50px] bg-gray"
                    src={champImages[champion.championName]}
                  ></img>
                  <div className="absolute bottom-0.5 right-0.5 bg-black px-1 leading-4">
                    {champion.gamesPlayed}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* First Bloods */}
        <div className="firstBloods col-start-1 md:col-start-2 col-end-3 md:col-end-4 bg-gray flex flex-col p-4 items-center rounded-md">
          <h2 className="font-bold text-2xl text-center text-wrap p-2">
            First Bloods
          </h2>
          <div className="firstBloodsContainer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-4 gap-4">
            <p className="text-lg col-start-1">Champions: </p>
            <p className="number col-start-2 text-orange">0</p>
            <p className="text-lg col-start-1">Dragons: </p>
            <p className="number col-start-2 text-orange">0</p>
            <p className="text-lg col-start-1">Grubs: </p>
            <p className="number col-start-2 text-orange">0</p>
            <p className="text-lg sm:col-start-3 row-start-1">Heralds: </p>
            <p className="number sm:col-start-4 row-start-1 text-orange">0</p>
            <p className="text-lg sm:col-start-3 row-start-2">Towers: </p>
            <p className="number sm:col-start-4 row-start-2 text-orange">0</p>
            <p className="text-lg sm:col-start-3 row-start-3">Atakhan: </p>
            <p className="number sm:col-start-4 row-start-3 text-orange">0</p>
            <p className="text-lg col-start-1 lg:col-start-2 row-start-4">
              Barons:{" "}
            </p>
            <p className="number col-start-2 lg:col-start-3 row-start-4 text-orange">
              0
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Details;
