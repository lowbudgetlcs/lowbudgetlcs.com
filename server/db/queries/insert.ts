import { DraftProps } from "../../routes/draftRoutes";
import { db } from "../index";
import { draftLobbies } from "../schema";

export async function insertDraft(draft: DraftProps) {
  try {
    const insertDraft = await db
      .insert(draftLobbies)
      .values({
        lobbycode: draft.lobbyCode,
        bluecode: draft.blueCode,
        redcode: draft.redCode,
        shortcode: draft.tournamentID,
        bluename: draft.blueName,
        redname: draft.redName,
      })
      .returning();

      console.log("Draft inserted successfully:", insertDraft);
  } catch (err) {
    console.error("Error inserting into DB: ", err);
    throw new Error("Failed to insert draft into database.");
  }
}
