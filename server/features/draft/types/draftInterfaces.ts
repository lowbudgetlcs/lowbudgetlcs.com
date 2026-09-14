import { Namespace, Socket } from "socket.io";

export interface fixProps {
  status: boolean;
  sideRequesting: string;
  sourceChampion: string;
  replacementChampion: string;
  replacementSource: string;
  lobbyCode: string;
}
