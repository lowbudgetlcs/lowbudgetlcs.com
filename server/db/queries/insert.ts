
import { DraftInitializeProps } from "../../sockets/draftState";
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
