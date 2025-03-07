import { memo, useEffect, useState } from "react";
import { DraftProps } from "./draftInterfaces";

const Timer = ({
  timer,
  displayTurn,
}: {
  timer: DraftProps["timer"];
  displayTurn: DraftProps["displayTurn"];
}) => {
  const [currentTime, setCurrentTime] = useState<number>(30);
  useEffect(() => {
    if (timer > 30) {
      setCurrentTime(30);
    } else {
      setCurrentTime(timer);
    }
  }, [timer]);
  return (
    <p
      className={`text-4xl ${
        displayTurn === "blue"
          ? "text-blue"
          : displayTurn === "red"
          ? "text-red"
          : ""
      }`}
    >
      {currentTime}
    </p>
  );
};

export default memo(Timer)
