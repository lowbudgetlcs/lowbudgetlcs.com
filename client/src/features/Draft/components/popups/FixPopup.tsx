import { useSocketContext } from "../../providers/SocketProvider";

const FixPopup = () => {
    const {showFixPopup, setShowFixPopup, fixAccepted, setFixAccepted} = useSocketContext();

    if (!showFixPopup) return null;

    return (
        <div className="fix-popup">
            <div className="fixHeader">
                
            </div>
        </div>
    )
}