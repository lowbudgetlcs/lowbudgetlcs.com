import EventEmitter from "events";
import { Server } from "socket.io";

const twoHours = 60 * 60 * 2000; // 2 hours in milliseconds

export interface DraftStateProps {
  draftStarted: boolean;
  activePhase:
    | "banPhase1"
    | "pickPhase1"
    | "banPhase2"
    | "pickPhase2"
    | "finished"
    | null;
  phaseType: "pick" | "ban" | null;
  tournamentID: string | null;
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
}
export const draftState: Record<string, DraftStateProps> = {};

export interface DraftInitializeProps {
  lobbyCode: string;
  blueUser: string;
  redUser: string;
  blueDisplayName: string;
  redDisplayName: string;
  tournamentID: string | null;
}

export interface HandlerVarsProps {
  io: Server;
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
    };

    setTimeout(() => {
      if (draftState[lobbyCode]) {
        delete draftState[lobbyCode];
        console.log(`Draft state for lobby ${lobbyCode} deleted`);
      }
    }, twoHours);
  }
};
