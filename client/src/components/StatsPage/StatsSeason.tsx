import { useState } from "react";
import Button from "../Button";
import { useLeagueData } from "../leagueDataContext";
import StatsTeamCard from "./StatsTeamCard";
import { Link } from "react-router-dom";

function StatsSeason() {
  const [season, setSeason] = useState<number>();
  const { teams } = useLeagueData();
  const [activeLink, setActiveLink] = useState<string>("Economy");
  const [currentDivision, setCurrentDivision] = useState<string>(activeLink);
console.debug(currentDivision)
  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
    setCurrentDivision(navItem);
  };
  let divisionId: number;

  switch (activeLink) {
    case "Economy":
      divisionId = 1;
      break;
    case "Commercial":
      divisionId = 2;
      break;
    case "Financial":
      divisionId = 3;
      break;
    case "Executive":
      divisionId = 4;
      break;
  }
  return (
    <>
      {season ? (
        <>
          <div className="navList">
            <ul className="relative flex gap-4 text-sm sm:text-base md:text-2xl font-semibold justify-center p-4">
              <li
                onClick={() => toggleActive("Economy")}
                className="relative active:text-orange hover:text-orange transition duration-300 cursor-pointer"
              >
                Economy
                <span
                  className={`line absolute ${
                    activeLink === "Economy" ? "w-full" : "w-0"
                  } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 left-0`}
                ></span>
              </li>
              <li
                onClick={() => toggleActive("Commercial")}
                className="relative active:text-orange hover:text-orange transition duration-300 cursor-pointer"
              >
                Commercial
                <span
                  className={`line absolute ${
                    activeLink === "Commercial" ? "w-full" : "w-0"
                  } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 left-0`}
                ></span>
              </li>
              <li
                onClick={() => toggleActive("Financial")}
                className="relative active:text-orange hover:text-orange transition duration-300 cursor-pointer"
              >
                Financial
                <span
                  className={`line absolute ${
                    activeLink === "Financial" ? "w-full" : "w-0"
                  } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 left-0`}
                ></span>
              </li>
              <li
                onClick={() => toggleActive("Executive")}
                className="relative active:text-orange hover:text-orange transition duration-300 cursor-pointer"
              >
                Executive
                <span
                  className={`line absolute ${
                    activeLink === "Executive" ? "w-full" : "w-0"
                  } h-0 transition-all duration-200 border-b-4 border-orange rounded-md bg-orange -bottom-0.5 left-0`}
                ></span>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            {teams.map((team) => {
              if (team.divisionId === divisionId) {
                return (
                  <Link
                    to={`team/` + team.id.toString()}
                    key={team.id}
                    state={{
                      teamID: team.id,
                      teamName: team.name,
                      groupId: team.groupId,
                      divisionId: team.divisionId,
                      logo: team.logo,
                      playerList: team.playerList,
                    }}
                  >
                    <StatsTeamCard
                      key={team.id}
                      teamName={team.name}
                      groupId={team.groupId}
                      divisionId={team.divisionId}
                      logo={team.logo}
                      playerList={team.playerList}
                    />
                  </Link>
                );
              }
            })}
          </div>
        </>
      ) : (
        <div className="seasonList flex flex-col justify-center items-center py-4 text-center">
          <h2 className="text-center text-2xl font-bold p-4">
            Choose a Season
          </h2>
          <div
            onClick={() => {
              setSeason(13);
            }}
            className="cursor-pointer"
          >
            <Button>
              Season 13
              <br />
              <span>Summer/Fall 2024</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default StatsSeason;
