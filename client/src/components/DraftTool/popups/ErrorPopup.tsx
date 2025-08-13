import { useEffect, useState } from "react";
import { useSocketContext } from "../providers/SocketProvider";

const ErrorPopup = () => {
  const { showErrorPopup } = useSocketContext();
  const [hidden, setHidden] = useState(true);
  const [hideAnimation, setHideAnimation] = useState(false);
  useEffect(() => {
    if (showErrorPopup) {
      setHidden(false);
      setHideAnimation(false);

      const timer = setTimeout(() => {
        setHideAnimation(true);
        const hideTimer = setTimeout(() => setHidden(true), 450);
        return () => clearTimeout(hideTimer);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorPopup]);

  if (hidden) {
    return null;
  }

  return (
    <div
      className={`popup fixed top-10 right-2 w-64 h-12 flex flex-col items-start justify-center px-4 bg-red border-2 border-red/60 rounded-md z-50 animate-slide-in-left transition-opacity duration-300  ${
        hideAnimation ? "animate-slideOut" : ""
      }`}>
      <h3 className="text-lg font-bold text-white">Connection Error</h3>
      <p className="text-sm text-white">Please reload the page!</p>
    </div>
  );
};

export default ErrorPopup;
