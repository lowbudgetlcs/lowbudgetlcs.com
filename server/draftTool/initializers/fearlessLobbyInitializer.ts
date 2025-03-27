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

// Holds EVERY active fearless lobby (for 12 hours)
export const fearlessState: Record<string, FearlessStateServerProps> = {};

export const fearlessLobbyInitializer = async ({
  fearlessCode,
  blueCode,
  redCode,
  blueDisplayName,
  redDisplayName,
  draftCount,
}: FearlessInitializerProps) => {
  try {
    const draftLobbies = [];
    // Create draft lobbies
    // Amout specified by draftCount variable from client
    for (let i = 0; i < draftCount; i++) {
      const lobbyCode = randomUUID();
      const draftInfo = {
        lobbyCode: lobbyCode,
        blueUser: blueCode,
        redUser: redCode,
        blueDisplayName: blueDisplayName,
        redDisplayName: redDisplayName,
        tournamentID: null, //Can change later to track fearless for LBLCS
        fearlessCode: fearlessCode,
      };
      const initializedDraft = fearlessDraftStateInitializer(draftInfo);
      await insertDraft(draftInfo);
      draftLobbies.push(initializedDraft);
    }
  
    // Verify draftLobbies array contents
    if (!fearlessState[fearlessCode]) {
      fearlessState[fearlessCode] = {
        fearlessCode: fearlessCode,
        fearlessComplete: false,
        blueCode: blueCode,
        redCode: redCode,
        blueDisplayName: blueDisplayName,
        redDisplayName: redDisplayName,
        draftCount: draftCount,
        completedDrafts: 0,
        currentDraft: null,
        allPicks: [],
        allBans: [],
        draftLobbyCodes: draftLobbies.map((lobby) => lobby.lobbyCode),
      };
  
      // Save Fearless Lobby to Database
      await insertInitialFearlessLobby({
        fearlessCode,
        blueCode,
        redCode,
        blueDisplayName,
        redDisplayName,
        draftCount,
        draftLobbyCodes: draftLobbies.map((lobby) => lobby.lobbyCode),
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
    console.error("Error setting up Fearless Lobby: ", err)
    throw new Error("Internal Server Error")
  }

};
