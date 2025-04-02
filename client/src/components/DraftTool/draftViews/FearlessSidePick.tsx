import Button from "../../Button";
import { useFearlessContext } from "../providers/FearlessProvider";

const FearlessSidePick = ({ teamDisplay }: { teamDisplay: string }) => {
  const { fearlessState, handleSideSelect } = useFearlessContext();

  if (!fearlessState) {
    return null;
  }

  // If user is host, will show team choices, otherwise is a blank loading div
  return teamDisplay === "team1" ? (
    <div className="flex flex-col items-center justify-center h-screen gap-8 text-white">
      <div className="sidePickContainer text-center">
        <h1 className="text-4xl font-bold mb-4">Choose your Side</h1>
        <p className="text-xl">
          Draft {fearlessState.completedDrafts + 1} of{" "}
          {fearlessState.draftCount}
        </p>
      </div>
      <div className="sideBtns flex gap-8">
        <div onClick={() => handleSideSelect("blue")}>
          <Button>Blue Side</Button>
        </div>
        <div onClick={() => handleSideSelect("red")}>
          <Button>Red Side</Button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen text-white">
      <div className="waiting text-center">
        <h1 className="text-4xl font-bold mb-4">Waiting for Host</h1>
        <p className="text-xl">
          The host is choosing sides for Draft{" "}
          {fearlessState.completedDrafts + 1}...
        </p>
        <div className="animate-pulse mt-8 text-orange">Please wait</div>
      </div>
    </div>
  );
};

export default FearlessSidePick;
