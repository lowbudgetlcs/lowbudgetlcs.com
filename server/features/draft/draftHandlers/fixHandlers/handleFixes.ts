import requestFix from "./requestFix";
import { Socket } from "socket.io";
import { DraftStateProps } from "../../models/draftState";
import findSourceForChampion from "../../services/findSourceForChampion";
import { getChampionList } from "../../../../db/queries/select";

interface RequestDataProps {
  sideRequesting: string;
  sourceChampion: string;
  replacementChampion: string;
  lobbyCode: string;
}

// Handles fix requests AND responses from both sides and keeps track of which side has requested a fix.
// If a fix request is open for one side, this should not allow another one come in from the same side.
// Does use sideCode validation but scrubs that from the response before emitting it to the opposing side.
const handleFixes = async (socket: Socket, getDraftState: (lobbyCode: string) => DraftStateProps | null) => {
  let didRedRequestFix = false;
  let didBlueRequestFix = false;
  const championList = await getChampionList();

  socket.on("fixRequest", async (data: RequestDataProps) => {
    const currentDraftState = getDraftState(data.lobbyCode);

    // This should never get hit
    if (!currentDraftState || !championList) {
      console.error("Draft state or champion list not found for lobby when requesting fix: ", data.lobbyCode);
      return;
    }

    // This should also never get hit
    if (!championList.find((champion) => champion.name === data.replacementChampion)) {
      console.error("Replacement champion not found in champion list: ", data.replacementChampion);
      return;
    }

    // This should also ALSO never get hit
    if (!championList.find((champion) => champion.name === data.sourceChampion)) {
      console.error("Source champion not found in champion list: ", data.sourceChampion);
      return;
    }

    // Checks if red side is requesting a fix and there isn't one pending
    if (data.sideRequesting === currentDraftState.redUser && !didRedRequestFix) {
      didRedRequestFix = true;
      currentDraftState.redChampionReplacementRequest = {
        replacementChampion: {
          source: findSourceForChampion(currentDraftState, data.replacementChampion),
          champion: data.replacementChampion,
        },
        championToReplace: {
          source: findSourceForChampion(currentDraftState, data.sourceChampion),
          champion: data.sourceChampion,
        },
      };

      const response = await requestFix({
        lobbyCode: data.lobbyCode,
        socket,
        currentDraftState,
        sideRequesting: data.sideRequesting,
        sideCodeForResponse: currentDraftState.redUser,
      });

      //   Changes sideRequesting to "red" instead of the sideCode
      //   Emits answer from opposing side
      socket.to(data.lobbyCode).emit("fixResponse", { currentDraftState, response });
      didRedRequestFix = false;

      //   Checks if blue side is requesting a fix and there isn't one pending
    } else if (data.sideRequesting === currentDraftState.blueUser && !didBlueRequestFix) {
      didBlueRequestFix = true;
      currentDraftState.blueChampionReplacementRequest = {
        replacementChampion: { source: findSourceForChampion(currentDraftState, data.replacementChampion), champion: data.replacementChampion },
        championToReplace: { source: findSourceForChampion(currentDraftState, data.sourceChampion), champion: data.sourceChampion },
      };

      const response = await requestFix({
        lobbyCode: data.lobbyCode,
        socket,
        currentDraftState,
        sideRequesting: data.sideRequesting,
        sideCodeForResponse: currentDraftState.blueUser,
      });

      //   Changes sideRequesting to "blue" instead of the sideCode
      //   Emits answer from opposing side
      socket.to(data.lobbyCode).emit("fixResponse", { currentDraftState, response });
      didBlueRequestFix = false;
    }
  });
};

export default handleFixes;
