import { useEffect, useState } from "react";
import MHTitlePopup from "./MHTitlePopup";
import { useParams } from "react-router-dom";
import { useSessionStorageState } from "../../hooks/useSessionStorageState";
import { MatchDto } from "./interfaces/MatchV5";
import MHMatchDisplay from "./MatchHistoryDisplay/MHMatchDisplay";
import handleMatchSearch from "./handleMatchSearch";
import ErrorPage from "../ErrorPage";
// import { useLocalStorageState } from "../../hooks/uselocalStorageState";

const MHHome = () => {
  const [popupShown, setPopupShown] = useState<boolean>(true);
  const [matchData, setMatchData] = useSessionStorageState<MatchDto | undefined>(
    "matchData",
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [fetchErr, setFetchErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const params = useParams();

  useEffect(() => {
    const fetchMatchOnLoad = async (matchID: string) => {
      // If we have data and it's the correct match, just show it.
      if (matchData && matchData.metadata.matchId === matchID) {
        setPopupShown(false);
        return;
      }

      // Otherwise, fetch it.
      const data = await handleMatchSearch(matchID, setLoading, setFetchErr, setErrMessage);
      if (data) {
        setMatchData(data);
      }
      setPopupShown(false);
    };

    if (params.matchID) {
      fetchMatchOnLoad(params.matchID);
    } else {
      // No matchID in URL, show popup and clear any old data.
      setPopupShown(true);
      setMatchData(undefined);
      setFetchErr(false);
    }
  }, [params.matchID]);

  useEffect(() => {
    if (fetchErr) {
      console.log(errMessage);
    }
  }, [fetchErr, errMessage]);

  return (
    <div className={`grow flex justify-center`}>
      {popupShown && <MHTitlePopup />}

      {!popupShown && loading && (
        <div className="text-white w-screen h-screen flex flex-col items-center justify-center gap-8 text-6xl">
          <p>Loading Match</p>
          <div className="animate-spin border-b-2 border-r-2 border-t-2 border-orange rounded-full p-4 w-24 h-24"></div>
        </div>
      )}

      {!popupShown && fetchErr && <ErrorPage />}

      {!popupShown && !loading && !fetchErr && matchData && (
        <div className={`matchContainer grow flex flex-col text-white items-center`}>
          <MHMatchDisplay matchData={matchData} />
        </div>
      )}
    </div>
  );
};

export default MHHome;
