import { randomUUID } from "crypto";
import {
  insertFinalFearlessLobby,
  insertInitialFearlessLobby,
} from "../../db/queries/insert";
import {
  FearlessInitializerProps,
  FearlessStateServerProps,
} from "../interfaces/initializerInferfaces";
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
  initialTournamentCode,
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
        draftLobbyCodes: [],
        initialTournamentCode: initialTournamentCode,
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

      const insertFinalFearlessHandler = async (
        fearlessLobby: FearlessStateServerProps
      ) => {
        await insertFinalFearlessLobby(fearlessLobby);
      };

      // Sets expiration in server record (Currently 24 hours)
      setTimeout(() => {
        if (fearlessState[fearlessCode]) {
          if (fearlessState[fearlessCode].completedDrafts > 0) {
            fearlessState[fearlessCode].fearlessComplete = true;
            insertFinalFearlessHandler(fearlessState[fearlessCode]);
          }
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
