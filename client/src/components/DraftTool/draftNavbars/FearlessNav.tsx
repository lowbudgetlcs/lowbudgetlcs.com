import { Link, useParams } from "react-router-dom";
import { useFearlessContext } from "../providers/FearlessProvider";

const FearlessNav = () => {
  const { fearlessState } = useFearlessContext();
  const params = useParams();
  const teamCode = params.teamCode || "spectator";
  const currentLobbyCode = params.lobbyCode;
  
  if (!fearlessState) return null;
  
  return (
    <div className="h-12 w-full flex items-center justify-center">
      <ul className="navItems flex items-center justify-center gap-8 text-white/40">
        {Array.from({ length: fearlessState.draftCount }, (_, i) => i + 1).map((draftNum) => {
          // Get the lobby code for this draft number (adjusting for zero-indexing)
          const lobbyCode = fearlessState.draftLobbyCodes?.[draftNum - 1];
          // Check if this is the currently active draft
          const isCurrentDraft = lobbyCode === currentLobbyCode;
          
          if (lobbyCode) {
            return (
              <li key={draftNum} className={`hover:cursor-pointer ${isCurrentDraft ? 'text-orange font-bold' : 'text-white'}`}>
                {isCurrentDraft ? (
                  // Just show text for the current draft
                  <span>Draft {draftNum}</span>
                ) : (
                  // Use relative path for other drafts
                  <Link reloadDocument to={`/draft/fearless/${fearlessState.fearlessCode}/${teamCode}/${lobbyCode}`}>
                    Draft {draftNum}
                  </Link>
                )}
              </li>
            );
          } else {
            // Draft hasn't been created yet
            return <li key={draftNum}>Draft {draftNum}</li>;
          }
        })}
      </ul>
    </div>
  );
};

export default FearlessNav;
