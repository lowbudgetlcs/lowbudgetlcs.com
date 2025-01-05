import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { GameStatsProps, RosterProps, ChampionProps } from "./StatsTeam";

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
      console.log(champImages);
    };
    loadImages();
  }, []);
  const teamCalculations = useMemo(() => {
    const league: string = "";
    let wins: number = 0;
    let losses: number = 0;
    const totalGames: number = gameList.length;
    let totalGameTime: number = 0;
    let averageGTMinutes: number;
    let averageGTSeconds: number;
    const roster: Array<RosterProps> = [];
    const champions: ChampionProps[] = [];

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

    averageGTMinutes = Math.floor(totalGameTime / gameList.length / 60);
    averageGTSeconds = Math.floor((totalGameTime / gameList.length) % 60);
    const averageGameTime: string = averageGTMinutes + ":" + averageGTSeconds;
    const winLossRatio: number = Number(((wins / totalGames) * 100).toFixed(0));

    //Add players to roster with player Id hidden
    gameList[0].players.forEach((player) => {
      roster.push({
        id: player.playerId,
        playerName: player.playerName,
      });
    });
    return { winLossRatio, wins, losses, averageGameTime, roster, champions };
  }, [gameList]);
  return (
    <div className="detailsSection text-white flex md:flex-row flex-col items-center p-4">
      <div className="statContainer grid grid-cols-4 grid-rows-8 gap-4">
        {/* Team Roster */}
        <div className="roster col-start-1 flex flex-col p-4 bg-gray rounded-md">
          <div className="flex justify-center pb-4">
            <h2 className="font-bold text-xl">Roster</h2>
          </div>
          <ul className="rosterList flex flex-col gap-2">
            {teamCalculations.roster.map((player) => {
              const modifiedPlayerName = player.playerName.replace("#", " #");
              return (
                // TODO: Refactor code to allow link to work
                <Link key={player.id} to={`/stats/player/${player.playerName}`}>
                  <li className="hover:text-orange hover:transition duration-500">
                    {modifiedPlayerName}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
        {/* Win Loss Ratio */}
        <div className="winLossRatio col-start-2 p-4 bg-gray flex flex-col gap-4 justify-center items-center">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <p className="text-4xl">{teamCalculations.wins}</p>
              <p className="text-lg">Wins</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-5xl">{teamCalculations.losses}</p>
              <p className="text-lg">Losses</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-6xl">{teamCalculations.winLossRatio}%</p>
            <p className="text-lg">Win Rate</p>
          </div>
        </div>
        {/* Average Game Time */}
        <div className="AvgGameTime col-start-3 p-4 bg-gray flex flex-col justify-center items-center">
          <p className="text-6xl">{teamCalculations.averageGameTime}</p>
          <p className="text-lg">Average Game Time </p>
        </div>

        {/* Champions Played */}
        <div className="champsPlayed row-start-2 row-span-2 col-span-4 flex flex-col p-4 bg-gray rounded-md items-center md:max-w-[45%]">
          <h2 className="font-bold text-xl">Champions Played</h2>
          <div className="championContainer flex flex-wrap gap-2 p-4">
            {teamCalculations.champions.map((champion) => {
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
      </div>
    </div>
  );
}

export default Details;
