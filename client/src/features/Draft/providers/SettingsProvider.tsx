import { createContext, ReactNode, useContext, useState } from "react";
import { useLocalStorageState } from "../../../hooks/uselocalStorageState";

interface SettingsContextProps {
  settingsVisible: boolean;
  setSettingsVisible: React.Dispatch<React.SetStateAction<boolean>>;
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
  champIconsVisible: boolean;
  setChampIconsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  pickNamesVisible: boolean;
  setPickNamesVisible: React.Dispatch<React.SetStateAction<boolean>>;
  forceDesktopView: boolean;
  setForceDesktopView: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({children}) => {
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [animationToggle, setAnimationToggle] = useLocalStorageState<boolean>("animationToggle", false);
  const [pickBanSplit, setPickBanSplit] = useLocalStorageState<boolean>("pickBanSplit", true);
  const [teamNameVisible, setTeamNameVisible] = useLocalStorageState<boolean>("teamNameVisible", true);
  const [smallIcons, setSmallIcons] = useLocalStorageState<boolean>("smallIcons", true);
  const [champNamesVisible, setChampNamesVisible] = useLocalStorageState<boolean>("champNamesVisible", true);
  const [volume, setVolume] = useLocalStorageState<number>("volume", 30);
  const [champIconsVisible, setChampIconsVisible] = useLocalStorageState<boolean>("champIconsVisible", true);
  const [pickNamesVisible, setPickNamesVisible] = useLocalStorageState<boolean>("pickNamesVisible", true);
  const [forceDesktopView, setForceDesktopView] = useLocalStorageState<boolean>("forceDesktopView", false);
  return (
    <SettingsContext.Provider
      value={{
        settingsVisible,
        setSettingsVisible,
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
        champIconsVisible,
        setChampIconsVisible,
        pickNamesVisible,
        setPickNamesVisible,
        forceDesktopView,
        setForceDesktopView
      }}
    >
      {children}
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
