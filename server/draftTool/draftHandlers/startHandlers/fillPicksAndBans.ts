import { getPastDraft } from "../../../db/queries/select";
import { fearlessState as serverFearlessState } from "../../initializers/fearlessLobbyInitializer";
import { FearlessStateClientProps } from "../../interfaces/initializerInferfaces";

const fillPicksAndBans = async (dbFearlessState: FearlessStateClientProps) => {
  const updatedFearlessState: FearlessStateClientProps = dbFearlessState;
  if (!serverFearlessState[dbFearlessState.fearlessCode]) {
    updatedFearlessState.fearlessComplete = true;
  }

  for (const lobbyCode of dbFearlessState.draftLobbyCodes) {
    const draft = await getPastDraft(lobbyCode);
    if (draft) {
      updatedFearlessState.bluePicks.push(
        ...draft.clientState.bluePicks.filter((pick) => pick !== "nothing"),
      );
      updatedFearlessState.redPicks.push(...draft.clientState.redPicks.filter((pick) => pick !== "nothing"));
      updatedFearlessState.blueBans.push(...draft.clientState.blueBans.filter((ban) => ban !== "nothing"));
      updatedFearlessState.redBans.push(...draft.clientState.redBans.filter((ban) => ban !== "nothing"));
    }
  }

  return updatedFearlessState;
};

export default fillPicksAndBans;
