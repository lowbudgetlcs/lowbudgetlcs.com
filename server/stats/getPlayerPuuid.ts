import { PlatformId, RiotAPI } from "@fightmegg/riot-api";
import { Constants, LolApi } from "twisted";

const getPlayerPuuid = async (gameName: string, tagLine: string) => {
  try {
    const rAPI = new RiotAPI(process.env.RIOTAPI || "");
    const response = await rAPI.account.getByRiotId({
      region: PlatformId.AMERICAS,
      gameName: gameName,
      tagLine: tagLine,
    });
    return response;
  } catch (error) {
    // Error handled in parent function as a warn
  }
};

export default getPlayerPuuid;
