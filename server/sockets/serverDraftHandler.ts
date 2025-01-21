
export interface DraftStateProps {
  draftStarted: boolean;
  activePhase: "banPhase1" | "pickPhase1" | "banPhase2" | "pickPhase2" | null;
  phaseType: "pick" | "ban" | null;
  blueUser: string;
  redUser: string;
  blueReady: boolean;
  redReady: boolean;
  timer: number;
  bansArray: string[];
  picksArray: string[];
  banIndex: number;
  pickIndex: number;
  currentTurn: string;
  bluePick: string | null;
  redPick: string | null;
}
export const draftState: Record<string, DraftStateProps> = {};

export const initializeDraftState = (
  lobbyCode: string,
  blueUser: string,
  redUser: string
) => {
  if (!draftState[lobbyCode]) {
    draftState[lobbyCode] = {
      draftStarted: false,
      activePhase: null,
      phaseType: null,
      blueUser: blueUser,
      redUser: redUser,
      blueReady: false,
      redReady: false,
      timer: 34,
      bansArray: [],
      picksArray: [],
      banIndex: 0,
      pickIndex: 0,
      currentTurn: '',
      bluePick: null,
      redPick: null,
    };
    console.log(`Draft state initialized for lobby with code: ${lobbyCode}`);
  }
};
