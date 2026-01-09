import { useState } from "react";
import { useLeagueData } from "../../../Roster/providers/leagueDataContext";
import tempImage from "../../../../assets/lblcsLogo.svg";
const LogoBox = () => {
  const { teams } = useLeagueData();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chosenLogo, setChosenLogo] = useState<string | null>();
  return (
    <div className=" relative  z-50">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`logoBox group w-64 h-64 cursor-pointer rounded-md flex justify-center items-center p-2`}
      >
        {chosenLogo && chosenLogo !== "blank" ? (
          <img src={chosenLogo}></img>
        ) : chosenLogo === "blank" ? (
          <div></div>
        ) : (
          <div
            onClick={() => {
              setChosenLogo(null);
              setIsOpen(!isOpen);
            }}
            className="logo cursor-pointer w-full h-full blank flex justify-center items-center text-center bg-black border-2 border-gray rounded-md"
          >
            <p className="text-xl">Click to choose Logo/Blank</p>
          </div>
        )}

        <div className="dropBtn absolute bottom-0 right-0 self-end">
          <div
            className="burger transition duration-300 opacity-0 group-hover:opacity-100 cursor-pointer relative
            h-12 w-12 gap-1 hover:cursor-pointer self-baseline"
          >
            <div
              className={`absolute ${
                isOpen ? "-rotate-45" : "rotate-45"
              } top-4 left-0 transition-all duration-500 px-3 py-0.5 rounded-xl bg-white`}
            ></div>
            <div
              className={`absolute ${
                isOpen ? "rotate-45" : "-rotate-45"
              } top-4 left-4 transition-all duration-500 px-3 py-0.5 rounded-xl bg-white`}
            ></div>
          </div>
        </div>
      </div>
      {/* Drop Down */}
      {isOpen && (
        <div
          className={`logosDropDown cursor-default absolute top-full overflow-y-scroll flex flex-wrap 4 gap-2 items-center justify-center w-96 h-48 animate-fadeIn z-50 rounded-b-md bg-light-gray border-2 border-gray`}
        >
          <div className="grid grid-cols-4 gap-4 p-4 justify-center items-center">
            <div
              onClick={() => {
                setChosenLogo("blank");
                setIsOpen(!isOpen);
              }}
              className="logo cursor-pointer blank w-16 h-16 flex justify-center items-center text-center bg-black border-2 border-gray 
                rounded-md hover:scale-110 hover:brightness-110 transition duration-200"
            >
              <p className="text-xl">Blank</p>
            </div>

            {teams.map((team) => {
              if (team.logo)
                return (
                  <div
                    key={team.name}
                    onClick={() => {
                      setChosenLogo(team.logo ? team.logo : tempImage);
                      setIsOpen(!isOpen);
                    }}
                    className="logo hover:scale-110 hover:brightness-110 transition duration-200 
                    flex justify-center items-center hover:bg-gray rounded-md cursor-pointer w-16 h-16 "
                  >
                    <img src={team.logo || tempImage} />
                  </div>
                );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoBox;
