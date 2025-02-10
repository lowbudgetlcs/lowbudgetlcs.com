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
  blueUser: string;
  redUser: string;
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
  bluePick: string | null;
  redPick: string | null;
}

export interface BanProps {
  side: "blue" | "red";
  bannedChampion: string;
}

export interface PickProps {
  side: "blue" | "red";
  pickedChampion: string;
}
