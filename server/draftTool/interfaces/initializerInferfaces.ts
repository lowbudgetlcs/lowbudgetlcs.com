export interface FearlessInitializerProps {
  fearlessCode: string;
  team1Code: string;
  team2Code: string;
  team1Name: string;
  team2Name: string;
  draftCount: number;
  draftLobbyCodes: string[];
}

// Holds the server's version of fearless state
// Includes the codes for each side
export interface FearlessStateServerProps {
  fearlessCode: string;
  fearlessComplete: boolean;
  redCode: string;
  blueCode: string;
  blueDisplayName: string;
  redDisplayName: string;
  draftCount: number;
  completedDrafts: number;
  currentDraft: number | null;
  allPicks: string[];
  allBans: string[];
  draftLobbyCodes: string[];
  // draftLobbyCode1: string;
  // draftLobbyCode2: string | null;
  // draftLobbyCode3: string | null;
  // draftLobbyCode4: string | null;
  // draftLobbyCode5: string | null;
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
