import { Dispatch, SetStateAction } from "react";
import getMatch from "./getMatch";
import { isNumber } from "chart.js/helpers";

const handleMatchSearch = async (
  matchID: string | null,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setFetchErr: Dispatch<SetStateAction<boolean>>,
  setErrMessage: Dispatch<SetStateAction<string>>
) => {
  setFetchErr(false);
  setErrMessage("");
  setLoading(true);
  if (matchID && Number.isInteger(Number(matchID))) {
    const matchData = await getMatch(Number(matchID));
    if (matchData === 404) {
      setFetchErr(true);
      setLoading(false);
      setErrMessage("Match not found");
      return null;
    } else if (matchData === 500) {
      setFetchErr(true);
      setLoading(false);
      setErrMessage("Internal Server error. Try reloading the page.");
      return null;
    }

    if (isNumber(matchData)) {
      setFetchErr(true);
      setLoading(false);
      setErrMessage("Internal Server error. Try reloading the page.");
      return null;
    }
    // Successful
    setLoading(false);
    return matchData;
  } else if (matchID && matchID.length !== 0) {
    setFetchErr(true);
    setLoading(false);
    setErrMessage("Match ID must be a number");
  } else {
    setFetchErr(true);
    setLoading(false);
    setErrMessage("Match ID is required");
  }
};

export default handleMatchSearch;
