import { randomUUID } from "crypto";
import { FearlessStateServerProps } from "../interfaces/initializerInferfaces";
import fearlessDraftStateInitializer from "./fearlessDraftStateInitializer";
import { insertDraft } from "../../db/queries/insert";

// Runs for every new fearless draft initialized in the series
// Sets the sides according to "Host", Team 1
const fearlessSideAssignment = async (
  teamCode: string,
  fearlessLobby: FearlessStateServerProps,
  chosenSide: string
) => {
  try {
    const { team1Code, team2Code, team1Name, team2Name, fearlessCode } =
      fearlessLobby;
    let { currentBlueSide, currentRedSide } = fearlessLobby;

    // Just in case, should never happen
    if (teamCode !== team1Code) {
      return;
    }

    // Assumes team 1 is setting the sides
    if (chosenSide === "blue") {
      currentBlueSide = team1Name;
      currentRedSide = team2Name;
    } else {
      currentRedSide = team1Name;
      currentBlueSide = team2Name;
    }

    // Display names depending on side set
    const blueDisplayName = currentBlueSide;
    const redDisplayName = currentRedSide;

    // Make the Typescript happy
    if (!currentBlueSide || !currentRedSide) {
      return;
    }

    const lobbyCode = randomUUID();
    const draftInfo = {
      lobbyCode: lobbyCode,
      blueUser: currentBlueSide === team1Name ? team1Code : team2Code, //Blue Code
      redUser: currentRedSide === team1Name ? team1Code : team2Code, //Red Code
      blueDisplayName: blueDisplayName,
      redDisplayName: redDisplayName,
      tournamentID: null, //Can change later to track fearless for LBLCS
      fearlessCode: fearlessCode,
    };

    // Initializes draft and returns the draft state
    // Sets a window of time to use the draft lobby before it is deleted from the server
    // If completed will still be saved to database
    const initializedDraft = fearlessDraftStateInitializer(draftInfo);

    // Insert Standard incomplete draft to db
    await insertDraft(initializedDraft);

  } catch (err) {
    console.error("Error inserting draft after side assignment: ", err);
    throw new Error("Internal Server Error");
  }
};

export default fearlessSideAssignment;
