import { ParticipantDto } from "../interfaces/MatchV5";

const PlayerInfo = ({ playerData }: { playerData: ParticipantDto }) => {
  const championLink = `https://cdn.communitydragon.org/latest/champion/${playerData.championId}/square`;

  return (
    <div className="playerInfo flex gap-2 items-center">
      <div className="champImage relative w-12 h-12">
        <img src={championLink} alt={` ${playerData.championName}`} />
        <p className="absolute bottom-0 right-0 text-xs rounded-md bg-black px-0.5">
          {playerData.champLevel}
        </p>
      </div>
      <div className="playerInfo flex flex-col text-sm">
        <p className="playerName">
          {playerData.riotIdGameName}
          <span className="text-white/60"> #{playerData.riotIdTagline}</span>
        </p>
        <p className="playerRank text-white/60 text-xs">
          {playerData.teamPosition === "UTILITY"
            ? "Support"
            : playerData.teamPosition.toLowerCase().charAt(0).toUpperCase() +
              playerData.teamPosition.toLowerCase().slice(1)}
        </p>
      </div>
    </div>
  );
};
export default PlayerInfo;
