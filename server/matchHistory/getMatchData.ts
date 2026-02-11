import { Constants, LolApi } from "twisted";

const rateLimit = 50;
const rateLimitMs = 20000;

let requestCount = 0;
let windowStartMs = Date.now();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForRateLimit = async () => {
  if (Date.now() - windowStartMs >= rateLimitMs) {
    requestCount = 0;
    windowStartMs = Date.now();
  }

  if (requestCount >= rateLimit) {
    await delay(rateLimitMs - (Date.now() - windowStartMs) + 100);
    requestCount = 0;
    windowStartMs = Date.now();
  }
  requestCount++;
};

const getMatchData = async (matchId: string) => {
  try {
    await waitForRateLimit();
    const rAPI = new LolApi(process.env.RIOTAPI || "");
    const response = await rAPI.MatchV5.get(matchId, Constants.RegionGroups.AMERICAS);
    return response.response;
  } catch (error) {
    console.error("Error getting match data within getMatchData");
  }
};

export default getMatchData;
