import { Socket } from "socket.io-client";

export interface Champion {
  name: string;
  roles: string[];
  displayName: string;
}

export interface DraftStateProps {
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
  displayTurn: "red" | "blue" | null;
  bluePick: string;
  redPick: string;
  draftComplete: boolean;
}

export interface DraftDisplayProps {
  draftState: DraftProps;
  lobbyCode: string;
  sideCode: string | undefined;
  socket: Socket;
  championRoles: Champion[];
  playerSide: string;
}

export interface DraftButtonProps {
  draftState: DraftProps;
  lobbyCode: string;
  sideCode: string | undefined;
  socket: Socket;
  championRoles: Champion[];
  playerSide: string;
  chosenChamp: string | undefined;
  setChosenChamp: React.Dispatch<React.SetStateAction<string | undefined>>;
}
export interface DraftProps {
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
  displayTurn: "red" | "blue" | null;
  currentHover: string | null;
  bluePick: string;
  redPick: string;
  draftComplete: boolean;
}
