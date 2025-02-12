import { useEffect, useState } from "react";
import { Link, } from "react-router-dom";
import { LuSwords } from "react-icons/lu";
import { IoEye, } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import {
  GiCoffin,
} from "react-icons/gi";
import {
  FaCrown,
  FaChevronDown,
  FaSkull,
} from "react-icons/fa";
import top from "../../assets/icons/top.svg";
import { BsGraphUp } from "react-icons/bs";
import { FaWheatAwn } from "react-icons/fa6";
import { PiCampfireFill } from "react-icons/pi";
// import ornn from "../../assets/champion/Ornn.png";
// import gwen from "../../assets/champion/Gwen.png";
// import maokai from "../../assets/champion/Maokai.png";
// import volibear from "../../assets/champion/Volibear.png";
// interface Game {
//   id: number;
//   kills: number;
//   deaths: number;
//   assists: number;
//   level: number;
//   gold: number;
//   visionScore: number;
//   damage: number;
//   healing: number;
//   shielding: number;
//   damageTaken: number;
//   selfMitigatedDamage: number;
//   damageToTurrets: number;
//   longestLife: number;
//   doubleKills: number;
//   tripleKills: number;
//   quadraKills: number;
//   pentaKills: number;
//   gameLength: number;
//   win: boolean;
//   cs: number;
//   championName: string;
//   teamKills: number;
//   shortCode: string;
//   performanceId: number;
// }

// interface LocationState {
//   gameData: Game[][];
//   summonerName: string;
// }

// interface SumTotalProps {
//   averageCSM: number;
//   totalCS: number;
//   totalGold: number;
//   totalVS: number;
//   totalDmg: number;
//   totalHeal: number;
//   totalShield: number;
//   totalDmgTkn: number;
//   totalSelfMtgDmg: number;
// }

interface PlayerProps {
  name: string;
  tag: string;
}

