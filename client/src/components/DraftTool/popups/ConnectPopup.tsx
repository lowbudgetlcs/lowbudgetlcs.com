import { useEffect, useState } from "react";
import { useSocketContext } from "../providers/SocketProvider";

const ConnectPopup = () => {
  const { showConnectedPopup } = useSocketContext();
  const [hidden, setHidden] = useState(true);
  const [hideAnimation, setHideAnimation] = useState(false);

  useEffect(() => {
    if (showConnectedPopup) {
      setHidden(false);
      setHideAnimation(false);

      const timer = setTimeout(() => {
        setHideAnimation(true);
        const hideTimer = setTimeout(() => setHidden(true), 450);
        return () => clearTimeout(hideTimer);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [showConnectedPopup]);

  if (hidden) {
    return null;
  }

  return (
    <div
      className={`popup fixed top-10 right-2 w-64 h-12 flex flex-col items-start justify-center px-4 bg-green border-2 border-green rounded-md z-50 animate-slide-in-left transition-opacity duration-300 ${
        hideAnimation ? "animate-slideOut" : ""
      }`}>
      <h3 className="text-lg font-bold text-white">Connected to Server!</h3>
    </div>
  );
};

export default ConnectPopup;