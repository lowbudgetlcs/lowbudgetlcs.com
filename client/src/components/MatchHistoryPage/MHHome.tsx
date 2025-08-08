import { useEffect, useState } from "react";
import MHTitlePopup from "./MHTitlePopup";
import { useParams } from "react-router-dom";
import { useSessionStorageState } from "../../hooks/useSessionStorageState";
import { MatchDto } from "./interfaces/MatchV5";
import MHMatchDisplay from "./MatchHistoryDisplay/MHMatchDisplay";
// import { useLocalStorageState } from "../../hooks/uselocalStorageState";

const MHHome = () => {
  const [popupShown, setPopupShown] = useState<boolean>(true);
  const [matchData, setMatchData] = useSessionStorageState<MatchDto | undefined>(
    "matchData",
    undefined
  );
  const params = useParams();
  useEffect(() => {
    if (params.matchID && matchData) {
      setPopupShown(false);
    }
  }, [params.matchID, matchData]);
  return (
    <div className={`grow flex`}>
      <div className={`${popupShown ? "" : "hidden"}`}>
        <MHTitlePopup />
      </div>
      {matchData && (
        <div
          className={`matchContainer grow flex flex-col ${
            popupShown ? "hidden" : ""
          } text-white items-center`}>
          <MHMatchDisplay matchData={matchData} />
        </div>
      )}
    </div>
  );
};

export default MHHome;
