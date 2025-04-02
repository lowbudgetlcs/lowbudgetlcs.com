import sideSelectHandler from "../fearlessHandlers/sideSelectHandler";
import { useParams } from "react-router-dom";
import Button from "../../Button";
import { useFearlessContext } from "../providers/FearlessProvider";

const FearlessSidePick = ({
  teamDisplay,
  setSelectedSide
}: {
  teamDisplay: string,
  setSelectedSide: React.Dispatch<React.SetStateAction<string | undefined>>
}) => {
  const { teamCode } = useParams();
  const {fearlessState, fearlessSocket} = useFearlessContext();

  if (!teamCode || !fearlessSocket || !fearlessState) return;
  const handleSideSelect = (side: string) =>
    sideSelectHandler(
      fearlessState.fearlessCode,
      fearlessSocket,
      side,
      setSelectedSide
    );

  // If user is host, will show team choices, otherwise is a blank loading div
  return teamDisplay === "team1" ? (
    <>
      <div className="sidePickContainer">
        <h1>Choose your Side for Draft {fearlessState.completedDrafts + 1}</h1>
      </div>
      <div className="sideBtns">
        <div onClick={() => handleSideSelect("blue")}>
          <Button>Blue Side</Button>
        </div>
        <div onClick={() => handleSideSelect("red")}>
          <Button>Red Side</Button>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="waiting">Waiting on Host to choose side...</div>
    </>
  );
};

export default FearlessSidePick;
