import { ParticipantDto } from "../../../types/MatchV5";

const PlayerInfo = ({ playerData }: { playerData: ParticipantDto }) => {
  const championLink = `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${playerData.championName}/square`;

  return (
    <div className="playerInfo relative flex gap-2 items-center shrink-0 lg:w-32 xl:w-48">
      <div className="champImage relative w-12 h-12 shrink-0">
        <img src={championLink} alt={` ${playerData.championName}`} />
        <p className="absolute bottom-0 right-0 text-xs rounded-md bg-black px-0.5">{playerData.champLevel}</p>
      </div>
      <div className="playerInfo flex flex-col text-sm truncate text-text-primary group">
        <p className="playerName cursor-pointer select-none truncate">{playerData.riotIdGameName}</p>
        <p className="playerRank text-text-secondary text-xs">
          {playerData.teamPosition === "UTILITY"
            ? "Support"
            : playerData.teamPosition.toLowerCase().charAt(0).toUpperCase() + playerData.teamPosition.toLowerCase().slice(1)}
        </p>
        <div className="absolute text-text-primary hidden top-7 w-max z-10 group-hover:block font-semibold rounded-md bg-bg border border-border p-1.5">{playerData.riotIdGameName} <span className="text-text-secondary">#{playerData.riotIdTagline}</span></div>
      </div>
    </div>
  );
};
export default PlayerInfo;
