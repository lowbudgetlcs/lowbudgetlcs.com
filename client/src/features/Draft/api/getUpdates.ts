
export interface Update {
  id: number;
  date: string;
  title: string;
  description: string;
}

const getUpdates = async (): Promise<Update[]> => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/draft/api/updates`, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const updates: Update[] = await response.json();
    return updates;
  } catch (err) {
    console.error("Error fetching updates:", err);
    return [];
  }
};

export default getUpdates;
