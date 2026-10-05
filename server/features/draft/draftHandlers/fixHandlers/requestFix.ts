import { Namespace } from "socket.io";
import { fixProps } from "../../types/draftInterfaces";
import { ClientDraftStateProps, DraftStateProps, ReplacementChampProps } from "../../models/draftState";

interface RequestFixProps {
  io: Namespace;
  lobbyCode: string;
  currentDraftState: DraftStateProps;
  sideRequesting: string;
}

interface PendingFixProps {
  io: Namespace;
  lobbyCode: string;
  currentDraftState: DraftStateProps;
  sideRequesting: string;
  sideResponding: string;
  replacementRequest: ReplacementChampProps;
  timeout: NodeJS.Timeout;
}

interface FixResponsePayload {
  currentDraftState: ClientDraftStateProps;
  response: {
    status: boolean;
    requestingSide: "blue" | "red";
    sourceChampion: string;
    replacementChampion: string;
  };
}

const pendingFixes = new Map<string, PendingFixProps>();

const getFixKey = (lobbyCode: string, sideRequesting: string) => `${lobbyCode}:${sideRequesting}`;

const toClientDraftState = (state: DraftStateProps): ClientDraftStateProps => {
  const { blueUser, redUser, lobbyCode, tournamentID, ...clientState } = state;
  return clientState;
};

const swapChampions = (currentDraftState: DraftStateProps, replacementRequest: ReplacementChampProps) => {
  const { champion: oldChampion, source: oldSource } = replacementRequest.championToReplace;
  const { champion: newChampion, source: newSource } = replacementRequest.replacementChampion;
  const indexForOldChampion = oldSource === null ? null : currentDraftState[oldSource].indexOf(oldChampion);
  const indexForNewChampion = newSource === null ? null : currentDraftState[newSource].indexOf(newChampion);
  const oldDraftArray = oldSource?.includes("Picks") ? "picksArray" : "bansArray";
  const newDraftArray = newSource?.includes("Picks") ? "picksArray" : "bansArray";
  const oldDraftIndex = oldSource === null ? null : currentDraftState[oldDraftArray].indexOf(oldChampion);
  const newDraftIndex = newSource === null ? null : currentDraftState[newDraftArray].indexOf(newChampion);

  if (
    oldSource !== null &&
    indexForOldChampion !== null &&
    indexForOldChampion !== -1 &&
    oldDraftIndex !== null &&
    oldDraftIndex !== -1 &&
    (newSource === null || (indexForNewChampion !== -1 && newDraftIndex !== -1))
  ) {
    currentDraftState[oldSource][indexForOldChampion] = newChampion;
    currentDraftState[oldDraftArray][oldDraftIndex] = newChampion;
    if (newSource !== null && indexForNewChampion !== null && newDraftIndex !== null) {
      currentDraftState[newSource][indexForNewChampion] = oldChampion;
      currentDraftState[newDraftArray][newDraftIndex] = oldChampion;
    }
  }
};

const finishFix = (pendingFix: PendingFixProps, status: boolean) => {
  const { currentDraftState, lobbyCode, sideRequesting, replacementRequest } = pendingFix;
  const key = getFixKey(lobbyCode, sideRequesting);

  if (!pendingFixes.delete(key)) {
    return;
  }

  clearTimeout(pendingFix.timeout);
  if (status) {
    swapChampions(currentDraftState, replacementRequest);
  }

  const requestingSide = sideRequesting === currentDraftState.blueUser ? "blue" : "red";
  if (requestingSide === "blue") {
    currentDraftState.blueTimeToFix = null;
    currentDraftState.blueChampionReplacementRequest = null;
  } else {
    currentDraftState.redTimeToFix = null;
    currentDraftState.redChampionReplacementRequest = null;
  }

  const payload: FixResponsePayload = {
    currentDraftState: toClientDraftState(currentDraftState),
    response: {
      status,
      requestingSide,
      sourceChampion: replacementRequest.championToReplace.champion,
      replacementChampion: replacementRequest.replacementChampion.champion,
    },
  };
  pendingFix.io.to(lobbyCode).emit("fixResponse", payload);
};

// Starts a 30-second fix request that only the opposing side may resolve.
const requestFix = ({ io, lobbyCode, currentDraftState, sideRequesting }: RequestFixProps) => {
  const key = getFixKey(lobbyCode, sideRequesting);
  if (pendingFixes.has(key)) {
    return false;
  }

  const replacementRequest =
    sideRequesting === currentDraftState.blueUser
      ? currentDraftState.blueChampionReplacementRequest
      : currentDraftState.redChampionReplacementRequest;

  if (!replacementRequest) {
    return false;
  }

  const phaseEndsAt = Date.now() + 30000; // 30 seconds from now

  if (sideRequesting === currentDraftState.blueUser) {
    currentDraftState.blueTimeToFix = phaseEndsAt;
  } else if (sideRequesting === currentDraftState.redUser) {
    currentDraftState.redTimeToFix = phaseEndsAt;
  }
  const pendingFix: PendingFixProps = {
    io,
    lobbyCode,
    currentDraftState,
    sideRequesting,
    sideResponding: sideRequesting === currentDraftState.blueUser ? currentDraftState.redUser : currentDraftState.blueUser,
    replacementRequest,
    timeout: setTimeout(() => finishFix(pendingFix, false), Math.max(0, phaseEndsAt - Date.now())),
  };

  pendingFixes.set(key, pendingFix);
  io.to(lobbyCode).emit("requestFix", toClientDraftState(currentDraftState));
  return true;
};

export const respondToFix = (response: fixProps) => {
  const pendingFix = [...pendingFixes.values()].find(
    (pending) => pending.lobbyCode === response.lobbyCode && pending.sideResponding === response.sideCode,
  );

  if (pendingFix) {
    finishFix(pendingFix, response.status);
  }
};

export default requestFix;
