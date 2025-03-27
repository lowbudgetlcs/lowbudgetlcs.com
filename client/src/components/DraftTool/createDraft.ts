
export const createDraft = async (
    blueName: FormDataEntryValue,
    redName: FormDataEntryValue,
    tournamentID: FormDataEntryValue | null
  ) => {
    try {
      const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
      const data = {
        blueName: blueName,
        redName: redName,
        tournamentID: tournamentID,
      };
  
      // Create the Draft lobby
      // check draftRoutes.ts in server routes folder
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/draft/api/createDraft`,
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
      const result = await response.json();
      return result;
    } catch (err) {
      console.error("Error in Creating Draft DB Entry: ", err);
    }
  };