import { DraftProps } from "./draftInterfaces";

export interface PastLobbyProps {
  isValid: boolean;
  draftState: DraftProps | undefined;
}

// Checks if a draft has already happened and is in the database
export const pastDraftHandler = async (lobbyCode: string) => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/draft/api/pastDraft/${lobbyCode}`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong checking for past drafts!");
    }
    const pastLobby: PastLobbyProps = await response.json();

    return pastLobby;
  } catch (err) {
    console.error("Error in checking for Draft: ", err);
  }
};
