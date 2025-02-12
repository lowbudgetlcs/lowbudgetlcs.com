
export const createDraft = async (
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
  
      // Create the Draft lobby
      // check draftRoutes.ts in server routes folder
      const response = await fetch(
        "https://backend.lowbudgetlcs.com/draft/api/createDraft",
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