import { ParticipantDto } from "../../interfaces/MatchV5";

const DamageContainer = ({ playerData }: { playerData: ParticipantDto }) => {
  return (
    <div className="damageContainer">
      <div className="playerName">
        <p>{playerData.riotIdGameName}</p>
      </div>
    </div>
  );
};
export default DamageContainer;
