import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import { PlayerProps } from "../../../leagueData";

interface TeamDropdownProps {
  isOpen: boolean;
  isMultiSelected: boolean;
  setIsMultiSelected: React.Dispatch<React.SetStateAction<boolean>>;
  toggleIsMultiSelected: () => void;
  playerList: PlayerProps[];
  addToDisplayMulti: (player: string) => void;
  addToMulti: (player: string) => void;
  removeFromMulti: (index: number) => void;
  multi: string[];
  multiPlayers: string[];
}
const TeamDropdown = ({
  isOpen,
  isMultiSelected,
  toggleIsMultiSelected,
  playerList,
  addToDisplayMulti,
  addToMulti,
  removeFromMulti,
  multi,
  multiPlayers,
}: TeamDropdownProps) => {
  const showMultiBtn = () => {
    if (multi.length <= 0) {
      return <p className="text-lg font-normal text-orange">Select players to add to link</p>;
    } else {
      return (
        <div className="flex flex-col">
          <p className="text-text-secondary text-sm font-normal pb-2">click on a player listed to remove them</p>
          <Link
            target="_blank"
            to={`https://www.op.gg/multisearch/na?summoners=${multi.join(",")}`}
            className="flex justify-center items-center hover:cursor-pointer">
            <Button>To op.gg</Button>
          </Link>
        </div>
      );
    }
  };

  return isMultiSelected ? (
    <div className="relative">
      <div
        className={`teamMembers absolute left-0 right-0 p-4 overflow-hidden bg-bg border border-border shadow-2xl rounded-b-lg z-10 transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-250 opacity-100" : "max-h-0 opacity-0 invisible"
        }`}>
        <div className="titleText relative flex flex-col items-center justify-center gap-4">
          <h3 className="text-2xl font-bold text-center">Players: Multi Select</h3>
          <div onClick={toggleIsMultiSelected} className="buttonContainer flex justify-center items-center hover:cursor-pointer">
            <Button>Back to Single Select</Button>
          </div>
        </div>
        <div className="players grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 py-4">
          {playerList.map((player) => {
            const summonerName = player.name.split("#");
            return (
              <div
                onClick={() => {
                  //Grab player name, tag, and add "#" and "," for URL
                  let player = encodeURIComponent(`${summonerName[0]}#${summonerName[1]}`);
                  const unChangedPlayer = `${summonerName[0]} #${summonerName[1]}`;
                  // Cut all whitespace from string
                  player = player.replace(/\s+/g, "");
                  if (multi.includes(player)) {
                    removeFromMulti(multi.indexOf(player));
                    return;
                  }
                  if (multi.length < 10) {
                    addToMulti(player);
                    addToDisplayMulti(unChangedPlayer);
                  }
                }}
                key={player.name}
                className="text-center hover:underline underline-offset-4 cursor-pointer">
                {summonerName[0]} <span className="text-white/40">{"#" + summonerName[1]}</span>
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
                    onClick={() => removeFromMulti(index)}>{`${player}, `}</p>
                );
              })}
            </span>
          </h3>
          <div className="">{showMultiBtn()}</div>
        </div>
      </div>
    </div>
  ) : (
    // Single op.gg Select Dropdown
    <div className="relative">
      <div
        className={`teamMembers absolute left-0 p-4 w-full overflow-hidden bg-bg border border-orange shadow-2xl shadow-black rounded-b-lg z-10 transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-250 opacity-100 visible" : "max-h-0 opacity-0 invisible"
        }`}>
        <div className="titleText relative flex flex-col items-center justify-center gap-4">
          <h3 className="text-2xl font-bold text-center text-text-primary">Players: Single Select</h3>
          <div onClick={toggleIsMultiSelected} className="buttonContainer flex justify-center items-center hover:cursor-pointer">
            <Button>To Multi op.gg Select</Button>
          </div>
        </div>

        <div className="players grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 py-4">
          {playerList.map((player) => {
            const summonerName = player.name.split("#");
            return (
              <Link
                target="_blank"
                to={`https://www.op.gg/summoners/na/${summonerName[0]}-${summonerName[1]}`}
                key={player.name}
                className="text-center hover:underline underline-offset-4">
                {summonerName[0]} <span className="text-text-secondary">{"#" + summonerName[1]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamDropdown;
