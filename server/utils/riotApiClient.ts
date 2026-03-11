import { RiotAPI } from "@fightmegg/riot-api";

let riotApiInstance: RiotAPI | null = null;

/**
 * Returns a shared RiotAPI client instance.
 * Avoids re-instantiating on every API call.
 */
export const getRiotApiClient = (): RiotAPI => {
  if (!riotApiInstance) {
    riotApiInstance = new RiotAPI(process.env.RIOTAPI || "");
  }
  return riotApiInstance;
};
