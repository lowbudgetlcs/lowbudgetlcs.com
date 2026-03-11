import { PlatformId } from "@fightmegg/riot-api";
import { waitForRiotRateLimit } from "../../../utils/riotRateLimiter";
import { getRiotApiClient } from "../../../utils/riotApiClient";

const getPlayerPuuid = async (gameName: string, tagLine: string) => {
  try {
    const rAPI = getRiotApiClient();
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
