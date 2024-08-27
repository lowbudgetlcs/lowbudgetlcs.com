import { Link, NavLink, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { PlayerProps, TeamProps } from "./Roster";
interface LeagueGroupsProps {
  league: string;
}

function LeagueGroups() {

  const { teams, players } = useOutletContext<{ teams: TeamProps[], players: PlayerProps[] }>();
  const { league }: LeagueGroupsProps = useLocation().state;
  return (
    <div className=" relativeaccounts bg-white text-black dark:bg-black dark:text-white min-h-screen">
      <Link
        to={".."}
        className="absolute top-16 left-4 text-2xl font-semibold cursor-pointer underline underline-offset-2 transition duration-300 hover:text-orange"
      >
        Back
      </Link>
      <Outlet context={{teams, players}} />
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl">{league}</h1>
      </div>
      <div className="flex flex-col items-center">
        <p className="summary text-lg md:text-xl px-16 py-8 text-center">
          Click below to navigate leagues, groups, and teams
        </p>
        <div className="cardContainerContainer flex flex-col w-full justify-center items-center gap-8">
          <div className="cardContainer flex flex-col md:flex-row justify-center items-center gap-8 z-10 w-4/5 overflow-hidden">
            <NavLink
              state={{ group: "A", league: league }}
              to={"a"}
              className={`card cursor-pointer hover:bg-gradient-to-br from-gold-light to-gold-dark transition-all duration-1000 flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg bg-gray/80 dark:bg-gray/40`}
            >
              <h2 className="text-3xl text-white text-center font-semibold">
                Group A
              </h2>
            </NavLink>
            <NavLink
              state={{ group: "B", league: league }}
              to={"b"}
              className={`card cursor-pointer hover:bg-gradient-to-br from-platinum-light to-platinum-dark transition-all duration-1000 flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg bg-gray/80 dark:bg-gray/40`}
            >
              <h2 className="text-3xl text-white text-center font-semibold">
                Group B
              </h2>
            </NavLink>
          </div>
          <div className="cardContainer flex flex-col md:flex-row justify-center items-center gap-8 z-10 w-4/5 overflow-hidden">
            <NavLink
              state={{ group: "C", league: league }}
              to={"c"}
              className={`card cursor-pointer hover:bg-gradient-to-br from-emerald-light to-emerald-dark transition-all duration-1000 flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg bg-gray/80 dark:bg-gray/40`}
            >
              <h2 className="text-3xl text-white text-center font-semibold">
                Group C
              </h2>
            </NavLink>
            <NavLink
              state={{ group: "D", league: league }}
              to={"d"}
              className={`card cursor-pointer hover:bg-gradient-to-br from-challenger-blue to-challenger-gold transition-all duration-1000 flex items-center justify-center w-4/5 md:w-2/3 lg:w-1/2 min-h-32 md:h-40 rounded-lg bg-gray/80 dark:bg-gray/40`}
            >
              <h2 className="text-3xl text-white text-center font-semibold">
                Group D
              </h2>
            </NavLink>
          </div>
        </div>
        {/* <div className="teamContainer flex flex-col gap-8 md:w-3/5 lg:w-3/6 overflow-hidden justify-center">
          {teams.map((team) => {
            return <TeamCard key={team.id} teamName={team.teamName} groupId={team.groupId} divisionId={team.divisionId} logo={team.logo} playerList={team.playerList}/>
          }) }
        </div> */}
      </div>
    </div>
  );
}

export default LeagueGroups;
