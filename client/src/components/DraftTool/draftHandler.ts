import { io } from "socket.io-client";
const socket = io("http://localhost:8070");

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
export function connectionHandler(connectURL: string | undefined) {
  socket.on("connect", () => {
    socket.on("welcome", (msg) => {
      console.log("Server: ", msg);
    });
    if (connectURL) {
      socket.emit("code", connectURL);
    }
    socket.on("goodMessage", (msg) => {
      console.log(msg);
    });
  });
}

export const checkTournamentCode = async (code: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/draft/checkTournamentCode/${code}`
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
      "http://localhost:8080/api/draft/createLobby",
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
