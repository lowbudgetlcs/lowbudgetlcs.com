import { Socket } from "socket.io";
import { fixProps } from "../../types/draftInterfaces";
import { DraftStateProps } from "../../models/draftState";

interface RequestFixProps {
  socket: Socket;
  lobbyCode: string;
  currentDraftState: DraftStateProps;
  sideRequesting: string;
  sideCodeForResponse: string;
}
// Sends a request to fix a champion pick and waits for the response from the other side.
const requestFix = async ({ socket, lobbyCode, currentDraftState, sideRequesting, sideCodeForResponse }: RequestFixProps) => {
  socket.to(lobbyCode).emit("requestFix", currentDraftState);

  // Returns the above & status: boolean (true if the fix was accepted, false otherwise)
  return new Promise<fixProps>((resolve) => {
    socket.on("fixResponse", (response: fixProps) => {
      if (response.sideResponding === sideCodeForResponse) {
        if (response.status) {
          // Validates that the side requesting the fix is either the red or blue user.
          if (response.sideResponding !== currentDraftState.redUser && response.sideResponding !== currentDraftState.blueUser) {
            return;
          }

          // Gets the replacement request for the side that is requesting the fix.
          const replacementRequest =
            sideRequesting === currentDraftState.blueUser
              ? currentDraftState.blueChampionReplacementRequest
              : currentDraftState.redChampionReplacementRequest;

          // If there is no replacement request, exit early.
          if (replacementRequest) {
            const { champion: oldChampion, source: oldSource } = replacementRequest.championToReplace;
            const { champion: newChampion, source: newSource } = replacementRequest.replacementChampion;

            // Determines the indices and arrays for the old and new champions.
            const indexForOldChampion = oldSource === null ? null : currentDraftState[oldSource].indexOf(oldChampion);
            const indexForNewChampion = newSource === null ? null : currentDraftState[newSource].indexOf(newChampion);
            const oldDraftArray = oldSource?.includes("Picks") ? "picksArray" : "bansArray";
            const newDraftArray = newSource?.includes("Picks") ? "picksArray" : "bansArray";
            const oldDraftIndex = oldSource === null ? null : currentDraftState[oldDraftArray].indexOf(oldChampion);
            const newDraftIndex = newSource === null ? null : currentDraftState[newDraftArray].indexOf(newChampion);

            // Swaps the old champion with the new champion in the draft state arrays.
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
          }
        }
        resolve(response);
      }
    });
  });
};

export default requestFix;
