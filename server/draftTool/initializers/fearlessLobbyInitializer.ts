import { randomUUID } from "crypto";
import {
  insertDraft,
  insertInitialFearlessLobby,
} from "../../db/queries/insert";
import {
  FearlessInitializerProps,
  FearlessStateServerProps,
} from "../interfaces/initializerInferfaces";
import fearlessDraftStateInitializer from "./fearlessDraftStateInitializer";
const twentyFourHours = 60 * 60 * 24000; // 24 hours in milliseconds

// Holds EVERY active fearless lobby (for 24 hours)
export const fearlessState: Record<string, FearlessStateServerProps> = {};

export const fearlessLobbyInitializer = async ({
  fearlessCode,
  team1Code,
  team2Code,
  team1Name,
  team2Name,
  draftCount,
}: FearlessInitializerProps) => {
  try {

    // Verify fearless state is not already existing
    if (!fearlessState[fearlessCode]) {
      fearlessState[fearlessCode] = {
        fearlessCode: fearlessCode,
        fearlessComplete: false,
        team1Code: team1Code,
        team2Code: team2Code,
        team1Name: team1Name,
        team2Name: team2Name,
        draftCount: draftCount,
        completedDrafts: 0,
        currentDraft: null,
        currentBlueSide: null,
        currentRedSide: null,
        allPicks: [],
        allBans: [],
        draftLobbyCodes: null,
      };

      // Save Fearless Lobby to Database
      await insertInitialFearlessLobby({
        fearlessCode,
        team1Code,
        team2Code,
        team1Name,
        team2Name,
        draftCount,
      });

      // Sets expiration in server record (Currently 24 hours)
      setTimeout(() => {
        if (fearlessState[fearlessCode]) {
          delete fearlessState[fearlessCode];
          console.log(`Fearless lobby ${fearlessCode} deleted`);
        }
      }, twentyFourHours);
    }
    return fearlessState[fearlessCode];
  } catch (err) {
    console.error("Error setting up Fearless Lobby: ", err);
    throw new Error("Internal Server Error");
  }
};
