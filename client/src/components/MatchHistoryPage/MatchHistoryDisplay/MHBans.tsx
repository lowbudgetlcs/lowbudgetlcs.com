import { BanDto } from "../interfaces/MatchV5";

const MHBans = ({ banList }: { banList: BanDto[] }) => {
  return (
    <div className="banList grid grid-cols-3 grid-rows-2 lg:flex flex-row gap-2">
      {banList.map((ban: BanDto) => {
        const link = `https://cdn.communitydragon.org/latest/champion/${ban.championId}/square`;
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
