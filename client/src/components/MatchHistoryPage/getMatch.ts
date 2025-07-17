const getMatch = async (matchId: number) => {
  const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/mh/api/${matchId}`,
    {
      headers: {
        "x-api-key": apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const matchData = await response.json();
  console.log(matchData)
};

export default getMatch;
