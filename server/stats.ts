import { getIdFromPerformance, getTournamentCodes } from "./db/queries/select";

const getPerformanceIds = async () => {
    try {
        const response = await getIdFromPerformance(1);
        return response
    } catch (err) {
        console.error("cookie: ", err)
    }

}

export default getPerformanceIds;