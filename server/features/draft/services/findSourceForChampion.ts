import { DraftStateProps } from "../models/draftState";

const findSourceForChampion = (draftState: DraftStateProps, champion: string) => {
  // Checks if champions are in the pick or ban array
  const championInPicks = draftState.picksArray.find((pick) => pick === champion) ? true : false;
  const championInBans = draftState.bansArray.find((ban) => ban === champion) ? true : false;

  //   Checks if champions are in specifically blue or red picks/bans based on above check
  //   TODO: Consider just checking all of the picks and bans since it's only 1 less find operation
  if (championInPicks) {
    const championInRedPicks = draftState.redPicks.find((pick) => pick === champion) ? true : false;
    const championInBluePicks = draftState.bluePicks.find((pick) => pick === champion) ? true : false;
    if (championInRedPicks) {
      return "redPicks";
    } else if (championInBluePicks) {
      return "bluePicks";
    }
  } else if (championInBans) {
    const championInRedBans = draftState.redBans.find((ban) => ban === champion) ? true : false;
    const championInBlueBans = draftState.blueBans.find((ban) => ban === champion) ? true : false;
    if (championInRedBans) {
      return "redBans";
    } else if (championInBlueBans) {
      return "blueBans";
    }
  }

  //   Checks if somehow the champion is not found but within picks and bans
  //   This should NEVER happen smile :D
  if (championInPicks || championInBans) {
    console.error(
      `Champion ${champion} found in ${championInPicks ? "picks" : "bans"} but source could not be determined in lobby code: ${draftState.lobbyCode}.`,
    );
  }
  return null;
};

export default findSourceForChampion;
