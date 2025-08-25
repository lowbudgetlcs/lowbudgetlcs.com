import { eq } from "drizzle-orm";
import {
  DraftInitializeProps,
  DraftStateProps,
} from "../../draftTool/states/draftState";
import { db } from "../index";
import { draftLobbies, fearlessDraftLobbies } from "../schema";
import {
  FearlessFinishedProps,
  FearlessInitializerProps,
} from "../../draftTool/interfaces/initializerInferfaces";

export async function insertDraft(draft: DraftInitializeProps) {
  try {
    const insertDraft = await db
      .insert(draftLobbies)
      .values({
        lobbyCode: draft.lobbyCode,
        blueCode: draft.blueUser,
        redCode: draft.redUser,
        shortcode: draft.tournamentID,
        blueName: draft.blueUser,
        redName: draft.redUser,
        fearlessCode: draft.fearlessCode || null,
      })
      .returning();

    console.log("Draft initial insert success:", draft.lobbyCode);
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
        draftFinished: true,
      })
      .where(eq(draftLobbies.lobbyCode, lobbyCode));

    console.log("Draft full insert success:", lobbyCode);
  } catch (err) {
    console.error("Error inserting into DB: ", err);
    throw new Error("Failed to insert draft into database.");
  }
}

export async function insertInitialFearlessLobby(
  draft: FearlessInitializerProps
) {
  try {
    const insertFearlessLobby = await db
      .insert(fearlessDraftLobbies)
      .values({
        fearlessCode: draft.fearlessCode,
        team1Code: draft.team1Code,
        team2Code: draft.team2Code,
        team1Name: draft.team1Name,
        team2Name: draft.team2Name,
        totalDrafts: draft.draftCount,
      })
      .returning();

    console.log("Fearless initial insert success:", draft.fearlessCode);
  } catch (err) {
    console.error("Error inserting into DB: ", err);
    throw new Error("Failed to insert draft into database.");
  }
}

export async function insertFinalFearlessLobby(draft: FearlessFinishedProps) {
  try {
    const insertFearlessLobby = await db
      .update(fearlessDraftLobbies)
      .set({
        fearlessComplete: true,
      })
      .where(eq(fearlessDraftLobbies.fearlessCode, draft.fearlessCode));

    console.log("Fearless Final insert success:", draft.fearlessCode);
  } catch (err) {
    console.error("Error inserting into DB: ", err);
    throw new Error("Failed to insert draft into database.");
  }
}
