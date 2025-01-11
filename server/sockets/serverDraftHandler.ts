import { Socket } from "socket.io";

export const draftHandler = async (socker: Socket, lobbyCode: string, blueUser: string, redUser: string) => {
    let timer = 34;
    let shownTimer = timer - 4;
    let currentTurn: string;
}