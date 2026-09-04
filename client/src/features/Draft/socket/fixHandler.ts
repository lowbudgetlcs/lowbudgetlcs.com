import { Socket } from "socket.io-client";

export const sendFixRequest = (
  sideRequesting: string,
  sourceChampion: string,
  replacementChampion: string,
  replacementSource: string,
  lobbyCode: string,
  socket: Socket,
): void => {
  socket.emit("fixRequest", { sideRequesting, sourceChampion, replacementChampion, replacementSource, lobbyCode });
};

export const sendFixResponse = (
  status: string,
  sideRequesting: string,
  sourceChampion: string,
  replacementChampion: string,
  replacementSource: string,
  lobbyCode: string,
  socket: Socket,
): void => {
  socket.emit("fixResponse", { status, sideRequesting, sourceChampion, replacementChampion, replacementSource, lobbyCode });
};