function StatsPlayer() {
  const [selectedPlayer, setSelectedPlayer] = useState<string>("ThyDuckyLord");
  const [players, setPlayers] = useState<Array<PlayerProps>>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const navigate = useNavigate();
  // const location = useLocation();
  // const state = location.state as LocationState | undefined;
  // const [champImages, setChampImages] = useState<Record<string, string>>({});
  // const [sumTotal, setSumTotal] = useState<SumTotalProps>({
  //   averageCSM: 0,
  //   totalCS: 0,
  //   totalGold: 0,
  //   totalVS: 0,
  //   totalDmg: 0,
  //   totalHeal: 0,
  //   totalShield: 0,
  //   totalDmgTkn: 0,
  //   totalSelfMtgDmg: 0,
  // });

  // useEffect(() => {
  //   const modules = import.meta.glob("../../assets/champion/*.png");
  //   const images: Record<string, string> = {};

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

  // if (!state?.gameData || state.gameData.length === 0) {
  //   console.log("no player");
  //   navigate("/stats");
  //   return null;
  // }

  // const allGameData: Game[] = state.gameData.flat();
  // const summonerName = state.summonerName;

  // const handleTime = (gameLength: number) => {
  //   const minutes = Math.floor(gameLength / 60);
  //   let seconds = gameLength - minutes * 60;
  //   let stringSeconds = seconds.toString();
  //   if (seconds < 10) {
  //     stringSeconds = `0${stringSeconds}`;
  //   }
  //   const time = minutes + ":" + stringSeconds;
  //   return time;
  // };

  // useEffect(() => {
  //   if (state?.gameData) {
  //     const allGameData = state.gameData.flat();
  //     const calculateSumStats = () => {
  //       let sumTotal: SumTotalProps = {
  //         averageCSM: 0,
  //         totalCS: 0,
  //         totalGold: 0,
  //         totalVS: 0,
  //         totalDmg: 0,
  //         totalHeal: 0,
  //         totalShield: 0,
  //         totalDmgTkn: 0,
  //         totalSelfMtgDmg: 0,
  //       };

  //       allGameData.forEach((game) => {
  //         sumTotal.totalCS += game.cs;
  //         sumTotal.totalGold += game.gold;
  //         sumTotal.totalVS += game.visionScore || 0;
  //         sumTotal.totalDmg += game.damage || 0;
  //         sumTotal.totalHeal += game.healing || 0;
  //         sumTotal.totalShield += game.shielding || 0;
  //         sumTotal.totalDmgTkn += game.damageTaken || 0;
  //         sumTotal.totalSelfMtgDmg += game.selfMitigatedDamage || 0;
  //       });

  //       const totalGameTime = allGameData.reduce(
  //         (sum, game) => sum + (game.gameLength / 60 || 0),
  //         0
  //       );
  //       sumTotal.averageCSM =
  //         totalGameTime > 0 ? sumTotal.totalCS / totalGameTime : 0;

  //       return sumTotal;
  //     };

  //     setSumTotal(calculateSumStats());
  //   } else {
  //     console.log("No player data");
  //     navigate("/stats");
  //   }
  // }, [state, navigate]);
  useEffect(() => {
    const grabbedPlayers = [
      {
        name: "ThyDuckyLord",
        tag: "#NA1",
      },
      {
        name: "Seir",
        tag: "#qiiqo",
      },
      {
        name: "qiiqo",
        tag: "#seir",
      },
      {
        name: "leistevie",
        tag: "#NA1",
      },
      {
        name: "JackEBoy",
        tag: "#NA1",
      },
    ];
    setPlayers(grabbedPlayers);
  }, []);
  const handleSelectedPlayer = (player: string) => {
    setSelectedPlayer(player);
    handleDropdown();
  };

  const handleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative bg-white text-black dark:bg-black dark:text-white font-serif">
      <Link
        to={`/stats`}
        className="fixed flex z-50 my-2 px-2 rounded-lg top-1 left-16 text-2xl font-semibold cursor-pointer w-fit h-fit justify-center items-center  group"
      >
        <div className="burger cursor-pointer relative h-12 w-6 gap-1 hover:cursor-pointer self-baseline">
          <div
            className={`absolute -rotate-45 top-5 left-0 transition-all duration-300 px-2 py-0.5 rounded-xl bg-white group-hover:bg-orange`}
          ></div>
          <div
            className={`absolute rotate-45 top-7 left-0 transition-all duration-300 px-2 py-0.5 rounded-xl bg-white group-hover:bg-orange`}
          ></div>
        </div>
        <p className="group-hover:text-orange underline transition duration-300 ">
          Back
        </p>
      </Link>
      <div className="flex flex-col md:flex-row justify-stretch p-4 gap-8">
        {/* Stat Sidebar */}
        <div className="statSideBar">
          <div className="flex flex-col py-8 px-4 gap-2 bg-gray/20 border-2 border-gray rounded-md flex-grow md:min-w-64 max-h-fit">
            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={handleDropdown}
                className="text-white bg-light-gray hover:bg-dark-blue hover:border-orange transition duration-300 w-full border-2 border-black shadow-sm shadow-black rounded-lg  px-5 py-2.5 text-center inline-flex items-center justify-between"
                type="button"
              >
                <p>{selectedPlayer}</p>
                <FaChevronDown
                  className={`${
                    isOpen ? "rotate-180" : ""
                  } transition duration-300`}
                ></FaChevronDown>
              </button>

              {/* <!-- Dropdown menu --> */}
              <div
                className={` absolute top-12 ${
                  isOpen ? "z-10 opacity-100" : "opacity-0 -z-50"
                } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 transition duration-300`}
              >
                <ul className="text-md bg-black border-2 border-black rounded-md p-2 w-[120%]">
                  {players.map((player) => {
                    return (
                      <li
                        onClick={() => handleSelectedPlayer(player.name)}
                        className="flex gap-4 justify-between p-0.5 hover:cursor-pointer hover:text-orange hover:bg-gray rounded-md transition duration-300"
                      >
                        <p className="inline-block">
                          {player.name}{" "}
                          <span className="opacity-60">{player.tag}</span>
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            {/* Rank & Role */}
            <div className="rankRole flex justify-between items-center border-b-2 p-2 border-white/45">
              <p className="text-emerald-light">Emerald IV</p>
              <img src={top} width={"30px"} height={"30px"}></img>
            </div>
            {/* Stats */}
            <ul className="quickStats flex flex-col gap-2">
              <li className="statitem inline-flex justify-between">
                <p className="text-white/55">Games:</p>
                <p className="">14</p>
              </li>
              <li className="statitem inline-flex justify-between">
                <p className="text-white/55">KDA:</p>
                <p className="">1.12</p>
              </li>
              <li className="statitem inline-flex justify-between">
                <p className="text-white/55">KP/Game:</p>
                <p className="">38%</p>
              </li>
              <li className="statitem inline-flex justify-between">
                <p className="text-white/55">CS/Min:</p>
                <p className="">8.62</p>
              </li>
              <li className="statitem inline-flex justify-between">
                <p className="text-white/55">Damage/Min:</p>
                <p className="">648</p>
              </li>

              <li className="statitem inline-flex justify-between">
                <p className="text-white/55">Vision/Game:</p>
                <p className="">23</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="extendedStatsContainer flex flex-col gap-8 flex-grow p-4 border-2 border-gray rounded-md">
          {/* Achievements */}
          <div className="achievements">
            <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">
              Achievements
            </h2>
            <div className="achievementContainer flex flex-col sm:flex-row flex-wrap gap-4 text-white/95 items-center md:items-start">
              <div className="achievement flex gap-2 border-2 border-green bg-green/40 items-center px-2 py-1 rounded-md">
                <FaWheatAwn></FaWheatAwn>
                <p>Great Farmer</p>
              </div>
              <div className="achievement flex gap-2 border-2 border-red bg-red/40 items-center px-2 py-1 rounded-md">
                <FaSkull></FaSkull>
                <p>Blood Thirsty</p>
              </div>
              <div className="achievement flex gap-2 border-2 border-green bg-green/40 items-center px-2 py-1 rounded-md">
                <PiCampfireFill></PiCampfireFill>
                <p>Survivor</p>
              </div>
              <div className="achievement flex gap-2 border-2 border-white/60 bg-gray/40 items-center px-2 py-1 rounded-md">
                <GiCoffin></GiCoffin>
                <p>Gray Screen Enthusiast</p>
              </div>
              <div className="achievement flex gap-2 border-2 border-purple bg-purple/40 items-center px-2 py-1 rounded-md">
                <IoEye></IoEye>
                <p>All-Seeing Eye</p>
              </div>
              <div className="achievement flex gap-2 border-2 border-yellow bg-yellow/40 items-center px-2 py-1 rounded-md">
                <FaCrown></FaCrown>
                <p>S13 Champion</p>
              </div>
            </div>
          </div>
          {/* Performance Overview */}
          <div className="performanceOverview">
            <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">
              Performance Overview
            </h2>
            {/* Stat Boxes */}
            <div className="smallStatBoxes flex sm:grid flex-col grid-rows-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* KDA */}
              <div className="kdaContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                <div className=" bg-red bg-opacity-50 p-1 rounded-md">
                  <LuSwords className="text-white w-[25px] h-[25px]"></LuSwords>
                </div>
                <div className="text flex flex-col p-4 items-center sm:items-start">
                  <h2 className="opacity-55">KDA Ratio</h2>
                  <p className="text-2xl text-blue">1.12</p>
                </div>
              </div>
              {/* Vision Score */}
              <div className="visionContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                <div className=" bg-blue bg-opacity-50 p-1 rounded-md">
                  <IoEye className="text-white w-[25px] h-[25px]"></IoEye>
                </div>
                <div className="text flex flex-col p-4 items-center sm:items-start">
                  <h2 className="opacity-55">Vision/Game</h2>
                  <p className="text-2xl text-red">10</p>
                </div>
              </div>
              {/* Gold/Game */}
              <div className="goldContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                <div className=" bg-yellow bg-opacity-50 p-1 rounded-md">
                  <MdAttachMoney className="text-white w-[25px] h-[25px]"></MdAttachMoney>
                </div>
                <div className="text flex flex-col p-4 items-center sm:items-start">
                  <h2 className="opacity-55">Gold/Game</h2>
                  <p className="text-2xl">8400</p>
                </div>
              </div>
              {/* CS/Game */}
              <div className="csContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                <div className=" bg-green bg-opacity-50 p-1 rounded-md">
                  <BsGraphUp className="text-white w-[25px] h-[25px]"></BsGraphUp>
                </div>
                <div className="text flex flex-col p-4 items-center sm:items-start">
                  <h2 className="opacity-55">CS/Game</h2>
                  <p className="text-2xl">192</p>
                </div>
              </div>
            </div>
          </div>
          {/* Favorite Champions */}
          <div className="favoriteChampions">
            <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">
              Favorite Champions
            </h2>
            {/* Champion Container */}
            <div className="favoreChampContainer flex flex-col gap-4 lg:grid grid-cols-2">
              <div className="championContainer flex gap-2 bg-gray/20 p-2 rounded-md border-2 border-gray">
                <img src={ornn} width={"50px"} height={"50px"}></img>
                <div className="champText flex justify-between items-center w-full">
                  <div>
                    <p className="font-bold">Ornn</p>
                    <p className="opacity-55">9 Games</p>
                  </div>
                  <p>
                    Win Rate: <span className="text-blue">57%</span>
                  </p>
                </div>
              </div>
              <div className="championContainer flex gap-2 bg-gray/20 p-2 rounded-md border-2 border-gray">
                <img src={gwen} width={"50px"} height={"50px"}></img>
                <div className="champText flex justify-between items-center w-full">
                  <div>
                    <p className="font-bold">Gwen</p>
                    <p className="opacity-55">4 Games</p>
                  </div>
                  <p>
                    Win Rate: <span className="text-blue">75%</span>
                  </p>
                </div>
              </div>
              <div className="championContainer flex gap-2 bg-gray/20 p-2 rounded-md border-2 border-gray">
                <img src={maokai} width={"50px"} height={"50px"}></img>
                <div className="champText flex justify-between items-center w-full">
                  <div>
                    <p className="font-bold">Maokai</p>
                    <p className="opacity-55">3 Games</p>
                  </div>
                  <p>
                    Win Rate: <span className="text-red">33%</span>
                  </p>
                </div>
              </div>
              <div className="championContainer flex gap-2 bg-gray/20 p-2 rounded-md border-2 border-gray">
                <img src={volibear} width={"50px"} height={"50px"}></img>
                <div className="champText flex justify-between items-center w-full">
                  <div>
                    <p className="font-bold">Volibear</p>
                    <p className="opacity-55">2 Games</p>
                  </div>
                  <p>
                    Win Rate: <span className="text-red">0%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Champion Stats */}
          <div className="specificChampStats">
            <h2 className="text-2xl font-bold border-b-2 border-white/60 mb-4">
              Champion Stats
            </h2>
            <div className="champStats flex flex-col gap-4 lg:grid grid-cols-2">
              {/* Champion Box */}
              <div className="championContainer border-2 border-gray bg-gray rounded-md bg-opacity-20 p-4">
                <div className="flex gap-2 border-gray pb-2">
                  <img src={ornn} width={"50px"} height={"50px"}></img>
                  <div className="champText flex justify-between items-center w-full">
                    <div>
                      <p className="font-bold">Ornn</p>
                      <p className="opacity-55">9 Games</p>
                    </div>
                    <p>
                      Win Rate: <span className="text-blue">57%</span>
                    </p>
                  </div>
                </div>
                <div className="smallStatBoxesChamp flex sm:grid flex-col grid-rows-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* KDA */}
                  <div className="kdaContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                    <div className=" bg-red bg-opacity-50 p-1 rounded-md">
                      <LuSwords className="text-white w-[25px] h-[25px]"></LuSwords>
                    </div>
                    <div className="text flex flex-col p-4 items-center sm:items-start">
                      <h2 className="opacity-55">KDA Ratio</h2>
                      <p className="text-2xl text-blue">1.12</p>
                    </div>
                  </div>
                  {/* Vision Score */}
                  <div className="visionContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                    <div className=" bg-blue bg-opacity-50 p-1 rounded-md">
                      <IoEye className="text-white w-[25px] h-[25px]"></IoEye>
                    </div>
                    <div className="text flex flex-col p-4 items-center sm:items-start">
                      <h2 className="opacity-55">Vision/Game</h2>
                      <p className="text-2xl text-red">10</p>
                    </div>
                  </div>
                  {/* Gold/Game */}
                  <div className="goldContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                    <div className=" bg-yellow bg-opacity-50 p-1 rounded-md">
                      <MdAttachMoney className="text-white w-[25px] h-[25px]"></MdAttachMoney>
                    </div>
                    <div className="text flex flex-col p-4 items-center sm:items-start">
                      <h2 className="opacity-55">Gold/Game</h2>
                      <p className="text-2xl">8400</p>
                    </div>
                  </div>
                  {/* CS/Game */}
                  <div className="csContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                    <div className=" bg-green bg-opacity-50 p-1 rounded-md">
                      <BsGraphUp className="text-white w-[25px] h-[25px]"></BsGraphUp>
                    </div>
                    <div className="text flex flex-col p-4 items-center sm:items-start">
                      <h2 className="opacity-55">CS/Game</h2>
                      <p className="text-2xl">192</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Champion Box */}
              <div className="championContainer border-2 border-gray bg-gray rounded-md bg-opacity-20 p-4">
                <div className="flex gap-2 border-gray pb-2">
                  <img src={gwen} width={"50px"} height={"50px"}></img>
                  <div className="champText flex justify-between items-center w-full">
                    <div>
                      <p className="font-bold">Gwen</p>
                      <p className="opacity-55">4 Games</p>
                    </div>
                    <p>
                      Win Rate: <span className="text-blue">75%</span>
                    </p>
                  </div>
                </div>
                <div className="smallStatBoxesChamp flex sm:grid flex-col grid-rows-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* KDA */}
                  <div className="kdaContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                    <div className=" bg-red bg-opacity-50 p-1 rounded-md">
                      <LuSwords className="text-white w-[25px] h-[25px]"></LuSwords>
                    </div>
                    <div className="text flex flex-col p-4 items-center sm:items-start">
                      <h2 className="opacity-55">KDA Ratio</h2>
                      <p className="text-2xl text-blue">1.12</p>
                    </div>
                  </div>
                  {/* Vision Score */}
                  <div className="visionContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                    <div className=" bg-blue bg-opacity-50 p-1 rounded-md">
                      <IoEye className="text-white w-[25px] h-[25px]"></IoEye>
                    </div>
                    <div className="text flex flex-col p-4 items-center sm:items-start">
                      <h2 className="opacity-55">Vision/Game</h2>
                      <p className="text-2xl text-red">10</p>
                    </div>
                  </div>
                  {/* Gold/Game */}
                  <div className="goldContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                    <div className=" bg-yellow bg-opacity-50 p-1 rounded-md">
                      <MdAttachMoney className="text-white w-[25px] h-[25px]"></MdAttachMoney>
                    </div>
                    <div className="text flex flex-col p-4 items-center sm:items-start">
                      <h2 className="opacity-55">Gold/Game</h2>
                      <p className="text-2xl">8400</p>
                    </div>
                  </div>
                  {/* CS/Game */}
                  <div className="csContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                    <div className=" bg-green bg-opacity-50 p-1 rounded-md">
                      <BsGraphUp className="text-white w-[25px] h-[25px]"></BsGraphUp>
                    </div>
                    <div className="text flex flex-col p-4 items-center sm:items-start">
                      <h2 className="opacity-55">CS/Game</h2>
                      <p className="text-2xl">192</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Champion Box */}
              <div className="championContainer border-2 border-gray bg-gray rounded-md bg-opacity-20 p-4">
                <div className="flex gap-2 border-gray pb-2">
                <img src={maokai} width={"50px"} height={"50px"}></img>
                <div className="champText flex justify-between items-center w-full">
                  <div>
                    <p className="font-bold">Maokai</p>
                    <p className="opacity-55">3 Games</p>
                  </div>
                  <p>
                    Win Rate: <span className="text-red">33%</span>
                  </p>
                </div>
                </div>
                <div className="smallStatBoxesChamp flex sm:grid flex-col grid-rows-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* KDA */}
                  <div className="kdaContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                    <div className=" bg-red bg-opacity-50 p-1 rounded-md">
                      <LuSwords className="text-white w-[25px] h-[25px]"></LuSwords>
                    </div>
                    <div className="text flex flex-col p-4 items-center sm:items-start">
                      <h2 className="opacity-55">KDA Ratio</h2>
                      <p className="text-2xl text-blue">1.12</p>
                    </div>
                  </div>
                  {/* Vision Score */}
                  <div className="visionContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                    <div className=" bg-blue bg-opacity-50 p-1 rounded-md">
                      <IoEye className="text-white w-[25px] h-[25px]"></IoEye>
                    </div>
                    <div className="text flex flex-col p-4 items-center sm:items-start">
                      <h2 className="opacity-55">Vision/Game</h2>
                      <p className="text-2xl text-red">10</p>
                    </div>
                  </div>
                  {/* Gold/Game */}
                  <div className="goldContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                    <div className=" bg-yellow bg-opacity-50 p-1 rounded-md">
                      <MdAttachMoney className="text-white w-[25px] h-[25px]"></MdAttachMoney>
                    </div>
                    <div className="text flex flex-col p-4 items-center sm:items-start">
                      <h2 className="opacity-55">Gold/Game</h2>
                      <p className="text-2xl">8400</p>
                    </div>
                  </div>
                  {/* CS/Game */}
                  <div className="csContainer flex flex-col sm:flex-row items-center px-4 py-2 border-gray border-2 bg-gray bg-opacity-20 rounded-md">
                    <div className=" bg-green bg-opacity-50 p-1 rounded-md">
                      <BsGraphUp className="text-white w-[25px] h-[25px]"></BsGraphUp>
                    </div>
                    <div className="text flex flex-col p-4 items-center sm:items-start">
                      <h2 className="opacity-55">CS/Game</h2>
                      <p className="text-2xl">192</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPlayer;
