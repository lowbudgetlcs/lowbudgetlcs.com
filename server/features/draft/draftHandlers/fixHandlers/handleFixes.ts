import { requestFixProps } from "../../types/draftInterfaces";
import requestFix from "./requestFix";
import { Namespace } from "socket.io";
import { DraftStateProps } from "../../models/draftState";

// Handles fix requests AND responses from both sides and keeps track of which side has requested a fix.
// If a fix request is open for one side, this should not allow another one come in from the same side.
// Does use sideCode validation but scrubs that from the response before emitting it to the opposing side.
const handleFixes = async (io: Namespace, getDraftState: (lobbyCode: string) => DraftStateProps | null) => {
  let didRedRequestFix = false;
  let didBlueRequestFix = false;

  io.on("fixRequest", async (data: requestFixProps) => {

    const currentDraftState = getDraftState(data.lobbyCode);

    // This should never get hit
    if (!currentDraftState) {
      console.error("Draft state not found for lobby when requesting fix: ", data.lobbyCode);
      return;
    }

    // Checks if red side is requesting a fix and there isn't one pending
    if (data.sideRequesting === currentDraftState.redUser && !didRedRequestFix) {
      didRedRequestFix = true;

      const response = await requestFix({ ...data, io });

      //   Changes sideRequesting to "red" instead of the sideCode
      //   Emits answer from opposing side
      response.sideRequesting = "red";
      io.to(data.lobbyCode).emit("fixResponse", response);
      didRedRequestFix = false;

      //   Checks if blue side is requesting a fix and there isn't one pending
    } else if (data.sideRequesting === currentDraftState.blueUser && !didBlueRequestFix) {
      didBlueRequestFix = true;

      const response = await requestFix({ ...data, io });

      //   Changes sideRequesting to "blue" instead of the sideCode
      //   Emits answer from opposing side
      response.sideRequesting = "blue";
      io.to(data.lobbyCode).emit("fixResponse", response);
      didBlueRequestFix = false;
    }
  });
};

export default handleFixes;
