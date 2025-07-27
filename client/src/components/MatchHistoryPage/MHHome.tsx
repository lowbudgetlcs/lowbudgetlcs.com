import { useEffect, useState } from "react";
import MHTitlePopup from "./MHTitlePopup";
import { useParams } from "react-router-dom";
import { useSessionStorageState } from "../../hooks/useSessionStorageState";
import { MatchDto } from "./interfaces/MatchV5";
// import { useLocalStorageState } from "../../hooks/uselocalStorageState";

const MHHome = () => {
  const [popupShown, setPopupShown] = useState<boolean>(true);
  const [matchData, setMatchData] = useSessionStorageState<
    MatchDto | undefined
  >("matchData", undefined);
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
        <div className={`matchContainer ${popupShown ? "hidden" : ""} text-white`}>
          Here is match Data
        </div>
      )}
    </div>
  );
};

export default MHHome;
