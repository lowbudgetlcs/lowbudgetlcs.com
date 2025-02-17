import { DraftProps } from "./draftInterfaces";

export interface PastLobbyProps {
  isValid: boolean;
  draftState: DraftProps | undefined;
}

// Checks if a draft has already happened and is in the database
export const pastDraftHandler = async (lobbyCode: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/draft/api/pastDraft/${lobbyCode}`
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
