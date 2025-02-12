import { Socket } from "socket.io-client";
import { DraftProps } from "./draftInterfaces";

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
  socket: Socket,
  lobbyCode: string | undefined,
  sideCode: string | undefined,
  setDraftState: React.Dispatch<React.SetStateAction<DraftProps>>,
  setPlayerSide: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>
) {
  // Initial connection
  console.log("Client sent lobbyCode:", lobbyCode);
  socket.emit("joinDraft", { lobbyCode, sideCode });

  // Error handling
  socket.on("error", (err) => {
    console.error("Socket Error: ", err.message);
    setError(true);
  });

  // Sets the side for client
  const joinDraft = ({
    sideCode,
    lobbyCode,
    sideDisplay,
  }: {
    sideCode: string;
    lobbyCode: string;
    sideDisplay: string;
  }) => {
    console.log("joined Draft: ", sideCode, lobbyCode);
    setPlayerSide(sideDisplay);
  };

  socket.once("joinedDraft", joinDraft);

  const showReady = (state: DraftProps) => {
    setDraftState((prevState) => ({
      ...prevState,
      ...state,
    }));
  };
  socket.on("blueReady", showReady);
  socket.on("redReady", showReady);
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
  socket: Socket | null,
  banPhase: boolean,
  pickPhase: boolean
) => {
  // Error handling
  if (!socket) {
    console.error("No socket Found!");
    return;
  }

  if (banPhase) {
    // Send ban to server
    console.log("Emitting ban:", { sideCode, chosenChamp });
    socket.emit("ban", { lobbyCode, sideCode, chosenChamp });
  }

  if (pickPhase) {
    // Send pick to server
    console.log("Emitting pick:", { sideCode, chosenChamp });
    socket.emit("pick", { lobbyCode, sideCode, chosenChamp });
  }
};

// Checks if input tournament code is valid
export const checkTournamentCode = async (code: string) => {
  try {
    const encodedCode = encodeURIComponent(code);
    const response = await fetch(
      `http://localhost:8080/draft/api/checkTournamentCode/${encodedCode}`
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
