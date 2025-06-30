export interface PostProps {
  id: number;
  seasonId: number;
  division: string;
  image: string;
  name: string;
  player1Text: string;
  player2Text: string;
  player3Text: string;
  player4Text: string;
  player5Text: string;
}

const allStarsData = async (seasonId: number) => {
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/allstars/api/posts/${seasonId}`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong checking for posts");
    }

    const allStarsPosts: PostProps[] = await response.json();
    if (!allStarsPosts) {
      throw new Error("No Posts Found");
    }
    return allStarsPosts;
  } catch (error) {
    console.error("Something went wrong with checking for posts");
    return undefined;
  }
};

export default allStarsData;
