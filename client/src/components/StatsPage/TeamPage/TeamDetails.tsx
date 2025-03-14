// import { useEffect, useState, useMemo } from "react";
// import {
//   GameStatsProps,
//   RosterProps,
//   ChampionProps,
//   BannedProps,
// } from "./StatsTeam";
import { LuSwords } from "react-icons/lu";
import { IoEye, IoBarbell } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import {
  GiMineExplosion,
} from "react-icons/gi";
import { FaRegClock, FaFlag } from "react-icons/fa";

function Details() {
  // const [champImages, setChampImages] = useState<Record<string, string>>({});
  // useEffect(() => {
  //   const modules = import.meta.glob("../../assets/champion/*.png");
  //   const images: Record<string, string> = {};

  //   // Get champion images from folder
  //   const loadImages = async () => {
  //     for (const path in modules) {
  //       const name = path.match(/([^/]+)(?=\.\w+$)/)?.[0];
  //       if (name) {
  //         const module = (await modules[path]()) as { default: string };
  //         images[name] = module.default;
  //       }
  //     }
  //     setChampImages(images);
  //   };
  //   loadImages();
  // }, []);
  // const teamCalculations = useMemo(() => {
  //   const league: string = "";
  //   const gamesPlayed = gameList.length;
  //   let wins: number = 0;
  //   let losses: number = 0;
  //   const totalGames: number = gameList.length;
  //   let totalGameTime: number = 0;
  //   let averageGTMinutes: number;
  //   let averageGTSeconds: number;
  //   const roster: Array<RosterProps> = [];
  //   const champions: ChampionProps[] = [];
  //   const bannedChampions: BannedProps[] = [];

  //   // Adds a win to total win count per won game
  //   gameList.forEach((game) => {
  //     if (game.win) {
  //       wins++;
  //     } else {
  //       losses++;
  //     }
  //     // Adds total game time from a singular player in the game since it is saved per player
  //     totalGameTime += game.players[0].stats.gameLength;

  //     game.players.forEach((player) => {
  //       // Adds champion object to champions array if the champion does not exist
  //       if (
  //         !champions.some(
  //           (champion) => champion.championName === player.stats.championName
  //         )
  //       ) {
  //         champions.push({
  //           championName: player.stats.championName,
  //           gamesPlayed: 1,
  //         });
  //       } else {
  //         // Find the champion object in the array and add 1 to gamesPlayed
  //         const selectedChampion = champions.find(
  //           (champion) => champion.championName === player.stats.championName
  //         );
  //         if (selectedChampion) {
  //           selectedChampion.gamesPlayed++;
  //         } else {
  //           console.error(
  //             "Error: Cannot find champion even though if it does not exist it should be created...?"
  //           );
  //         }
  //       }
  //     });
  //   });
  //   const sortedChampions = champions.sort(
  //     (a, b) => b.gamesPlayed - a.gamesPlayed
  //   );
  //   averageGTMinutes = Math.floor(totalGameTime / gameList.length / 60);
  //   averageGTSeconds = Math.floor((totalGameTime / gameList.length) % 60);
  //   const averageGameTime: string =
  //     averageGTMinutes + ":" + averageGTSeconds.toString().padStart(2, "0");
  //   const winLossRatio: number = Number(((wins / totalGames) * 100).toFixed(0));

  //   //Add players to roster with player Id hidden
  //   gameList[0].players.forEach((player) => {
  //     roster.push({
  //       id: player.playerId,
  //       playerName: player.playerName,
  //     });
  //   });
  //   return {
  //     winLossRatio,
  //     wins,
  //     losses,
  //     averageGameTime,
  //     roster,
  //     sortedChampions,
  //     gamesPlayed,
  //   };
  // }, [gameList]);
  return (
    <>

      <div className="detailsSection text-white flex md:flex-row flex-col justify-center items-center">
        <div className="statContainer flex flex-col w-full p-4">
          <div className="smallStatBoxes flex sm:grid flex-col grid-rows-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* KDA */}
            <div className="kdaContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
              <div className=" bg-red bg-opacity-50 p-1 rounded-md">
                <LuSwords className="text-white w-[25px] h-[25px]"></LuSwords>
              </div>
              <div className="text flex flex-col p-4 items-center sm:items-start">
                <h2 className="opacity-55">Team KDA</h2>
                <p className="text-2xl">3.4</p>
              </div>
            </div>
            {/* Vision Score */}
            <div className="kdaContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
              <div className=" bg-blue bg-opacity-50 p-1 rounded-md">
                <IoEye className="text-white w-[25px] h-[25px]"></IoEye>
              </div>
              <div className="text flex flex-col p-4 items-center sm:items-start">
                <h2 className="opacity-55">Vision Score/Game</h2>
                <p className="text-2xl">180</p>
              </div>
            </div>
            {/* Gold per Minute */}
            <div className="kdaContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
              <div className=" bg-yellow bg-opacity-50 p-1 rounded-md">
                <MdAttachMoney className="text-white w-[25px] h-[25px]"></MdAttachMoney>
              </div>
              <div className="text flex flex-col p-4 items-center sm:items-start">
                <h2 className="opacity-55">Gold/Min</h2>
                <p className="text-2xl">2000</p>
              </div>
            </div>
            {/* Damage/Min */}
            <div className="kdaContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
              <div className=" bg-gold-light bg-opacity-50 p-1 rounded-md">
                <GiMineExplosion className="text-white w-[25px] h-[25px]"></GiMineExplosion>
              </div>
              <div className="text flex flex-col p-4 items-center sm:items-start">
                <h2 className="opacity-55">Damage/Min</h2>
                <p className="text-2xl">3215</p>
              </div>
            </div>
            {/* Game Duration Average */}
            <div className="kdaContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
              <div className=" bg-green bg-opacity-50 p-1 rounded-md">
                <FaRegClock className="text-white w-[25px] h-[25px]"></FaRegClock>
              </div>
              <div className="text flex flex-col p-4 items-center sm:items-start">
                <h2 className="opacity-55">Avg. Game Duration</h2>
                <p className="text-2xl">22:15</p>
              </div>
            </div>
            {/* Feats of Strength*/}
            <div className="kdaContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
              <div className=" bg-purple bg-opacity-50 p-1 rounded-md">
                <IoBarbell className="text-white w-[25px] h-[25px]"></IoBarbell>
              </div>
              <div className="text flex flex-col p-4 items-center sm:items-start">
                <h2 className="opacity-55">Avg. Feats Completion</h2>
                <p className="text-2xl">42%</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 basis-0">
            {/* Roster */}
            <div className="roster my-8 flex flex-col p-4 border-2 border-gray bg-gray bg-opacity-20 rounded-md flex-1">
              <h2 className="text-xl font-bold border-b-2 border-white border-opacity-45">
                Roster
              </h2>
              <ul>
                <li className="flex gap-4 justify-between bg-black p-0.5">
                  <p className="inline-block">
                    ThyDuckyLord <span className="opacity-60">#NA1</span>
                  </p>
                  <p className="inline-block text-emerald-light">E4</p>
                </li>
                <li className="flex gap-4 justify-between p-0.5">
                  <p className="inline-block">
                    Tahmes <span className="opacity-60">#NA1</span>
                  </p>
                  <p className="inline-block text-purple brightness-125">M</p>
                </li>
                <li className="flex gap-4 justify-between bg-black p-0.5">
                  <p className="inline-block">
                    qiiqo <span className="opacity-60">#seir</span>
                  </p>
                  <p className="inline-block text-red">GM</p>
                </li>
                <li className="flex gap-4 justify-between p-0.5">
                  <p className="inline-block">
                    Seir <span className="opacity-60">#qiiqo</span>
                  </p>
                  <p className="inline-block text-white brightness-75">S2</p>
                </li>
                <li className="flex gap-4 justify-between bg-black p-0.5">
                  <p className="inline-block">
                    JackEBoy <span className="opacity-60">#roar</span>
                  </p>
                  <p className="inline-block text-platinum-light">P4</p>
                </li>
                <li className="flex gap-4 justify-between p-0.5">
                  <p className="inline-block">
                    ruuffian <span className="opacity-60">#weird</span>
                  </p>
                  <p className="inline-block text-gold-light">G2</p>
                </li>
                <li className="flex gap-4 justify-between bg-black p-0.5">
                  <p className="inline-block">
                    Praetorian <span className="opacity-60">#lblcs</span>
                  </p>
                  <p className="inline-block text-challenger-blue">D2</p>
                </li>
                <li className="flex gap-4 justify-between p-0.5">
                  <p className="inline-block">
                    cutwire <span className="opacity-60">#val</span>
                  </p>
                  <p className="inline-block text-gold-dark brightness-200">
                    B1
                  </p>
                </li>
              </ul>
            </div>
            {/* Champion Bans */}
            <div className="bans my-8 flex flex-col p-4 border-2 border-gray bg-gray bg-opacity-20 rounded-md flex-1">
              <h2 className="text-xl font-bold border-b-2 border-white border-opacity-45">
                Common Bans
              </h2>
              <ul>
                <li className="flex gap-4 justify-between bg-black py-0.5">
                  <p className="inline-block">
                    <span>Jhin</span>:
                  </p>
                  <p className="inline-block">12</p>
                </li>
                <li className="flex gap-4 justify-between py-0.5">
                  <p className="inline-block">
                    <span>Ornn</span>:
                  </p>
                  <p className="inline-block">8</p>
                </li>
                <li className="flex gap-4 justify-between bg-black py-0.5">
                  <p className="inline-block">
                    <span>Gwen</span>:
                  </p>
                  <p className="inline-block">6</p>
                </li>
                <li className="flex gap-4 justify-between marker:py-0.5">
                  <p className="inline-block">
                    <span>Maokai</span>:
                  </p>
                  <p className="inline-block">4</p>
                </li>
                <li className="flex gap-4 justify-between bg-black py-0.5">
                  <p className="inline-block">
                    <span>Jarvin IV</span>:
                  </p>
                  <p className="inline-block">3</p>
                </li>
                <li className="flex gap-4 justify-between py-0.5">
                  <p className="inline-block">
                    <span>Ashe</span>:
                  </p>
                  <p className="inline-block">2</p>
                </li>
                <li className="flex gap-4 justify-between bg-black py-0.5">
                  <p className="inline-block">
                    <span>Viktor</span>:
                  </p>
                  <p className="inline-block">5421</p>
                </li>
                <li className="flex gap-4 justify-between py-0.5">
                  <p className="inline-block">
                    <span>Annie</span>:
                  </p>
                  <p className="inline-block">12</p>
                </li>
              </ul>
            </div>
            {/* Champion Picks */}
            <div className="picks my-8 flex flex-col p-4 border-2 border-gray bg-gray bg-opacity-20 rounded-md flex-1">
              <h2 className="text-xl font-bold border-b-2 border-white border-opacity-45">
                Common Picks
              </h2>
              <ul>
                <li className="flex gap-4 justify-between bg-black py-0.5">
                  <p className="inline-block">
                    <span>Jhin</span>:
                  </p>
                  <p className="inline-block">18</p>
                </li>
                <li className="flex gap-4 justify-between py-0.5">
                  <p className="inline-block">
                    <span>Ornn</span>:
                  </p>
                  <p className="inline-block">8</p>
                </li>
                <li className="flex gap-4 justify-between bg-black py-0.5">
                  <p className="inline-block">
                    <span>Poppy</span>:
                  </p>
                  <p className="inline-block">16</p>
                </li>
                <li className="flex gap-4 justify-between marker:py-0.5">
                  <p className="inline-block">
                    <span>Rell</span>:
                  </p>
                  <p className="inline-block">723</p>
                </li>
                <li className="flex gap-4 justify-between bg-black py-0.5">
                  <p className="inline-block">
                    <span>Jarvin IV</span>:
                  </p>
                  <p className="inline-block">8</p>
                </li>
                <li className="flex gap-4 justify-between py-0.5">
                  <p className="inline-block">
                    <span>Ashe</span>:
                  </p>
                  <p className="inline-block">3</p>
                </li>
                <li className="flex gap-4 justify-between bg-black py-0.5">
                  <p className="inline-block">
                    <span>Viktor</span>:
                  </p>
                  <p className="inline-block">5421</p>
                </li>
                <li className="flex gap-4 justify-between py-0.5">
                  <p className="inline-block">
                    <span>Annie</span>:
                  </p>
                  <p className="inline-block">24</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Stat Distribution Bars */}
          <h2 className="text-2xl font-bold text-center pb-2">Distribution</h2>
          <div className="statDistribution flex flex-col md:grid grid-cols-2 gap-4">
            {/* Gold Distribution */}
            <div className="gold bg-gray bg-opacity-20 border-2 border-gray rounded-md p-4 flex-1">
              <div className="flex items-center gap-4 pb-4">
                <div className=" bg-yellow bg-opacity-50 p-1 rounded-md">
                  <MdAttachMoney className="text-white w-[25px] h-[25px]"></MdAttachMoney>
                </div>
                <h3 className="text-xl">Gold</h3>
              </div>
              <div className="bars">
                <div className="topBar my-0.5">
                  <div className="flex justify-between">
                    <p>Top</p>
                    <p>30%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[30%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="jungleBar my-0.5">
                  <div className="flex justify-between">
                    <p>Jungle</p>
                    <p>15%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[15%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="midBar my-0.5">
                  <div className="flex justify-between">
                    <p>Middle</p>
                    <p>15%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[15%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="botBar my-0.5">
                  <div className="flex justify-between">
                    <p>Bottom</p>
                    <p>35%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[35%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="supportBar my-0.5">
                  <div className="flex justify-between">
                    <p>Support</p>
                    <p>5%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[5%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Damage Distribution */}
            <div className="damage bg-gray bg-opacity-20 border-2 border-gray rounded-md p-4 flex-1">
              <div className="flex items-center gap-4 pb-4">
                <div className=" bg-gold-light bg-opacity-50 p-1 rounded-md">
                  <GiMineExplosion className="text-white w-[25px] h-[25px]"></GiMineExplosion>
                </div>
                <h3 className="text-xl">Damage</h3>
              </div>
              <div className="bars">
                <div className="topBar my-0.5">
                  <div className="flex justify-between">
                    <p>Top</p>
                    <p>30%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[30%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="jungleBar my-0.5">
                  <div className="flex justify-between">
                    <p>Jungle</p>
                    <p>15%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[15%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="midBar my-0.5">
                  <div className="flex justify-between">
                    <p>Middle</p>
                    <p>15%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[15%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="botBar my-0.5">
                  <div className="flex justify-between">
                    <p>Bottom</p>
                    <p>35%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[35%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="supportBar my-0.5">
                  <div className="flex justify-between">
                    <p>Support</p>
                    <p>5%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[5%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Vision Distribution */}
            <div className="vision bg-gray bg-opacity-20 border-2 border-gray rounded-md p-4 flex-1">
              <div className="flex items-center gap-4 pb-4">
                <div className=" bg-blue bg-opacity-50 p-1 rounded-md">
                  <IoEye className="text-white w-[25px] h-[25px]"></IoEye>
                </div>
                <h3 className="text-xl">Vision</h3>
              </div>
              <div className="bars">
                <div className="topBar my-0.5">
                  <div className="flex justify-between">
                    <p>Top</p>
                    <p>5%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[5%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="jungleBar my-0.5">
                  <div className="flex justify-between">
                    <p>Jungle</p>
                    <p>15%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[15%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="midBar my-0.5">
                  <div className="flex justify-between">
                    <p>Middle</p>
                    <p>15%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[15%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="botBar my-0.5">
                  <div className="flex justify-between">
                    <p>Bottom</p>
                    <p>35%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[35%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="supportBar my-0.5">
                  <div className="flex justify-between">
                    <p>Support</p>
                    <p>35%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[35%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Objective Control */}
            <div className="Objective Control bg-gray bg-opacity-20 border-2 border-gray rounded-md p-4 flex-1">
              <div className="flex items-center gap-4 pb-4">
                <div className=" bg-green bg-opacity-50 p-1 rounded-md">
                  <FaFlag className="text-white w-[25px] h-[25px]"></FaFlag>
                </div>
                <h3 className="text-xl">Objective Control</h3>
              </div>
              <div className="bars">
                <div className="dragonBar my-0.5">
                  <div className="flex justify-between">
                    <p>Dragons</p>
                    <p>55%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[55%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="towerBar my-0.5">
                  <div className="flex justify-between">
                    <p>Towers</p>
                    <p>38%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[38%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="grubBar my-0.5">
                  <div className="flex justify-between">
                    <p>Void Grubs</p>
                    <p>55%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[55%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="baronBar my-0.5">
                  <div className="flex justify-between">
                    <p>Barons</p>
                    <p>80%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[80%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
                <div className="baronBar my-0.5">
                  <div className="flex justify-between">
                    <p>Atakhans</p>
                    <p>100%</p>
                  </div>
                  <div className="relative w-full h-2 bg-gray rounded-lg">
                    <div className="absolute top-0 w-[100%] bg-white h-2 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Details;
