import { RiotAPI, RiotAPITypes, PlatformId, RiotAPI, regionToCluster } from "@fightmegg/riot-api";
import cluster from "cluster";

const getMatchData = async (matchId: number) => {
    const rAPI = new RiotAPI(process.env.RIOTAPI || "")
    const cluster = regionToCluster("NA1")
    const matchData = await rAPI.matchV5.getMatchById()
};

export default getMatchData();
