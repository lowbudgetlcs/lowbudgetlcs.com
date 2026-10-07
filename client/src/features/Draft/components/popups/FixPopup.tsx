import { useSocketContext } from "../../providers/SocketProvider";
import { useDraftContext } from "../../providers/DraftProvider";
import Button from "../../../../components/Button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FixPopup = () => {
  const { showFixPopup, setShowFixPopup } = useSocketContext();
  const { draftState, playerSide, sendFixResponse } = useDraftContext();
  const { lobbyCode } = useParams();
  const [timeRemaining, setTimeRemaining] = useState(0);

  const incomingRequest =
    playerSide === "red" && draftState.blueChampionReplacementRequest
      ? { requestingSide: "blue", request: draftState.blueChampionReplacementRequest }
      : playerSide === "blue" && draftState.redChampionReplacementRequest
        ? { requestingSide: "red", request: draftState.redChampionReplacementRequest }
        : null;
  const iconLink = `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/`;
  const expiresAt = incomingRequest?.requestingSide === "blue" ? draftState.blueTimeToFix : draftState.redTimeToFix;

  useEffect(() => {
    if (!showFixPopup || !expiresAt) {
      setTimeRemaining(0);
      return;
    }

    const updateTimer = () => {
      setTimeRemaining(Math.max(0, expiresAt - Date.now()));
    };
    updateTimer();
    const timer = window.setInterval(updateTimer, 100);
    return () => window.clearInterval(timer);
  }, [expiresAt, showFixPopup]);

  useEffect(() => {
    if (showFixPopup && expiresAt && Date.now() >= expiresAt) {
      setShowFixPopup(false);
    }
  }, [expiresAt, setShowFixPopup, showFixPopup, timeRemaining]);

  if (!showFixPopup || !incomingRequest || !lobbyCode) return null;

  const { requestingSide, request } = incomingRequest;
  const respondToRequest = (accepted: boolean) => {
    const sideCode = sessionStorage.getItem("activeSideCode");
    if (!sideCode) return;

    setShowFixPopup(false);
    sendFixResponse({ status: accepted, sideCode, lobbyCode });
  };
  const timerWidth = Math.min(100, (timeRemaining / 30000) * 100);

  return (
    <div className="fix-popup fixed bottom-6 left-1/2 z-50 w-[min(100%-2rem,36rem)] -translate-x-1/2 overflow-hidden rounded-md border border-border bg-bg shadow-2xl text-text-primary">
      <div className="fixHeader px-6 py-4">
        <h3>
          <span className={`${requestingSide === "blue" ? "text-blue" : "text-red"}`}>{requestingSide === "blue" ? "Blue Side" : "Red Side"} </span>
          Swap Request
        </h3>
      </div>
      <div className="fixChampion flex gap-4 items-center justify-center">
        <p>{requestingSide === "blue" ? draftState.blueDisplayName : draftState.redDisplayName} is requesting to swap <span>{request.championToReplace.champion}</span></p>
        <img src={`${iconLink}${request.championToReplace.champion}`} alt={request.championToReplace.champion} />
        <p>With <span>{request.replacementChampion.champion}</span></p>
        <img src={`${iconLink}${request.replacementChampion.champion}`} alt={request.replacementChampion.champion} />
      </div>

      <div className="fixActions flex gap-4 justify-center">
        <Button
          className="acceptBtn bg-green"
          onClick={() => {
            respondToRequest(true);
          }}>
          Accept
        </Button>
        <Button
          className="declineBtn bg-red"
          onClick={() => {
            respondToRequest(false);
          }}>
          Decline
        </Button>
      </div>
      <div className="mt-4 h-1 w-full bg-bg-light">
        <div className="h-full bg-orange transition-width duration-100 ease-linear" style={{ width: `${timerWidth}%` }} />
      </div>
    </div>
  );
};

export default FixPopup;
