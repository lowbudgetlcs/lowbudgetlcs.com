import { MdEdit } from "react-icons/md";
import { useDraftContext } from "../../providers/DraftProvider";

interface FixChampionButtonProps {
  sourceChampion: string;
  compact?: boolean;
}

const FixChampionButton = ({ sourceChampion, compact = false }: FixChampionButtonProps) => {
  const { playerSide, setFixRequestData, setShowFixChampionList } = useDraftContext();
  const sideCode = sessionStorage.getItem("activeSideCode");
  const lobbyCode = sessionStorage.getItem("activeLobbyCode");

  if ((playerSide !== "blue" && playerSide !== "red") || !sideCode || !lobbyCode) {
    return null;
  }

  const openReplacementSelector = () => {
    setFixRequestData({
      sourceChampion,
      replacementChampion: null,
      sideCode,
      lobbyCode,
    });
    setShowFixChampionList(true);
  };

  return (
    <button
      type="button"
      className={`absolute right-1 top-1 z-20 rounded-md bg-bg-light p-1 text-white transition-opacity ${
        compact ? "opacity-100 sm:opacity-0 sm:group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
      onClick={openReplacementSelector}
      aria-label={`Replace ${sourceChampion}`}
      title={`Replace ${sourceChampion}`}>
      <MdEdit />
    </button>
  );
};

export default FixChampionButton;