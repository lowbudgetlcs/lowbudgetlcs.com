import { Namespace } from "socket.io";
interface FixPhaseProps {
    io: Namespace;
    lobbyCode: string;
    state: string;
}
/* This phase runs throughout the draft. It allows 5 extra minutes
to fix the draft if there are any mistakes made with champion selection */
const fixPhase = ({ io }: FixPhaseProps) => {
    
    
};

export default fixPhase;