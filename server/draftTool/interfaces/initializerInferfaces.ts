export interface FearlessInitializerProps {
  fearlessCode: string;
  team1Code: string;
  team2Code: string;
  team1Name: string;
  team2Name: string;
  draftCount: number;
}

export interface FearlessFinishedProps {
  fearlessCode: string;
  fearlessComplete: boolean;
  team1Code: string;
  team2Code: string;
  team1Name: string;
  team2Name: string;
  draftCount: number;
}

// Holds the server's version of fearless state
// Includes the codes for each side
export interface FearlessStateServerProps {
  fearlessCode: string;
  fearlessComplete: boolean;
  team1Code: string;
  team2Code: string;
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

export interface FearlessStateClientProps {
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
export interface DraftInitializerProps {
  lobbyCode: string;
  blueUser: string;
  redUser: string;
  blueDisplayName: string;
  redDisplayName: string;
  tournamentID: string | null;
  fearlessCode?: string;
}
