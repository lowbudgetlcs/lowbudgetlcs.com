import { useRef } from "react";


const commercialGradient =
  "bg-gradient-to-r md:bg-gradient-to-b from-platinum-light to-platinum-dark";
const financialGradient =
  "bg-gradient-to-r md:bg-gradient-to-b from-emerald-light to-emerald-dark";
const economyGradient =
  "bg-gradient-to-r md:bg-gradient-to-b from-gold-light to-gold-dark";
const executiveGradient =
  "bg-gradient-to-r md:bg-gradient-to-b from-challenger-blue to-challenger-gold";

interface TeamProps {
  teamName: string;
  groupId: string;
  // captainId: number | null;
  logo: string | null;
  playerList: string[];
  divisionId: number;
}

function StatsTeamCard({
  teamName,
  logo,
  divisionId,
}: TeamProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  let gradient;
  switch (divisionId) {
    case 1:
      gradient = economyGradient;
      break;
    case 2:
      gradient = commercialGradient;
      break;
    case 3:
      gradient = financialGradient;
      break;
    case 4:
      gradient = executiveGradient;
      break;
  }

  const displayLogo = () => {
    if (logo) {
      return (
        <img
          src={logo}
          className="logo flex-shrink-0 w-[150px] text-center text-3xl h-[150px]"
        />
      );
    } else {
      return (
        <div className="logo flex-shrink-0 w-[150px] text-center text-3xl h-[150px] bg-gray">
          No logo 😢
        </div>
      );
    }
  };

    return (
      <div
        ref={cardRef}
        className={`teamCard relative transition duration-300 rounded-lg bg-gray/80 dark:bg-gray/40`}
      >
        <div className="flex flex-col md:flex-row py-4 md:py-0 md:pl-4 gap-4 items-center max-w-md md:max-w-full md:w-full min-h-32 md:h-40 overflow-hidden">
          <div className="logoContainer flex flex-col md:flex-row gap-4 w-full md:w-auto md:h-full items-center">
            {displayLogo()}
            <div className={`w-full h-3 md:w-3 md:h-full ${gradient}`}></div>
          </div>
          <div className="flex flex-col md:flex-row flex-1 flex-shrink md:ml-4 items-center">
            <h3 className="teamName text-xl text-center md:text-left font-semibold px-16 md:px-8 text-white">
              {teamName}
            </h3>
          </div>
        </div>
      </div>
    );
}

export default StatsTeamCard