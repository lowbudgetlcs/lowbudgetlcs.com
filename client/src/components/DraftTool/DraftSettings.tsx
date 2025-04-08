import ToggleButton from "../ToggleButton";
import { useSettingsContext } from "./providers/SettingsProvider";

const DraftSettings = () => {
  const {
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
  } = useSettingsContext();

  function toggleClose() {
    setSettingsVisible(false);
  }

  if (settingsVisible) {
    return (
      <div
        className={`popup fixed justify-center items-center z-50 inset-0 transition duration-1000 flex bg-black/85`}
      >
        <div onClick={toggleClose} className="absolute w-full h-full"></div>
        <div className="relative px-8 pt-12 rounded-lg w-full md:w-fit text-white bg-light-gray border-2 border-gray z-10">
          <h2 className="text-3xl text-center font-bold">Settings</h2>
          <i
            onClick={toggleClose}
            className="absolute bi bi-x-lg text-3xl hover:cursor-pointer right-5 md:right-10 top-4 md:top-8"
          ></i>
          <div className="flex flex-col gap-8 items-start w-full py-8">
            <div className="toggleBox flex gap-4 justify-around">
              <ToggleButton isOn={animationToggle} setFunction={setAnimationToggle}/>
              <p>Toggle Animation</p>
            </div>
            <div className="toggleBox flex gap-4 justify-around">
              <ToggleButton isOn={pickBanSplit} setFunction={setPickBanSplit}/>
              <p>Show Pick/Ban Phase Split</p>
            </div>
            <div className="toggleBox flex gap-4 justify-around">
              <ToggleButton isOn={teamNameVisible} setFunction={setTeamNameVisible}/>
              <p>Display Team Names</p>
            </div>
            <div className="toggleBox flex gap-4 justify-around">
              <ToggleButton isOn={smallIcons} setFunction={setSmallIcons}/>
              <p>Display Small Icons</p>
            </div>
            <div className="toggleBox flex gap-4 justify-around">
              <ToggleButton isOn={champNamesVisible} setFunction={setChampNamesVisible}/>
              <p>Display Champion Names</p>
            </div>
            <div className="toggleBox flex gap-4 justify-around items-center">
              {/* For volume, you might want a different input type */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24" 
              />
              <p>Set Volume: {volume}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default DraftSettings;