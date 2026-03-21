import { fearlessState } from "../initializers/fearlessLobbyInitializer";
import {
  FearlessStateClientProps,
  FearlessStateServerProps,
} from "../interfaces/initializerInferfaces";

export const setFearlessClientState = (state: FearlessStateServerProps) => {
  const clientState: FearlessStateClientProps = {
    fearlessCode: state.fearlessCode,
    fearlessComplete: state.fearlessComplete,
    team1Name: state.team1Name,
    team2Name: state.team2Name,
    draftCount: state.draftCount,
    completedDrafts: state.completedDrafts,
    currentDraft: state.currentDraft,
    currentBlueSide: state.currentBlueSide,
    currentRedSide: state.currentRedSide,
    allPicks: state.allPicks,
    allBans: state.allBans,
    draftLobbyCodes: state.draftLobbyCodes,
    team1Picks: state.team1Picks,
    team2Picks: state.team2Picks,
    team1Bans: state.team1Bans,
    team2Bans: state.team2Bans,
  };
  return clientState;
};

export const updateFearlessClientState = (fearlessCode: string) => {
  const state = fearlessState[fearlessCode];
  if (!state) return;
  // Convert the full state into the trimmed client version
  const clientState = setFearlessClientState(state);
  return clientState;
};
