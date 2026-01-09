import { useEffect, useState } from "react";
import { useSocketContext } from "../../providers/SocketProvider";

const ReconnectPopup = () => {
  const { showErrorPopup, showReconnectPopup } = useSocketContext();
  const [hidden, setHidden] = useState(true);
  const [hideAnimation, setHideAnimation] = useState(false);
  
  useEffect(() => {
    if (showReconnectPopup) {
      setHidden(false);
      setHideAnimation(false);
    } else {
      setHideAnimation(true);
      const hideTimer = setTimeout(() => setHidden(true), 450);
      return () => clearTimeout(hideTimer);
    }
  }, [showReconnectPopup]);
  
  if (hidden || showErrorPopup) {
    return null;
  }
  
  return (
    <div
      className={`popup fixed top-10 right-2 w-64 h-12 flex flex-col items-start justify-center px-4 bg-light-gray border-2 border-gray rounded-md z-50 animate-slide-in-left transition-opacity duration-300 ${
        hideAnimation ? "animate-slideOut" : ""
      }`}>
      <h3 className="text-xl font-bold text-white">Reconnecting...</h3>
      <div className={"line animate-expandWidth-5s h-1 rounded-full bg-white/60 w-full"}></div>
    </div>
  );
};

export default ReconnectPopup;