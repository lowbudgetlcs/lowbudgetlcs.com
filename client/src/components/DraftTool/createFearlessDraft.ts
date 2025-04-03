import { FearlessInitializerProps } from "./interfaces/draftInterfaces";

const createFearlessDraft = async (
  blueName: FormDataEntryValue,
  redName: FormDataEntryValue,
  draftCount: number
) => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const data = {
      team1Name: blueName,
      team2Name: redName,
      draftCount: draftCount,
    };
    const response = await fetch(
      "http://localhost:8080/draft/api/createFearlessDraft",
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
