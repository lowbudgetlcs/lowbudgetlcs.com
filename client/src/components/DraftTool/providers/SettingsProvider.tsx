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
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({children}) => {
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [animationToggle, setAnimationToggle] = useLocalStorageState<boolean>("animationToggle", true);
  const [pickBanSplit, setPickBanSplit] = useLocalStorageState<boolean>("pickBanSplit", true);
  const [teamNameVisible, setTeamNameVisible] = useLocalStorageState<boolean>("teamNameVisible", true);
  const [smallIcons, setSmallIcons] = useLocalStorageState<boolean>("smallIcons", true);
  const [champNamesVisible, setChampNamesVisible] = useLocalStorageState<boolean>("champNamesVisible", true);
  const [volume, setVolume] = useLocalStorageState<number>("volume", 50);
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
