import {
  ClientDraftStateProps,
  draftState,
  DraftStateProps,
} from "./draftState";

export const setClientDraftState = (state: DraftStateProps) => {
  const clientState: ClientDraftStateProps = {
    draftStarted: state.draftStarted,
    activePhase: state.activePhase,
    phaseType: state.phaseType,
    blueDisplayName: state.blueDisplayName,
    redDisplayName: state.redDisplayName,
    blueReady: state.blueReady,
    redReady: state.redReady,
    timer: state.timer,
    bansArray: state.bansArray,
    picksArray: state.picksArray,
    bluePicks: state.bluePicks,
    redPicks: state.redPicks,
    blueBans: state.blueBans,
    redBans: state.redBans,
    banIndex: state.banIndex,
    pickIndex: state.pickIndex,
    currentTurn: state.currentTurn,
    currentBluePick: state.currentBluePick,
    currentRedPick: state.currentRedPick,
    currentBlueBan: state.currentBlueBan,
    currentRedBan: state.currentRedBan,
    displayTurn: state.displayTurn,
    currentHover: state.currentHover,
    bluePick: state.bluePick,
    redPick: state.redPick,
    draftComplete: state.draftComplete,
  };
  return clientState;
};

export const updateClientState = (lobbyCode: string) => {
  const state = draftState[lobbyCode];
  if (!state) return;
  // Convert the full state into the trimmed client version
  const clientState = setClientDraftState(state);
  return clientState;
};
