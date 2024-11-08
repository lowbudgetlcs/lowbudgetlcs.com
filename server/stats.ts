import { getTournamentCodes } from "./db/queries/select";

const listTournamentCodes = async () => {
    try {
        const response = await getTournamentCodes();
        return response
    } catch (err) {
        console.error("cookie: ", err)
    }

}

export default listTournamentCodes;