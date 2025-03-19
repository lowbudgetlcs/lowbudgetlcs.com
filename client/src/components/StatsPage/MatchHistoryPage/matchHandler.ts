import { FullPlayerDataProps } from "../statTypes";

const matchHandler = async (shortcode: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/stats/api/matchhistory/match/${shortcode}`
    );

    if (!response.ok) {
      throw new Error("Error Getting Match from Server");
    }

    const matchResults: FullPlayerDataProps[] = await response.json();
    console.log(matchResults);
    return matchResults;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default matchHandler;
