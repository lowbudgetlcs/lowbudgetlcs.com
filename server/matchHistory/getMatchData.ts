import { RiotAPI, PlatformId } from "@fightmegg/riot-api";
import createMatchObject from "./createMatchObject";

const getMatchData = async (matchId: string) => {
  try {
    const rAPI = new RiotAPI(process.env.RIOTAPI || "");
    const rawMatchData = await rAPI.matchV5.getMatchById({
      cluster: PlatformId.AMERICAS,
      matchId: matchId,
    });
    const matchObject = createMatchObject(rawMatchData);
    return matchObject;
  } catch (error) {
    console.error(error);
  }
};

export default getMatchData;
