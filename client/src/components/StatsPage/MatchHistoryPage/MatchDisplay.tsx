import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import matchHandler from "./matchHandler";
import { FullPlayerDataProps } from "../statTypes";
import tempImage from "../../../assets/lblcsLogo.svg";
import PlayerStatDisplay from "./PlayerStatDisplay";

const MatchDisplay = () => {
  const [blueTeam, setBlueTeam] = useState<FullPlayerDataProps>();
  const [redTeam, setRedTeam] = useState<FullPlayerDataProps>();
  const { shortcode } = useParams();

  useEffect(() => {
    if (!shortcode) {
      return;
    }

    const getMatchDetails = async () => {
      const responseArray = await matchHandler(shortcode);
      if (!responseArray) {
        console.error("No match");
        return;
      }
      responseArray.forEach((response) => {
        if (response.teamData.side === "BLUE") {
          setBlueTeam(response);
        } else if (response.teamData.side === "RED") {
          setRedTeam(response);
        }
      });
    };
    getMatchDetails();
  }, [shortcode]);

  if (!redTeam || !blueTeam) return null;

  return (
    <div className="text-white">
      <div className="teamsTitle p-8 flex gap-8 justify-center items-center">
        <div className="blueTeam flex flex-col items-center gap-2">
          <img
            src={blueTeam.team.logo || tempImage}
            className="w-64 rounded-full bg-gray"
          />
          <h1 className="text-4xl font-bold text-blue">{blueTeam.team.name}</h1>
        </div>
        <p className="text-4xl font-bold">VS</p>
        <div className="redTeam flex flex-col items-center gap-2">
          <img
            src={redTeam.team.logo || tempImage}
            className="w-64 rounded-full bg-gray"
          />
          <h1 className="text-4xl font-bold text-red">{redTeam.team.name}</h1>
        </div>
      </div>
      <div className="statContainer flex flex-col lg:flex-row justify-center">
        <div className="blueStats  bg-blue/40">
          <PlayerStatDisplay currentTeam={blueTeam} />
        </div>
        <div className="redStats bg-red/40">
          <PlayerStatDisplay currentTeam={redTeam} />
        </div>
      </div>
    </div>
  );
};

export default MatchDisplay;
