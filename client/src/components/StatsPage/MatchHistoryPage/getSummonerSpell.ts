import { PlayerGameDataProps } from "../statTypes";

// Sets the summoner spell ID to the proper format for link
const getSummonerSpell = (
  summonerId:
    | PlayerGameDataProps["summoner1"]
    | PlayerGameDataProps["summoner2"]
) => {
  switch (summonerId) {
    case 4:
      return "summoner_flash";
    case 3:
      return "summoner_exhaust";
    case 6:
      return "summoner_haste";
    case 21:
      return "summoner_boost";
    case 1:
      return "summonerbarrier";
    case 14:
      return "summonerignite";
    case 7:
      return "summoner_heal";
    case 13:
      return "summonermana";
    case 11:
      return "smitetracker";
    case 32:
      return "summoner_mark";
    case 12:
      return "summoner_teleport_new";
  }
};
export default getSummonerSpell;
