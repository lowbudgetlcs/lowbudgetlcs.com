import { getIdFromPerformance, getPlayer, getPlayers, getTournamentCodes } from "./db/queries/select";

const getPerformanceIds = async (summonerName: string) => {
    try {
        const playerName = await getPlayer(summonerName)
        const performanceIds = await getIdFromPerformance(playerName[0].id);
        return performanceIds;
    } catch (err) {
        throw err
    }

}

export default getPerformanceIds;