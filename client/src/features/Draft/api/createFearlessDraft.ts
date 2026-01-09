import { FearlessInitializerProps } from "../interfaces/draftInterfaces";

const createFearlessDraft = async (
  team1Name: FormDataEntryValue,
  team2Name: FormDataEntryValue,
  draftCount: number,
  tournamentID: FormDataEntryValue | null
) => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const data = {
      team1Name: team1Name,
      team2Name: team2Name,
      draftCount: draftCount,
      tournamentID: tournamentID,
    };
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/draft/api/createFearlessDraft`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    const result: FearlessInitializerProps = await response.json();
    if (!result) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }
    return result;
  } catch (err) {
    console.error("Error in Creating Fearless DB Entry:", err);
  }
};

export default createFearlessDraft;
