import { useEffect, useRef, useState } from "react";
import { PlayerProps } from "../../../leagueData";
import TeamDropdown from "./TeamDropdown";
import lblcsIcon from "../../../assets/icons/lblcsIcon.svg";
import getTeamLogoUrl from "../../../utils/getTeamLogoUrl";
interface TeamProps {
  teamName: string;
  division: string;
  logo: string | null;
  playerList: PlayerProps[];
  isOpen: boolean;
  onToggle: () => void;
}

function TeamCard({ teamName, logo, playerList, isOpen, onToggle }: TeamProps) {
  const [isMultiSelected, setIsMultiSelected] = useState(false);
  const multiArray: Array<string> = [];
  const multiPlayersArray: Array<string> = [];
  const [multi, setMulti] = useState(multiArray);
  const [multiPlayers, setMultiPlayers] = useState(multiPlayersArray);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node) && isOpen) {
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

  const displayLogo = () => {
    if (logo) {
      return <img src={getTeamLogoUrl(logo)} alt={`${teamName} logo`} className="logo shrink-0 w-20 text-center text-xl h-20" />;
    } else {
      return <img src={lblcsIcon} alt="" className="logo shrink-0 w-20 text-center grayscale opacity-60 text-xl h-20" />;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`teamCard relative transition duration-300 ${isOpen ? "rounded-t-xl" : "rounded-xl"} bg-bg border-border border group w-full`}>
      <div onClick={togglePlayerList} className="p-2 cursor-pointer">
        <div className="dropBtn absolute bottom-0 right-0 self-end">
          <div className="burger cursor-pointer relative h-12 w-12 gap-1 hover:cursor-pointer self-baseline">
            <div
              className={`absolute ${
                isOpen ? "-rotate-45" : "rotate-45"
              } top-4 left-0 transition-all duration-300 px-3 py-0.5 rounded-xl bg-text-primary`}></div>
            <div
              className={`absolute ${
                isOpen ? "rotate-45" : "-rotate-45"
              } top-4 left-4 transition-all duration-300 px-3 py-0.5 rounded-xl bg-text-primary`}></div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row py-4 md:py-0 gap-4 items-center min-h-20 overflow-hidden">
          <div className="logoContainer flex flex-col md:flex-row gap-4 w-full md:w-auto md:h-full items-center">
            {displayLogo()}
            <div className={`w-full h-1 md:w-1 md:h-16 bg-orange`}></div>
          </div>
          <div className="flex flex-col md:flex-row flex-1 shrink md:ml-4 items-center">
            <h3 className="teamName text-xl text-center md:text-left font-semibold px-16 md:px-8">{teamName}</h3>
          </div>
        </div>
      </div>
      <TeamDropdown
        isOpen={isOpen}
        isMultiSelected={isMultiSelected}
        setIsMultiSelected={setIsMultiSelected}
        toggleIsMultiSelected={toggleIsMultiSelected}
        playerList={playerList}
        addToDisplayMulti={addToDisplayMulti}
        addToMulti={addToMulti}
        removeFromMulti={removeFromMulti}
        multi={multi}
        multiPlayers={multiPlayers}
      />
    </div>
  );
}

export default TeamCard;
