export interface Champion {
  name: string;
  roles: string[];
  displayName: string;
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
  currentBluePick: number;
  currentRedPick: number;
  currentBlueBan: number;
  currentRedBan: number;
  displayTurn: "red" | "blue" | null;
  currentHover: string | null;
  bluePick: string;
  redPick: string;
  draftComplete: boolean;
  fearlessCode: string | null;
}

export interface DraftExportObjectProps {
  blueName: string;
  bluePicks: string[];
  blueBans: string[];
  redName: string;
  redPicks: string[];
  redBans: string[];
}

export interface DraftLinkProps {
  lobbyCode: string;
  blueCode: string;
  redCode: string;
}

export interface FearlessInitializerProps {
  fearlessCode: string;
  team1Code: string;
  team2Code: string;
  team1Name: string;
  team2Name: string;
  draftCount: number;
}


export interface FearlessDraftLinkProps {
  fearlessCode: string;
  team1Code: string;
  team2Code: string;
  team1DisplayName: string;
  team2DisplayName: string;
}

export interface FearlessStateProps {
fearlessCode: string;
fearlessComplete: boolean;
team1Name: string;
team2Name: string;
draftCount: number;
completedDrafts: number;
currentDraft: string | null;
currentBlueSide: string | null;
currentRedSide: string | null;
allPicks: string[];
allBans: string[];
draftLobbyCodes: string[] | null;
}