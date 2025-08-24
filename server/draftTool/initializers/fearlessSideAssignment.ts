import { FearlessStateServerProps } from "../interfaces/initializerInferfaces";
import fearlessDraftStateInitializer from "./fearlessDraftStateInitializer";
import { insertDraft } from "../../db/queries/insert";
import ShortUniqueId from "short-unique-id";

// Runs for every new fearless draft initialized in the series
// Sets the sides according to "Host", Team 1
const { randomUUID } = new ShortUniqueId({ length: 10 });
const fearlessSideAssignment = async (
  teamCode: string,
  fearlessLobby: FearlessStateServerProps,
  chosenSide: string,
  tournamentID?: string
) => {
  try {
    const {
      team1Code,
      team2Code,
      team1Name,
      team2Name,
      fearlessCode,
      completedDrafts,
      initialTournamentCode,
    } = fearlessLobby;

    // Just in case, should never happen
    if (teamCode !== team1Code) {
      return;
    }

    // Assumes team 1 is setting the sides
    if (chosenSide === "blue") {
      fearlessLobby.currentBlueSide = team1Name;
      fearlessLobby.currentRedSide = team2Name;
    } else {
      fearlessLobby.currentRedSide = team1Name;
      fearlessLobby.currentBlueSide = team2Name;
    }

    // Display names depending on side set
    const blueDisplayName = fearlessLobby.currentBlueSide;
    const redDisplayName = fearlessLobby.currentRedSide;

    // Make the Typescript happy
    if (!fearlessLobby.currentBlueSide || !fearlessLobby.currentRedSide) {
      return;
    }

    const isFirstDraft = completedDrafts === 0;
    const lobbyCode = randomUUID();
    const shortCode = (isFirstDraft && initialTournamentCode) || tournamentID;
    const draftInfo = {
      lobbyCode: lobbyCode,
      blueUser: fearlessLobby.currentBlueSide === team1Name ? team1Code : team2Code, //Blue Code
      redUser: fearlessLobby.currentRedSide === team1Name ? team1Code : team2Code, //Red Code
      blueDisplayName: blueDisplayName,
      redDisplayName: redDisplayName,
      tournamentID: shortCode || null,
      fearlessCode: fearlessCode,
    };

    // Initializes draft and returns the draft state
    // Sets a window of time to use the draft lobby before it is deleted from the server
    // If completed will still be saved to database
    const initializedDraft = fearlessDraftStateInitializer(draftInfo);

    // Insert Standard incomplete draft to db
    await insertDraft(initializedDraft);
    fearlessLobby.currentDraft = draftInfo.lobbyCode;
    fearlessLobby.draftLobbyCodes.push(draftInfo.lobbyCode);
  } catch (err) {
    console.error("Error inserting draft after side assignment: ", err);
    throw new Error("Internal Server Error");
  }
};

export default fearlessSideAssignment;
