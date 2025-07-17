import { useState } from "react";
import MHTitlePopup from "./MHTitlePopup";
// import { useLocalStorageState } from "../../hooks/uselocalStorageState";

const MHHome = () => {
  const [popupShown, setPopupShown] = useState<boolean>(true);

  return (
    <div className={`grow flex`}>
      <div className={`${popupShown ? "" : "hidden"}`}>
        <MHTitlePopup />
      </div>
      <div className="mhrecentsearches">
        <h2 className="title">Match History: Recent Game Searches</h2>
      </div>
    </div>
  );
};

export default MHHome;
