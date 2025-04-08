import { FearlessStateProps } from "../interfaces/draftInterfaces";

// Checks if a draft has already happened and is in the database
export const pastFearlessHandler = async (fearlessCode: string) => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/draft/api/pastFearless/${fearlessCode}`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong checking for past drafts!");
    }
    const pastSeries: FearlessStateProps = await response.json();

    return pastSeries;
  } catch (err) {
    console.error("Error in checking for Draft: ", err);
  }
};
