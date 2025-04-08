import { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";

interface SettingsContextProps {
  animationToggle: boolean;
  setAnimationToggle: React.Dispatch<React.SetStateAction<boolean>>;
  pickBanSplit: boolean;
  setPickBanSplit: React.Dispatch<React.SetStateAction<boolean>>;
  teamNameVisible: boolean;
  setTeamNameVisible: React.Dispatch<React.SetStateAction<boolean>>;
  smallIcons: boolean;
  setSmallIcons: React.Dispatch<React.SetStateAction<boolean>>;
  champNamesVisible: boolean;
  setChampNamesVisible: React.Dispatch<React.SetStateAction<boolean>>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const SettingsProvider: React.FC = () => {
  const [animationToggle, setAnimationToggle] = useState<boolean>(true);
  const [pickBanSplit, setPickBanSplit] = useState<boolean>(true);
  const [teamNameVisible, setTeamNameVisible] = useState<boolean>(true);
  const [smallIcons, setSmallIcons] = useState<boolean>(false);
  const [champNamesVisible, setChampNamesVisible] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0);
  return (
    <SettingsContext.Provider
      value={{
        animationToggle,
        setAnimationToggle,
        pickBanSplit,
        setPickBanSplit,
        teamNameVisible,
        setTeamNameVisible,
        smallIcons,
        setSmallIcons,
        champNamesVisible,
        setChampNamesVisible,
        volume,
        setVolume,
      }}
    >
      <Outlet />
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
