import { requestFixProps } from "../../types/draftInterfaces";
import requestFix from "./requestFix";
import { Namespace } from "socket.io";


// Handles fix requests from both sides and keeps track of which side has requested a fix.
const handleFixes = async (socket: Namespace) => {
    let didRedRequestFix = false;
    let didBlueRequestFix = false;

    socket.on("requestFix", (data: requestFixProps) => {
        if (data.sideRequesting === "red") {
            didRedRequestFix = true;
            requestFix(data);
        } else if (data.sideRequesting === "blue") {
            didBlueRequestFix = true;
            requestFix(data);
        }
    });
};

export default handleFixes;