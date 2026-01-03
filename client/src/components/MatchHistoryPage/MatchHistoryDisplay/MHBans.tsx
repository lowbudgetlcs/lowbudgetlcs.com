import { BanDto } from "../../../types/MatchV5";
import tempImage from "../../../assets/lblcsLogo.svg";
const MHBans = ({ banList }: { banList: BanDto[] }) => {
  return (
    <div className="banList grid grid-cols-3 grid-rows-2 lg:flex flex-row gap-2">
      {banList.map((ban: BanDto) => {
        const link = `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${ban.championId}/square`;
        if (ban.championId === -1)
          return (
            <div className="border-2 border-black w-12 h-12">
              <img
                src={tempImage}
                alt="nothing"
                width="48px"
                height="48px"
                className="object-cover scale-90 grayscale opacity-25"
              />
            </div>
          );
        return (
          <img
            src={link}
            key={ban.pickTurn}
            className="w-12 h-12 grayscale-[50%]"
            alt={`champion ID: ${ban.championId}`}></img>
        );
      })}
    </div>
  );
};

export default MHBans;
