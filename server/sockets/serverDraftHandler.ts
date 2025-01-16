
export interface DraftStateProps {
  draftStarted: boolean;
  banPhase1Started: boolean;
  banPhase2Started: boolean;
  pickPhase1Started: boolean;
  pickPhase2Started: boolean;
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
      banPhase1Started: false,
      banPhase2Started: false,
      pickPhase1Started: false,
      pickPhase2Started: false,
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
    };
    console.log(`Draft state initialized for lobby with code: ${lobbyCode}`);
  }
};
