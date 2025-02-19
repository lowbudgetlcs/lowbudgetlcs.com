import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Button";

// const commercialGradient =
//   "bg-gradient-to-r md:bg-gradient-to-b from-platinum-light to-platinum-dark";
// const financialGradient =
//   "bg-gradient-to-r md:bg-gradient-to-b from-emerald-light to-emerald-dark";
// const economyGradient =
//   "bg-gradient-to-r md:bg-gradient-to-b from-gold-light to-gold-dark";
// const executiveGradient =
//   "bg-gradient-to-r md:bg-gradient-to-b from-challenger-blue to-challenger-gold";

interface TeamProps {
  teamName: string;
  groupId: string;
  // captainId: number | null;
  logo: string | null;
  playerList: string[];
  divisionId: number;
  isOpen: boolean;
  onToggle: () => void;
}

function TeamCard({
  teamName,
  logo,
  playerList,
  isOpen,
  onToggle,
}: TeamProps) {
  const [isMultiSelected, setIsMultiSelected] = useState(false);
  const multiArray: Array<string> = [];
  const multiPlayersArray: Array<string> = [];
  const [multi, setMulti] = useState(multiArray);
  const [multiPlayers, setMultiPlayers] = useState(multiPlayersArray);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onToggle();
        setTimeout(() => {
          setIsMultiSelected(false);
        }, 400);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const togglePlayerList = () => {
    onToggle();
    if (isOpen && isMultiSelected) {
      setMulti([]);
      setMultiPlayers([]);
      setTimeout(() => {
        setIsMultiSelected(false);
      }, 300);
    } else {
      setMulti([]);
      setMultiPlayers([]);
    }
  };

  const toggleIsMultiSelected = () => {
    setMulti([]);
    setMultiPlayers([]);
    setIsMultiSelected(!isMultiSelected);
  };

  const addToMulti = (newValue: string) => {
    setMulti((prevArray) => {
      if (!prevArray) {
        return [newValue];
      } else {
        return [...prevArray, newValue];
      }
    });
  };

  const addToDisplayMulti = (newValue: string) => {
    setMultiPlayers((prevArray) => {
      if (!prevArray) {
        return [newValue];
      } else {
        return [...prevArray, newValue];
      }
    });
  };

  const removeFromMulti = (index: number) => {
    setMulti((prevArray) => {
      return prevArray.filter((_, i) => i !== index);
    });
    setMultiPlayers((prevArray) => {
      return prevArray.filter((_, i) => i !== index);
    });
  };

  // let gradient;
  // switch (divisionId) {
  //   case 1:
  //     gradient = economyGradient;
  //     break;
  //   case 2:
  //     gradient = commercialGradient;
  //     break;
  //   case 3:
  //     gradient = financialGradient;
  //     break;
  //   case 4:
  //     gradient = executiveGradient;
  //     break;
  // }

  const displayLogo = () => {
    if (logo) {
      return (
        <img
          src={logo}
          className="logo flex-shrink-0 w-[150px] text-center text-3xl h-[150px]"
        />
      );
    } else {
      return (
        <div className="logo flex-shrink-0 w-[150px] text-center text-3xl h-[150px] bg-gray">
          No logo 😢
        </div>
      );
    }
  };

  const showMultiBtn = () => {
    if (multi.length <= 0) {
      return (
        <p className="text-lg font-normal text-orange">
          Select players to add to link
        </p>
      );
    } else {
      return (
        <div className="flex flex-col">
          <p className="text-white/60 text-sm font-normal pb-2">
            click on a player listed to remove them
          </p>
          <Link
            target="_blank"
            to={`https://www.op.gg/multisearch/na?summoners=${multi.join(",")}`}
            className="flex justify-center items-center hover:cursor-pointer"
          >
            <Button>To op.gg</Button>
          </Link>
        </div>
      );
    }
  };
  if (!isMultiSelected) {
    // Single op.gg Select Dropdown
    return (
      <div
        ref={cardRef}
        className={`teamCard relative transition duration-300 ${
          isOpen ? "rounded-t-lg" : "rounded-lg"
        } bg-gray/80 dark:bg-gray/40`}
      >
        <div className="dropBtn absolute bottom-0 right-0 self-end">
          <div
            onClick={togglePlayerList}
            className="burger cursor-pointer relative h-12 w-12 gap-1 hover:cursor-pointer self-baseline"
          >
            <div
              className={`absolute ${
                isOpen ? "-rotate-45" : "rotate-45"
              } top-4 -left-0 transition-all duration-500 px-3 py-0.5 rounded-xl bg-white`}
            ></div>
            <div
              className={`absolute ${
                isOpen ? "rotate-45" : "-rotate-45"
              } top-4 left-4 transition-all duration-500 px-3 py-0.5 rounded-xl bg-white`}
            ></div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row py-4 md:py-0 md:pl-4 gap-4 items-center max-w-md md:max-w-full md:w-full min-h-32 md:h-40 overflow-hidden">
          <div className="logoContainer flex flex-col md:flex-row gap-4 w-full md:w-auto md:h-full items-center">
            {displayLogo()}
            <div className={`w-full h-3 md:w-3 md:h-full bg-orange`}></div>
          </div>
          <div className="flex flex-col md:flex-row flex-1 flex-shrink md:ml-4 items-center">
            <h3 className="teamName text-xl text-center md:text-left font-semibold px-16 md:px-8">
              {teamName}
            </h3>
          </div>
        </div>

        <div className="relative">
          <div
            className={`teamMembers absolute left-0 p-4 right-0 overflow-hidden bg-light-gray dark:bg-gray-800 border-4 border-white/20 shadow-2xl rounded-b-lg z-10 transition-all duration-500 ease-in-out ${
              isOpen
                ? "max-h-[1000px] opacity-100 visible"
                : "max-h-0 opacity-0 invisible"
            }`}
          >
            <div className="titleText relative flex flex-col items-center justify-center gap-4">
              <h3 className="text-2xl font-bold text-center">
                Players: Single Select
              </h3>
              <div
                onClick={toggleIsMultiSelected}
                className="buttonContainer flex justify-center items-center hover:cursor-pointer"
              >
                <Button>To Multi op.gg Select</Button>
              </div>
            </div>

            <div className="players grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 py-4">
              {playerList.map((player) => {
                const summonerName = player.split("#");
                return (
                  <Link
                    target="_blank"
                    to={`https://www.op.gg/summoners/na/${summonerName[0]}-${summonerName[1]}`}
                    key={player}
                    className="text-center hover:underline underline-offset-4"
                  >
                    {summonerName[0]}{" "}
                    <span className="text-white/40">
                      {"#" + summonerName[1]}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // Multi op.gg Select Dropdown
    return (
      <div
        ref={cardRef}
        className={`teamCard relative transition duration-300 ${
          isOpen ? "rounded-t-lg" : "rounded-lg"
        } bg-gray/80 dark:bg-gray/40`}
      >
        <div className="dropBtn absolute bottom-0 right-0 self-end">
          <div
            onClick={togglePlayerList}
            className="burger cursor-pointer relative h-12 w-12 gap-1 hover:cursor-pointer self-baseline"
          >
            <div
              className={`absolute ${
                isOpen ? "-rotate-45" : "rotate-45"
              } top-4 -left-0 transition-all duration-500 px-3 py-0.5 rounded-xl bg-white`}
            ></div>
            <div
              className={`absolute ${
                isOpen ? "rotate-45" : "-rotate-45"
              } top-4 left-4 transition-all duration-500 px-3 py-0.5 rounded-xl bg-white`}
            ></div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row py-4 md:py-0 md:pl-4 gap-4 items-center max-w-md md:max-w-full md:w-full min-h-32 md:h-40 overflow-hidden">
          <div className="logoContainer flex flex-col md:flex-row gap-4 w-full md:w-auto md:h-full items-center">
            {displayLogo()}
            <div className={`w-full h-3 md:w-3 md:h-full bg-orange`}></div>
          </div>
          <div className="flex flex-col md:flex-row flex-1 flex-shrink md:ml-4 items-center">
            <h3 className="teamName text-xl text-center md:text-left font-semibold px-16 md:px-8">
              {teamName}
            </h3>
          </div>
        </div>

        <div className="relative">
          <div
            className={`teamMembers absolute left-0 right-0 p-4 overflow-hidden bg-light-gray border-4 border-white/20 dark:bg-gray-800 shadow-2xl rounded-b-lg z-10 transition-all duration-500 ease-in-out ${
              isOpen
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0 invisible"
            }`}
          >
            <div className="titleText relative flex flex-col items-center justify-center gap-4">
              <h3 className="text-2xl font-bold text-center">
                Players: Multi Select
              </h3>
              <div
                onClick={toggleIsMultiSelected}
                className="buttonContainer flex justify-center items-center hover:cursor-pointer"
              >
                <Button>Back to Single Select</Button>
              </div>
            </div>
            <div className="players grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 py-4">
              {playerList.map((player) => {
                const summonerName = player.split("#");
                return (
                  <div
                    onClick={() => {
                      //Grab player name, tag, and add "#" and "," for URL
                      let player = encodeURIComponent(
                        `${summonerName[0]}#${summonerName[1]}`
                      );
                      const unChangedPlayer = `${summonerName[0]} #${summonerName[1]}`;
                      // Cut all whitespace from string
                      player = player.replace(/\s+/g, "");
                      if (multi.length < 5) {
                        addToMulti(player);
                        addToDisplayMulti(unChangedPlayer);
                      }
                    }}
                    key={player}
                    className="text-center hover:underline underline-offset-4 cursor-pointer"
                  >
                    {summonerName[0]}{" "}
                    <span className="text-white/40">
                      {"#" + summonerName[1]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="multi flex flex-col justify-center items-center px-2">
              <h3 className="text-xl text-center font-semibold break-all">
                {" "}
                Multi with:
                <span className="font-normal text-orange flex flex-wrap gap-2 p-2 justify-center items-center">
                  {multiPlayers.map((player, index) => {
                    return (
                      <p
                        key={index}
                        className="cursor-pointer hover:underline underline-offset-4"
                        onClick={() => removeFromMulti(index)}
                      >{`${player}, `}</p>
                    );
                  })}
                </span>
              </h3>
              <div className="">{showMultiBtn()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TeamCard;
