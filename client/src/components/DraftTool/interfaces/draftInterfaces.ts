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