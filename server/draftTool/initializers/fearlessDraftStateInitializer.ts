import { draftState } from "../states/draftState";
import { FearlessDraftInitializerProps } from "../interfaces/initializerInferfaces";
import { fearlessState } from "./fearlessLobbyInitializer";
const twentyFourHours = 60 * 60 * 24000; // 24 hours in milliseconds

const fearlessDraftStateInitializer = ({
  lobbyCode,
  blueUser,
  redUser,
  blueDisplayName,
  redDisplayName,
  fearlessCode,
}: FearlessDraftInitializerProps) => {
  if (!draftState[lobbyCode]) {
    draftState[lobbyCode] = {
      draftStarted: false,
      activePhase: null,
      phaseType: null,
      tournamentID: null,
      lobbyCode: lobbyCode,
      blueUser: blueUser,
      redUser: redUser,
      blueDisplayName: blueDisplayName,
      redDisplayName: redDisplayName,
      blueReady: false,
      redReady: false,
      timer: 34,
      bansArray: [],
      picksArray: [...fearlessState[fearlessCode].allPicks],
      bluePicks: [],
      redPicks: [],
      blueBans: [],
      redBans: [],
      banIndex: 0,
      pickIndex: 0,
      currentTurn: "",
      currentBluePick: 0,
      currentRedPick: 0,
      currentBlueBan: 0,
      currentRedBan: 0,
      displayTurn: null,
      currentHover: null,
      bluePick: null,
      redPick: null,
      draftComplete: false,
      fearlessCode: fearlessCode,
    };

    setTimeout(() => {
      if (draftState[lobbyCode]) {
        delete draftState[lobbyCode];
        console.log(`Draft state for lobby ${lobbyCode} deleted`);
      }
    }, twentyFourHours);
  }
  return draftState[lobbyCode];
};

export default fearlessDraftStateInitializer;
