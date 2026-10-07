import { HandlerVarsProps } from "../../models/draftState";
import { updateClientState } from "../../models/clientDraftState";

const fixPhaseHandler = async ({ io, lobbyCode, state, emitter }: HandlerVarsProps) => {
  while (state.activePhase !== "finished") {
    let fixPhaseStarted: boolean = false;
    let currentChampToFix: string | null = null;
    let currentPickedChampion: string | null = null;

    // Starts the fix phase when a side identifies a champion to fix
    const startFixPhase = (side: string, champToFix: string, pickedChampion: string) => {
      if (!fixPhaseStarted || !currentChampToFix || !currentPickedChampion || (side !== state.blueUser && side !== state.redUser)) {
        fixPhaseStarted = true;
        currentChampToFix = champToFix;
        currentPickedChampion = pickedChampion;
        io.to(lobbyCode).emit("startFixPhase", { side, champToFix, pickedChampion });
      }
    };

    // Ends the phase if opposite side gives input
    const endFixPhase = (side: string, response: boolean) => {
      if (fixPhaseStarted && currentChampToFix && currentPickedChampion && (side === state.blueUser || side === state.redUser)) {
        findAndReplaceChampion(currentChampToFix, currentPickedChampion);

        fixPhaseStarted = false;
        currentChampToFix = null;
        currentPickedChampion = null;
        io.to(lobbyCode).emit("endFixPhase");
      }
    };

    const findAndReplaceChampion = (champToFix: string, pickedChampion: string) => {
      const inBluePicks = state.bluePicks.includes(champToFix);
      const inRedPicks = state.redPicks.includes(champToFix);
      const inBlueBans = state.blueBans.includes(champToFix);
      const inRedBans = state.redBans.includes(champToFix);

      // Find and replace the champion in the appropriate array
      switch (true) {
        case inBluePicks:
          state.bluePicks = state.bluePicks.map((champ) => (champ === champToFix ? pickedChampion : champ));
          state.picksArray = state.picksArray.map((champ) => (champ === champToFix ? pickedChampion : champ));
          break;
        case inRedPicks:
          state.redPicks = state.redPicks.map((champ) => (champ === champToFix ? pickedChampion : champ));
          state.picksArray = state.picksArray.map((champ) => (champ === champToFix ? pickedChampion : champ));
          break;
        case inBlueBans:
          state.blueBans = state.blueBans.map((champ) => (champ === champToFix ? pickedChampion : champ));
          state.bansArray = state.bansArray.map((champ) => (champ === champToFix ? pickedChampion : champ));
          break;
        case inRedBans:
          state.redBans = state.redBans.map((champ) => (champ === champToFix ? pickedChampion : champ));
          state.bansArray = state.bansArray.map((champ) => (champ === champToFix ? pickedChampion : champ));
          break;
      }
    };
    emitter.on("startFixPhase", startFixPhase);
    emitter.on("endFixPhase", endFixPhase);
  }
};

export default fixPhaseHandler;
