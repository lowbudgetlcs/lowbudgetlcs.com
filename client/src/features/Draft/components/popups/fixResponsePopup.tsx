import { useSocketContext } from "../../providers/SocketProvider";
import { useEffect, useState } from "react";

const FixResponsePopup = () => {
  const { fixResponse, setFixResponse } = useSocketContext();
  const [hidden, setHidden] = useState(true);
  const [hideAnimation, setHideAnimation] = useState(false);

  useEffect(() => {
    if (!fixResponse) {
      return;
    }

    setHidden(false);
    setHideAnimation(false);
    const hideTimer = window.setTimeout(() => setHideAnimation(true), 1500);
    const clearTimer = window.setTimeout(() => {
      setHidden(true);
      setFixResponse(null);
    }, 1950);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(clearTimer);
    };
  }, [fixResponse, setFixResponse]);

  if (hidden || !fixResponse) return null;

  const iconLink = `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/`;

  return (
    <div
      className={`popup fixed top-10 right-2 z-50 flex w-64 flex-col items-start justify-center rounded-md border-2 px-4 py-2 text-text-primary ${fixResponse.status ? "bg-green border-green/60" : "bg-red border-red/60"} animate-slide-in-left transition-opacity duration-500 ${
        hideAnimation ? "animate-slideOut" : ""
      }`}>
      <h3 className="text-lg font-bold">{fixResponse.status ? "Fix Accepted!" : "Fix Rejected!"}</h3>
      <div className="flex gap-2 items-center">
        <p>{fixResponse.sourceChampion}</p>
        <img src={`${iconLink}${fixResponse.sourceChampion}`} alt={fixResponse.sourceChampion} />
        <p>With <span>{fixResponse.replacementChampion}</span></p>
        <img src={`${iconLink}${fixResponse.replacementChampion}`} alt={fixResponse.replacementChampion} />
      </div>
    </div>
  );
};

export default FixResponsePopup;
