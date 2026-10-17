import { useEffect, useState } from "react";
import Button from "../../../../components/Button";
import { useDraftContext } from "../../providers/DraftProvider";

const SideSwapControl = () => {
  const {
    draftState,
    playerSide,
    incomingSideSwapRequest,
    sideSwapPending,
    requestSideSwap,
    respondToSideSwap,
  } = useDraftContext();
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!incomingSideSwapRequest) {
      setTimeRemaining(0);
      return;
    }

    const updateTimer = () => {
      setTimeRemaining(Math.max(0, incomingSideSwapRequest.expiresAt - Date.now()));
    };
    updateTimer();
    const timer = window.setInterval(updateTimer, 100);
    return () => window.clearInterval(timer);
  }, [incomingSideSwapRequest]);

  if (playerSide !== "blue" && playerSide !== "red") return null;

  const canRequest = !draftState.draftStarted;
  const timerWidth = Math.min(100, (timeRemaining / 30000) * 100);

  return (
    <>
      {canRequest && (
        <div className="flex w-full justify-center py-1">
          <Button disabled={sideSwapPending} onClick={requestSideSwap}>
            {sideSwapPending ? "Swap Request Pending" : "Request Side Swap"}
          </Button>
        </div>
      )}
      {canRequest && incomingSideSwapRequest && (
        <div
          className="fix-popup fixed bottom-6 left-1/2 z-50 w-[min(100%-2rem,36rem)] -translate-x-1/2 overflow-hidden rounded-md border border-border bg-bg shadow-2xl text-text-primary"
          role="dialog"
          aria-modal="true"
          aria-labelledby="side-swap-title"
        >
          <div className="fixHeader px-6 py-4">
            <h3 id="side-swap-title">
              <span className={incomingSideSwapRequest.requestingSide === "blue" ? "text-blue" : "text-red"}>
                {incomingSideSwapRequest.requestingDisplayName}
              </span>{" "}
              is requesting to swap sides
            </h3>
          </div>
          <div className="fixActions flex gap-4 justify-center">
            <Button className="acceptBtn bg-green" onClick={() => respondToSideSwap(true)}>
              Accept
            </Button>
            <Button className="declineBtn bg-red" onClick={() => respondToSideSwap(false)}>
              Decline
            </Button>
          </div>
          <div className="mt-4 h-1 w-full bg-bg-light">
            <div className="h-full bg-orange transition-width duration-100 ease-linear" style={{ width: `${timerWidth}%` }} />
          </div>
        </div>
      )}
    </>
  );
};

export default SideSwapControl;