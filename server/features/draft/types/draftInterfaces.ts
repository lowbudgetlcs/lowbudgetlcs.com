import { Namespace, Socket } from "socket.io";

export interface fixProps {
  status: boolean;
  sideResponding: string;
  sourceChampion: string;
  replacementChampion: string;
  replacementSource: string;
  lobbyCode: string;
}
