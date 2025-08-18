import EventEmitter from "events";
import { Namespace } from "socket.io";

const twoHours = 60 * 60 * 2000; // 2 hours in milliseconds

export interface DraftStateProps {
  draftStarted: boolean;
  activePhase: "banPhase1" | "pickPhase1" | "banPhase2" | "pickPhase2" | "finished" | "fix" | null;
  phaseType: "pick" | "ban" | null;
  tournamentID: string | null;
  lobbyCode: string;
  blueUser: string;
  redUser: string;
  blueDisplayName: string;
  redDisplayName: string;
  blueReady: boolean;
  redReady: boolean;
  timer: number;
  bansArray: string[];
  picksArray: string[];
  bluePicks: string[];
  redPicks: string[];
  blueBans: string[];
  redBans: string[];
  banIndex: number;
  pickIndex: number;
  currentTurn: string;
  currentBluePick: number;
  currentRedPick: number;
  currentBlueBan: number;
  currentRedBan: number;
  displayTurn: "red" | "blue" | null;
  currentHover: string | null;
  bluePick: string | null;
  redPick: string | null;
  draftComplete: boolean;
  fearlessCode?: string;
  addedPhases: string[];
}
export const draftState: Record<string, DraftStateProps> = {};

export interface DraftInitializeProps {
  lobbyCode: string;
  blueUser: string;
  redUser: string;
  blueDisplayName: string;
  redDisplayName: string;
  tournamentID: string | null;
  fearlessCode?: string;
}

export interface HandlerVarsProps {
  io: Namespace;
  lobbyCode: string;
  state: DraftStateProps;
  emitter: EventEmitter;
}

export interface ClientDraftStateProps {
  draftStarted: boolean;
  activePhase:
    | "banPhase1"
    | "pickPhase1"
    | "banPhase2"
    | "pickPhase2"
    | "finished"
    | "fix"
    | null
    | undefined;
  phaseType: "pick" | "ban" | null;
  blueDisplayName: string;
  redDisplayName: string;
  blueReady: boolean;
  redReady: boolean;
  timer: number;
  bansArray: string[];
  picksArray: string[];
  bluePicks: string[];
  redPicks: string[];
  blueBans: string[];
  redBans: string[];
  banIndex: number;
  pickIndex: number;
  currentTurn: string;
  currentBluePick: number;
  currentRedPick: number;
  currentBlueBan: number;
  currentRedBan: number;
  displayTurn: "red" | "blue" | null;
  currentHover: string | null;
  bluePick: string | null;
  redPick: string | null;
  draftComplete: boolean;
  fearlessCode?: string;
}
export const initializeDraftState = ({
  lobbyCode,
  blueUser,
  redUser,
  blueDisplayName,
  redDisplayName,
  tournamentID,
}: DraftInitializeProps) => {
  if (!draftState[lobbyCode]) {
    draftState[lobbyCode] = {
      draftStarted: false,
      activePhase: null,
      phaseType: null,
      tournamentID: tournamentID,
      lobbyCode: lobbyCode,
      blueUser: blueUser,
      redUser: redUser,
      blueDisplayName: blueDisplayName,
      redDisplayName: redDisplayName,
      blueReady: false,
      redReady: false,
      timer: 34,
      bansArray: [],
      picksArray: [],
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
      fearlessCode: undefined,
      addedPhases: [],
    };

    setTimeout(() => {
      if (draftState[lobbyCode]) {
        delete draftState[lobbyCode];
        console.log(`Draft state for lobby ${lobbyCode} deleted`);
      }
    }, twoHours);
  }
};
