import { PlatformId, RiotAPI } from "@fightmegg/riot-api";
import { waitForRiotRateLimit } from "../utils/riotRateLimiter";

const getPlayerPuuid = async (gameName: string, tagLine: string) => {
  try {
    const rAPI = new RiotAPI(process.env.RIOTAPI || "");
    await waitForRiotRateLimit();
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
