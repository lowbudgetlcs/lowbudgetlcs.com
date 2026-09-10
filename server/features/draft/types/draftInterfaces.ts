import { Namespace, Socket } from "socket.io";

export interface fixProps {
  status: boolean;
  sideRequesting: string;
  sourceChampion: string;
  replacementChampion: string;
  replacementSource: string;
  lobbyCode: string;
}

export interface requestFixProps {
  sideRequesting: string;
  sourceChampion: string;
  replacementChampion: string;
  replacementSource: "blueBans" | "redBans" | "bluePicks" | "redPicks" | null;
  lobbyCode: string;
  socket: Socket,
}
