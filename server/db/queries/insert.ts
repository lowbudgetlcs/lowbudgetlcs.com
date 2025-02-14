import { eq } from "drizzle-orm";
import {
  DraftInitializeProps,
  DraftStateProps,
} from "../../sockets/draftState";
import { db } from "../index";
import { draftLobbies } from "../schema";

export async function insertDraft(draft: DraftInitializeProps) {
  try {
    const insertDraft = await db
      .insert(draftLobbies)
      .values({
        lobbyCode: draft.lobbyCode,
        blueCode: draft.blueUser,
        redCode: draft.redUser,
        shortcode: draft.tournamentID,
        blueName: draft.blueDisplayName,
        redName: draft.redDisplayName,
      })
      .returning();

    console.log("Draft inserted successfully:", insertDraft);
  } catch (err) {
    console.error("Error inserting into DB: ", err);
    throw new Error("Failed to insert draft into database.");
  }
}

export async function insertFinishedDraft(
  draft: DraftStateProps,
  lobbyCode: string
) {
  try {
    const insertDraft = await db
      .update(draftLobbies)
      .set({
        shortcode: draft.tournamentID,
        blueCode: draft.blueUser,
        redCode: draft.redUser,
        lobbyCode: lobbyCode,
        blueName: draft.blueDisplayName,
        redName: draft.redDisplayName,
        bPick1: draft.bluePicks[0],
        bPick2: draft.bluePicks[1],
        bPick3: draft.bluePicks[2],
        bPick4: draft.bluePicks[3],
        bPick5: draft.bluePicks[4],
        rPick1: draft.redPicks[0],
        rPick2: draft.redPicks[1],
        rPick3: draft.redPicks[2],
        rPick4: draft.redPicks[3],
        rPick5: draft.redPicks[4],
        bBan1: draft.blueBans[0],
        bBan2: draft.blueBans[1],
        bBan3: draft.blueBans[2],
        bBan4: draft.blueBans[3],
        bBan5: draft.blueBans[4],
        rBan1: draft.redBans[0],
        rBan2: draft.redBans[1],
        rBan3: draft.redBans[2],
        rBan4: draft.redBans[3],
        rBan5: draft.redBans[4],
      })
      .where(eq(draftLobbies.lobbyCode, lobbyCode));

    console.log("Draft inserted successfully:", insertDraft);
  } catch (err) {
    console.error("Error inserting into DB: ", err);
    throw new Error("Failed to insert draft into database.");
  }
}
