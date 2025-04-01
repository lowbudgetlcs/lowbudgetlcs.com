import { Socket } from "socket.io-client";
import { FearlessStateProps } from "../interfaces/draftInterfaces";

const fearlessConnectionHandler = (
  socket: Socket,
  fearlessCode: string | undefined,
  teamCode: string | undefined,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  setFearlessState: React.Dispatch<
    React.SetStateAction<FearlessStateProps | undefined>
  >,
  setTeam: React.Dispatch<React.SetStateAction<string | undefined>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Initial connection
  console.log(fearlessCode, ": ", teamCode);
  socket.emit("joinFearless", { fearlessCode, teamCode });

  // Error handling
  socket.on("error", ({ message }) => {
    console.error(message);
    setError(true);
    setLoading(false);
  });

  // Sets the side for client
  const joinFearless = ({
    teamDisplay,
    fearlessState,
  }: {
    teamDisplay: string;
    fearlessState: FearlessStateProps;
  }) => {
    setFearlessState(fearlessState);
    setTeam(teamDisplay);
    setLoading(false);
  };

  socket.once("joinedFearless", joinFearless);
};

export default fearlessConnectionHandler;
