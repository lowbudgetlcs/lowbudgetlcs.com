import fs from "fs";
import path from "path";
import { Server } from "socket.io";
import { DraftProps } from "./server";

export interface DraftUsers {
  blue: string | null;
  red: string | null;
}

export async function checkLiveDraftsForRole(teamCode: string) {
  try {
    const data = await fs.promises.readFile("../draft/draft.json", "utf-8");
    const draft: DraftProps = JSON.parse(data);
    console.log("File content:", data);

    // Check the role based on the team code
    if (teamCode === draft.lobbyCode) {
      return "spectator";
    } else if (teamCode === draft.blueCode) {
      return "blue";
    } else if (teamCode === draft.redCode) {
      return "red";
    } else {
      console.log("No match for codes");
      return undefined;
    }
  } catch (err) {
    console.error("Error reading file:", err);
    return undefined;
  }
}

export const draftHandler = (draft: DraftUsers, io: Server, lobbyCode: string) => {
  let blueReady = false;
  let redReady = false;
  let timer = 34;
  let shownTimer = timer - 4;

  const redUser = draft.red;
  const blueUser = draft.blue;
  let currentTurn: string;

  // Ready Up Draft
  io.on('ready', ({user, ready}) => {
    if(user === redUser) {
      if ( ready === true) {
        io.to(lobbyCode).emit('redReady', true)
      } else if(ready === false) {
        io.to(lobbyCode).emit('redReady', false)
      }

    }
  })
};
