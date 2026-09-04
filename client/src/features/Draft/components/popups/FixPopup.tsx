import { useSocketContext } from "../../providers/SocketProvider";
import { useDraftContext } from "../../providers/DraftProvider";
import Button from "../../../../components/Button";

const FixPopup = () => {
  const { showFixPopup, setShowFixPopup, setFixAccepted } = useSocketContext();
  const { draftState, playerSide } = useDraftContext();
  if (!showFixPopup) return null;

  const blueSideRequesting = draftState.blueChampionReplacementRequest && playerSide == "red";
  const redSideRequesting = draftState.redChampionReplacementRequest && playerSide == "blue";
  const iconLink = `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/`;

  if (!draftState.blueChampionReplacementRequest && !draftState.redChampionReplacementRequest) return null;
  if (!blueSideRequesting && !redSideRequesting) return null;
  return (
    <div className="fix-popup w-full">
      <div className="fixHeader">
        <h3>
          <span className={`${playerSide == "blue" ? "text-red" : "text-blue"}`}>
            {blueSideRequesting ? "Blue Side" : redSideRequesting ? "Red Side" : "Not a Real"}
          </span>
          Swap Request
        </h3>
      </div>
      <div className="fixChampion flex gap-4 items-center justify-center">
        <p>
          {blueSideRequesting
            ? "Blue Side is requesting to swap"
            : redSideRequesting
              ? "Red Side is requesting to swap"
              : "This is some sort of error"}
        </p>
        <img
          src={`${iconLink}${blueSideRequesting ? draftState.blueChampionReplacementRequest?.championToReplace.replacementChampion : redSideRequesting ? draftState.redChampionReplacementRequest?.championToReplace.replacementChampion : ""}`}
          alt={
            blueSideRequesting
              ? draftState.blueChampionReplacementRequest?.championToReplace.replacementChampion
              : redSideRequesting
                ? draftState.redChampionReplacementRequest?.championToReplace.replacementChampion
                : ""
          }
        />
        <p>With</p>
        <img
          src={`${iconLink}${blueSideRequesting ? draftState.blueChampionReplacementRequest?.replacementChampion : redSideRequesting ? draftState.redChampionReplacementRequest?.replacementChampion : ""}`}
          alt={
            blueSideRequesting
              ? draftState.blueChampionReplacementRequest?.replacementChampion
              : redSideRequesting
                ? draftState.redChampionReplacementRequest?.replacementChampion
                : ""
          }
        />
      </div>

      <div className="fixActions flex gap-4 justify-center">
        <Button
          className="acceptBtn bg-blue"
          onClick={() => {
            setFixAccepted(true);
            setShowFixPopup(false);
          }}
        >
          Accept
        </Button>
        <Button
          className="declineBtn bg-red"
          onClick={() => {
            setFixAccepted(false);
            setShowFixPopup(false);
          }}
        >
          Decline
        </Button>
      </div>
    </div>
  );
};

export default FixPopup;
