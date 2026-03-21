import { useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const Theme = ({
  isLightMode,
  setIsLightMode,
  isHome,
}: {
  isLightMode: boolean;
  setIsLightMode: React.Dispatch<React.SetStateAction<boolean>>;
  isHome: boolean;
}) => {
  useEffect(() => {
    const body = document.body;
    if (isLightMode) {
      body.classList.add("light");
    } else {
      body.classList.remove("light");
    }
  }, [isLightMode]);

  return (
    <div
      className={`themeSelect text-2xl flex items-center justify-center ${
        isHome ? "text-white" : "text-text-primary"
      }`}>
      {isLightMode ? (
        <button
          className="cursor-pointer p-2"
          onClick={() => setIsLightMode(false)}
          aria-label="Switch to dark mode">
          <FaSun />
        </button>
      ) : (
        <button
          className="cursor-pointer p-2"
          onClick={() => setIsLightMode(true)}
          aria-label="Switch to light mode">
          <FaMoon />
        </button>
      )}
    </div>
  );
};

export default Theme;
