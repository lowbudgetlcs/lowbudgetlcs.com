import { Constants, LolApi } from "twisted";
import createMatchObject from "./createMatchObject";

const getMatchData = async (matchId: string) => {
  try {
    const rAPI = new LolApi(process.env.RIOTAPI || "");
    const response = await rAPI.MatchV5.get(
      matchId,
      Constants.RegionGroups.AMERICAS
    );
    if (response) {
      const rawMatchData = response.response;
      const matchObject = createMatchObject(rawMatchData);
      return matchObject;
    }

    return response;
  } catch (error) {
    console.error("Error getting match data within getMatchData: ", error);
  }
};

export default getMatchData;
