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
  socket.emit("joinDraft", { lobbyCode, sideCode });

  // Error handling
  socket.on("error", () => {
    setError(true);
  });

  // Sets the side for client
  const joinDraft = ({
    sideDisplay,
  }: {
    sideCode: string;
    lobbyCode: string;
    sideDisplay: string;
  }) => {
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
    socket.emit("ban", { lobbyCode, sideCode, chosenChamp });
  }

  if (pickPhase) {
    // Send pick to server
    socket.emit("pick", { lobbyCode, sideCode, chosenChamp });
  }
};

// Checks if input tournament code is valid
export const checkTournamentCode = async (code: string) => {
  const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
  try {
    const encodedCode = encodeURIComponent(code);
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/draft/api/checkTournamentCode/${encodedCode}`, {
        headers: {
          "x-api-key": apiKey,
        },
      }
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
