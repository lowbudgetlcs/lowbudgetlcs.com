import { useEffect, useRef } from "react";
import { useDraftContext } from "./providers/DraftProvider";
import { useSettingsContext } from "./providers/SettingsProvider";
import pickSound from "../../assets/sounds/pick.ogg";
import banSound from "../../assets/sounds/ban.ogg";

const DraftTurnAudio = () => {
  const { draftState, playerSide } = useDraftContext();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { volume } = useSettingsContext();
  useEffect(() => {
    // Check if it's the player's turn
    if (playerSide === draftState.displayTurn) {
      let audioSrc = "";

      // Determine which audio to play based on phase type
      if (draftState.phaseType === "ban") {
        audioSrc = banSound;
      } else if (draftState.phaseType === "pick") {
        audioSrc = pickSound;
      }

      if (audioSrc && audioRef.current) {
        audioRef.current.volume = volume / 100;
        audioRef.current.src = audioSrc;
        audioRef.current
          .play()
          .catch((e) => console.error("Error playing audio somehow:", e));
      }
    }
  }, [draftState.displayTurn, draftState.phaseType, playerSide]); // Re-run effect when these values change

  return <audio ref={audioRef} />;
};

export default DraftTurnAudio;
