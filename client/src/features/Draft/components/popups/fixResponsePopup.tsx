import { useSocketContext } from "../../providers/SocketProvider";
import { useDraftContext } from "../../providers/DraftProvider";
import { useEffect, useState } from "react";

const FixResponsePopup = () => {
  const { fixAccepted, setFixAccepted } = useSocketContext();
  const { draftState, playerSide } = useDraftContext();
  const [hidden, setHidden] = useState(true);
  const [hideAnimation, setHideAnimation] = useState(false);

  useEffect(() => {
    if (fixAccepted !== null) {
      setHidden(false);
      setHideAnimation(false);

      const timer = setTimeout(() => {
        setHideAnimation(true);
        const hideTimer = setTimeout(() => setHidden(true), 450);
        return () => clearTimeout(hideTimer);
      }, 1500);

      return () => {
        clearTimeout(timer);
        setFixAccepted(null);
      };
    }
  }, [fixAccepted]);

  if (hidden) {
    return null;
  }

  if (fixAccepted === null) return null;

  const blueSideRequesting = draftState.blueChampionReplacementRequest && playerSide == "red";
  const redSideRequesting = draftState.redChampionReplacementRequest && playerSide == "blue";
  const iconLink = `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/`;

  if (!draftState.blueChampionReplacementRequest && !draftState.redChampionReplacementRequest) return null;
  if (!blueSideRequesting && !redSideRequesting) return null;
  return (
    <div
      className={`popup fixed top-10 right-2 w-64 h-12 flex flex-col items-start justify-center px-4 ${fixAccepted ? "bg-green" : "bg-red"} border-2 ${fixAccepted ? "border-green" : "border-red"} rounded-md z-50 animate-slide-in-left transition-opacity duration-300 ${
        hideAnimation ? "animate-slideOut" : ""
      }`}>
      <h3 className="text-lg font-bold text-white">{fixAccepted ? "Fix Accepted!" : "Fix Rejected!"}</h3>
      <div className="flex gap-2 items-center">
        <img
          src={`${iconLink}${blueSideRequesting ? draftState.blueChampionReplacementRequest?.championToReplace.champion : redSideRequesting ? draftState.redChampionReplacementRequest?.championToReplace.champion : ""}`}
          alt={
            blueSideRequesting
              ? draftState.blueChampionReplacementRequest?.championToReplace.champion
              : redSideRequesting
                ? draftState.redChampionReplacementRequest?.championToReplace.champion
                : ""
          }
        />
        <p>With</p>
        <img
          src={`${iconLink}${blueSideRequesting ? draftState.blueChampionReplacementRequest?.replacementChampion.champion : redSideRequesting ? draftState.redChampionReplacementRequest?.replacementChampion.champion : ""}`}
          alt={
            blueSideRequesting
              ? draftState.blueChampionReplacementRequest?.replacementChampion.champion
              : redSideRequesting
                ? draftState.redChampionReplacementRequest?.replacementChampion.champion
                : ""
          }
        />
      </div>
    </div>
  );
};

export default FixResponsePopup;
