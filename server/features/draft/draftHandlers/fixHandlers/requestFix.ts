import { fixProps, requestFixProps } from "../../types/draftInterfaces";



// Sends a request to fix a champion pick and waits for the response from the other side.
const requestFix = async ({ sideRequesting, sourceChampion, replacementChampion, replacementSource, io, lobbyCode }: requestFixProps) => {
    io.to(lobbyCode).emit("requestFix", {
        sideRequesting,
        sourceChampion,
        replacementChampion,
        replacementSource
    });

    // Returns the above & status: boolean (true if the fix was accepted, false otherwise)
    return new Promise<fixProps>((resolve) => {
        io.once("fixResponse", (response: fixProps) => {
            resolve(response);
        });
    });
};

export default requestFix;