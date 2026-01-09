import { Socket } from "socket.io-client";

const sideSelectHandler = (
  fearlessCode: string,
  socket: Socket,
  selectedSide: string | undefined,
  setSelectedSide: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  if (selectedSide === "red" || selectedSide === "blue") {
    socket.emit("selectSide", { fearlessCode, selectedSide });
    setSelectedSide(selectedSide);
  }
};

export default sideSelectHandler;
