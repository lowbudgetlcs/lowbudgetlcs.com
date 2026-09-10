import { useSocketContext } from "../../providers/SocketProvider";
import { useDraftContext } from "../../providers/DraftProvider";
import Button from "../../../../components/Button";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const FixPopup = () => {
  const { showFixPopup, setShowFixPopup, setFixAccepted, fixAccepted } = useSocketContext();
  const { draftState, playerSide, sendFixResponse } = useDraftContext();
  const { lobbyCode } = useParams();

  const incomingRequest =
    playerSide === "red" && draftState.blueChampionReplacementRequest
      ? { requestingSide: "blue", request: draftState.blueChampionReplacementRequest }
      : playerSide === "blue" && draftState.redChampionReplacementRequest
        ? { requestingSide: "red", request: draftState.redChampionReplacementRequest }
        : null;
  const iconLink = `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/`;

  useEffect(() => {
    if (showFixPopup) {
      setFixAccepted(null);
    }

    if (fixAccepted !== null) {
      setShowFixPopup(false);
    }
  }, [fixAccepted, setFixAccepted, setShowFixPopup, showFixPopup]);

  if (!showFixPopup || !incomingRequest || !lobbyCode) return null;

  const { requestingSide, request } = incomingRequest;
  const respondToRequest = (accepted: boolean) => {
    setFixAccepted(accepted);
    sendFixResponse(
      accepted,
      requestingSide,
      request.championToReplace.replacementChampion,
      request.replacementChampion,
      request.championToReplace.replacementSource ?? "",
      lobbyCode,
    );
  };

  return (
    <div className="fix-popup w-full">
      <div className="fixHeader">
        <h3>
          <span className={`${requestingSide === "blue" ? "text-blue" : "text-red"}`}>
            {requestingSide === "blue" ? "Blue Side" : "Red Side"}
          </span>
          Swap Request
        </h3>
      </div>
      <div className="fixChampion flex gap-4 items-center justify-center">
        <p>{requestingSide === "blue" ? "Blue Side" : "Red Side"} is requesting to swap</p>
        <img
          src={`${iconLink}${request.championToReplace.replacementChampion}`}
          alt={request.championToReplace.replacementChampion}
        />
        <p>With</p>
        <img
          src={`${iconLink}${request.replacementChampion}`}
          alt={request.replacementChampion}
        />
      </div>

      <div className="fixActions flex gap-4 justify-center">
        <Button
          className="acceptBtn bg-green"
          onClick={() => {
            respondToRequest(true);
          }}
        >
          Accept
        </Button>
        <Button
          className="declineBtn"
          onClick={() => {
            respondToRequest(false);
          }}
        >
          Decline
        </Button>
      </div>
    </div>
  );
};

export default FixPopup;
