import { Namespace } from "socket.io";

export interface fixProps {
    status: string; 
    sideRequesting: string;
    requestSource: string;
    replacementChampion: string;
    replacementSource: string;
}

export interface requestFixProps {
    sideRequesting: string;
    requestSource: string;
    replacementChampion: string;
    replacementSource: string;
    io: Namespace;
    lobbyCode: string;
}