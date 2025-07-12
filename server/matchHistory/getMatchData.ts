import { RiotAPI, PlatformId } from "@fightmegg/riot-api";
import cluster from "cluster";

const getMatchData = async (matchId: string) => {
  try {
    const rAPI = new RiotAPI(process.env.RIOTAPI || "");
    const matchData = await rAPI.matchV5.getMatchById({
      cluster: PlatformId.AMERICAS,
      matchId: matchId,
    });
    console.log(matchData)
    return matchData;
  } catch (error) {
    console.error(error);
  }
};

export default getMatchData;
