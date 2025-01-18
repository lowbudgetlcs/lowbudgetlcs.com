import { Socket } from "socket.io-client";

export interface DraftCodeProps {
  draft: {
    lobbyCode: string;
    blueCode: string;
    redCode: string;
  };
}
export interface TournamentIDCheckProps {
  valid: boolean;
}

// Handles connecting to draft
export function connectionHandler(
  lobbyCode: string | undefined,
  sideCode: string | undefined,
  socket: Socket
) {
  // Error handling
  // Initial connection
  console.log("Client sent lobbyCode:", lobbyCode);
  socket.emit("joinDraft", { lobbyCode, sideCode });
  console.log("socket.id: ", socket.id);
  socket.on("error", (err) => {
    console.error("Socket Error: ", err.message);
    alert(err.message);
  });

  socket.on("joinedDraft", ({ sideCode, lobbyCode }) => {
    console.log("joined Draft: ", sideCode, lobbyCode);
  });

  socket.on("blueReady", (ready) => {
    if (ready) {
      console.log("Blue is Ready");
    } else {
      console.log("Blue is Not Ready");
    }
  });
  socket.on("redReady", (ready) => {
    if (ready) {
      console.log("Red is Ready");
    } else {
      console.log("Red is Not Ready");
    }
  });
}

export const readyHandler = (
  lobbyCode: string | undefined,
  sideCode: string | undefined,
  ready: boolean,
  socket: Socket | null
) => {
  // Error handling
  if (!socket) {
    console.error("No socket Found!");
    return;
  }
  console.log("Emitting: ", sideCode);
  socket.emit("ready", { lobbyCode, sideCode, ready });
};

export const pickHandler = (
  lobbyCode: string | undefined,
  sideCode: string | undefined,
  chosenChamp: string,
  socket: Socket | null
) => {

  // Error handling
  if (!socket) {
    console.error("No socket Found!");
    return;
  }
  // Send ban to server
  console.log("Emitting ban:", { sideCode, chosenChamp });
  socket.emit("ban", { lobbyCode, sideCode, chosenChamp });
};

// Checks if input tournament code is valid
export const checkTournamentCode = async (code: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/draft/api/checkTournamentCode/${code}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TournamentIDCheckProps = await response.json();
    if (data.valid) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error in Checking Tournament ID: ", err);
  }
};

export const createDraftDBEntry = async (
  blueName: FormDataEntryValue,
  redName: FormDataEntryValue,
  tournamentID: FormDataEntryValue | null
) => {
  try {
    const data = {
      blueName: blueName,
      redName: redName,
      tournamentID: tournamentID,
    };

    console.log(data);

    // Create the Draft lobby
    const response = await fetch(
      "http://localhost:8080/draft/api/createLobby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }
    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Error in Creating Draft DB Entry: ", err);
  }
};
