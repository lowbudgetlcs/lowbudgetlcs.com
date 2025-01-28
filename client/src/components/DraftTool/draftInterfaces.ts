export interface Champion {
    name: string;
    roles: string[];
  }
  
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
  