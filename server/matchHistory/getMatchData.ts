import { Constants, LolApi } from "twisted";
import { waitForRiotRateLimit } from "../utils/riotRateLimiter";

const getMatchData = async (matchId: string) => {
  try {
    await waitForRiotRateLimit();
    const rAPI = new LolApi(process.env.RIOTAPI ?? "");
    const response = await rAPI.MatchV5.get(matchId, Constants.RegionGroups.AMERICAS);
    return response.response;
  } catch (error) {
    console.error("Error getting match data within getMatchData", error);
  }
};

export default getMatchData;
