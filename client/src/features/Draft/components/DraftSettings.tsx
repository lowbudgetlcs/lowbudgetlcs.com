import ToggleButton from "../../../components/ToggleButton";
import { useSettingsContext } from "../providers/SettingsProvider";

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
    champIconsVisible,
    setChampIconsVisible,
    pickNamesVisible,
    setPickNamesVisible,
    forceDesktopView,
    setForceDesktopView,
  } = useSettingsContext();

  function toggleClose() {
    setSettingsVisible(false);
  }

  if (settingsVisible) {
    return (
      <div
        className={`popup fixed justify-center items-center z-99999 inset-0 transition duration-1000 flex bg-black/75`}
      >
        <div onClick={toggleClose} className="absolute w-full h-full"></div>
        <div className="relative px-8 pt-12 rounded-lg w-full md:w-fit text-white bg-light-gray border-2 border-gray z-10">
          <h2 className="text-3xl text-center font-bold">Settings</h2>
          <i
            onClick={toggleClose}
            className="absolute bi bi-x-lg text-3xl hover:cursor-pointer right-5 md:right-10 top-4 md:top-8"
          ></i>
          <div className="flex flex-col gap-4 items-start w-full p-6 md:p-10">
            <div className="toggleBox flex gap-4 justify-around">
              <ToggleButton isOn={smallIcons} setFunction={setSmallIcons} />
              <p>Small Icons</p>
            </div>
            <div className="toggleBox flex gap-4 justify-around">
              <ToggleButton
                isOn={champIconsVisible}
                setFunction={setChampIconsVisible}
              />
              <p>Champion Icons</p>
            </div>
            <div className="toggleBox flex gap-4 justify-around">
              <ToggleButton
                isOn={champNamesVisible}
                setFunction={setChampNamesVisible}
              />
              <p>Champion Icon Names</p>
            </div>
            <div className="toggleBox flex gap-4 justify-around">
              <ToggleButton
                isOn={pickNamesVisible}
                setFunction={setPickNamesVisible}
              />
              <p>Champion Pick Box Names</p>
            </div>
            <div className="toggleBox flex gap-4 justify-around">
              <ToggleButton isOn={pickBanSplit} setFunction={setPickBanSplit} />
              <p>Show Pick/Ban Phase Split</p>
            </div>
            <div className="toggleBox flex gap-4 justify-around">
              <ToggleButton
                isOn={teamNameVisible}
                setFunction={setTeamNameVisible}
              />
              <p>Team Names</p>
            </div>
            <div className="toggleBox flex gap-4 justify-around">
              <ToggleButton
                isOn={forceDesktopView}
                setFunction={setForceDesktopView}
              />
              <p>Force Desktop View</p>
            </div>
            <div className="toggleBox flex gap-4 justify-around">
              <ToggleButton
                isOn={animationToggle}
                setFunction={setAnimationToggle}
              />
              <p>Spin Animation</p>
            </div>
            <div className="toggleBox flex gap-4 justify-around items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="slider w-26 appearance-none bg-white rounded-md h-2 opacity-85 transition duration-300"
              />
              <p className="w-28">Volume: {volume}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default DraftSettings;
