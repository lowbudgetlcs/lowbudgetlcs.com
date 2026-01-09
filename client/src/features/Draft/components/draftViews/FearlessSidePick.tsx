import { useState } from "react";
import Button from "../../../../components/Button";
import { useFearlessContext } from "../../providers/FearlessProvider";
import { checkTournamentCode } from "../../socket/draftHandler";
import { Link, useParams } from "react-router-dom";

const FearlessSidePick = ({ teamDisplay }: { teamDisplay: string }) => {
  const { fearlessState, handleSideSelect } = useFearlessContext();
  const [tournamentCode, setTournamentCode] = useState<string>("");
  const [hasBadCode, setHasBadCode] = useState<boolean>(false);
  const { teamCode } = useParams();

  if (!fearlessState) {
    return null;
  }

  const isSubsequentDraft = fearlessState.completedDrafts > 0;
  const needsTournamentCode = isSubsequentDraft && !!fearlessState.initialTournamentCode;

  const handleValidationAndSideSelect = async (side: "blue" | "red") => {
    if (needsTournamentCode) {
      const isValid = await checkTournamentCode(tournamentCode);

      if (!isValid) {
        setHasBadCode(true);
        return;
      }

      setHasBadCode(false);
    }

    handleSideSelect(side, tournamentCode);
  };

  return teamDisplay === "team1" ? (
    <div className="flex flex-col items-center justify-center h-screen gap-8 text-white">
      <div className="sidePickContainer text-center">
        <h1 className="text-4xl font-bold mb-4">Choose your Side</h1>
        <p className="text-xl">
          Draft {fearlessState.completedDrafts + 1} of {fearlessState.draftCount}
        </p>
      </div>
      {needsTournamentCode && (
        <div className="flex flex-col">
          <p className="text-xl font-bold">
            <span className="text-red">*</span> Tournament Code
          </p>
          <input
            type="text"
            placeholder="Tournament Code"
            className="bg-gray/40 border-gray border-2 rounded-md p-2 text-orange"
            name="tournamentID"
            value={tournamentCode}
            onChange={(e) => setTournamentCode(e.target.value)}
            required
          />
          <p className={`${hasBadCode ? "" : "opacity-0"} text-sm text-red p-1`}>
            Invalid Tournament Code!
          </p>
        </div>
      )}
      <div className="sideBtns flex gap-8">
        <div className="cursor-pointer">
          <button onClick={() => handleValidationAndSideSelect("blue")}>
            <Button>Blue Side</Button>
          </button>
        </div>
        <div className="cursor-pointer">
          <button onClick={() => handleValidationAndSideSelect("red")}>
            <Button>Red Side</Button>
          </button>
        </div>
      </div>
      {fearlessState.draftLobbyCodes && fearlessState.draftLobbyCodes.length > 0 && (
        <div className="pastDrafts text-center text-xl pt-2">
          <p>Previous Drafts:</p>
          <div className="flex gap-2 justify-center mt-2">
            {fearlessState.draftLobbyCodes.map((code, index) => (
              <Link
                to={`/fearless/${fearlessState.fearlessCode}/${
                  teamCode ? teamCode : "spectator"
                }/${code}`}
                key={index}>
                <Button>Draft {index + 1}</Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen text-white">
      <div className="waiting text-center">
        <h1 className="text-4xl font-bold mb-4">Waiting for Host</h1>
        <p className="text-xl">
          The host is choosing sides for Draft {fearlessState.completedDrafts + 1}...
        </p>
        {fearlessState.draftLobbyCodes && fearlessState.draftLobbyCodes.length > 0 && (
          <div className="pastDrafts text-center pt-2 text-xl">
            <p>Previous Drafts:</p>
            <div className="flex gap-2 justify-center mt-2">
              {fearlessState.draftLobbyCodes.map((code, index) => (
                <Link
                  to={`/fearless/${fearlessState.fearlessCode}/${
                    teamCode ? teamCode : "spectator"
                  }/${code}`}
                  key={index}>
                  <Button>Draft {index + 1}</Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="animate-pulse mt-8 text-orange">Please wait</div>
      </div>
    </div>
  );
};

export default FearlessSidePick;
