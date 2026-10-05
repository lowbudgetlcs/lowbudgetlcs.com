import requestFix, { respondToFix } from "./requestFix";
import { Namespace, Socket } from "socket.io";
import { DraftStateProps } from "../../models/draftState";
import findSourceForChampion from "../../services/findSourceForChampion";
import { getChampionList } from "../../../../db/queries/select";
import { fixProps } from "../../types/draftInterfaces";

interface RequestDataProps {
  sideCode: string;
  sourceChampion: string;
  replacementChampion: string;
  lobbyCode: string;
}

// Handles fix requests and lets only the opposing side resolve each pending request.
const handleFixes = async (socket: Socket, io: Namespace, getDraftState: (lobbyCode: string) => DraftStateProps | null) => {
  const championList = await getChampionList();

  socket.on("fixRequest", (data: RequestDataProps) => {
    const currentDraftState = getDraftState(data.lobbyCode);

    if (!currentDraftState || !championList) {
      console.error("Draft state or champion list not found for lobby when requesting fix: ", data.lobbyCode);
      return;
    }

    if (data.sideCode !== currentDraftState.blueUser && data.sideCode !== currentDraftState.redUser) {
      console.error("Invalid side code received when requesting fix: ", data.lobbyCode);
      return;
    }

    if (!championList.find((champion) => champion.name === data.replacementChampion)) {
      console.error("Replacement champion not found in champion list: ", data.replacementChampion);
      return;
    }

    if (!championList.find((champion) => champion.name === data.sourceChampion)) {
      console.error("Source champion not found in champion list: ", data.sourceChampion);
      return;
    }

    const source = findSourceForChampion(currentDraftState, data.sourceChampion);
    if (!source) {
      console.error("Source champion is not in the draft state: ", data.sourceChampion);
      return;
    }

    if (data.sideCode === currentDraftState.redUser && !currentDraftState.redChampionReplacementRequest) {
      currentDraftState.redChampionReplacementRequest = {
        replacementChampion: {
          source: findSourceForChampion(currentDraftState, data.replacementChampion),
          champion: data.replacementChampion,
        },
        championToReplace: {
          source,
          champion: data.sourceChampion,
        },
      };

      requestFix({
        lobbyCode: data.lobbyCode,
        io,
        currentDraftState,
        sideRequesting: data.sideCode,
      });
    } else if (data.sideCode === currentDraftState.blueUser && !currentDraftState.blueChampionReplacementRequest) {
      currentDraftState.blueChampionReplacementRequest = {
        replacementChampion: { source: findSourceForChampion(currentDraftState, data.replacementChampion), champion: data.replacementChampion },
        championToReplace: { source, champion: data.sourceChampion },
      };

      requestFix({
        lobbyCode: data.lobbyCode,
        io,
        currentDraftState,
        sideRequesting: data.sideCode,
      });
    }
  });

  socket.on("fixResponse", (response: fixProps) => {
    respondToFix(response);
  });
};

export default handleFixes;
