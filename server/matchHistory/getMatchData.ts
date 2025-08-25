import { Constants, LolApi } from "twisted";

const getMatchData = async (matchId: string) => {
  try {
    const rAPI = new LolApi(process.env.RIOTAPI || "");
    const response = await rAPI.MatchV5.get(matchId, Constants.RegionGroups.AMERICAS);
    return response.response;
  } catch (error) {
    console.error("Error getting match data within getMatchData");
  }
};

export default getMatchData;
