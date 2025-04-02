import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Champion } from "../draftInterfaces";
import DraftDisplay from "../DraftDisplay";
import Button from "../../Button";
import StreamDisplay from "../StreamView/StreamDisplay";
import { useDraftContext } from "../providers/DraftProvider";
import { useFearlessContext } from "../providers/FearlessProvider";
import championData from "../championRoles.json";

function FearlessDraftPage() {
  const {
    draftState,
    draftSocket,
    isPastDraft,
    loading,
    error,
    initializeDraft,
  } = useDraftContext();
  
  const { fearlessSocket, notifyDraftComplete } = useFearlessContext();
  const [championRoles] = useState<Champion[]>(championData);

  // Set stream mode
  const location = useLocation();
  const streamMode = location.pathname.includes("stream");



  // Grab the codes
  const params = useParams();
  const fearlessCode = params.fearlessCode;
  const teamCode = params.teamCode;
  const lobbyCode = params.lobbyCode;

  // Initialize draft
  useEffect(() => {
    if (!lobbyCode) return;
    initializeDraft(lobbyCode, teamCode);
  }, [lobbyCode, teamCode, initializeDraft]);
  
  // Notify fearless provider about completed draft
  useEffect(() => {
    if (!draftState.draftComplete || !fearlessCode || !lobbyCode || !fearlessSocket) return;
    
    // Call the provider method to handle draft completion
    notifyDraftComplete(fearlessCode, lobbyCode);
  }, [draftState.draftComplete, fearlessCode, lobbyCode, fearlessSocket, notifyDraftComplete]);


  if (lobbyCode && streamMode && (draftSocket || isPastDraft) && !error) {
    return <StreamDisplay championRoles={championRoles} />;
  } else if (draftState && lobbyCode && (draftSocket || isPastDraft) && !error) {
    return <DraftDisplay championRoles={championRoles} />;
  } else if (loading) {
    return (
      <div className="text-white w-screen h-screen flex flex-col items-center justify-center gap-8 text-6xl">
        <p>Loading Draft</p>
        <div className="animate-spin border-b-2 border-r-2 border-t-2 border-orange rounded-full p-4 w-24 h-24"></div>
      </div>
    );
  } else if (error) {
    return (
      <div className="text-white w-screen h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-6xl font-bold">Draft Not Found</p>
        <p className="text-red">
          Some error has occured. Check your URL or click the button below!
        </p>
        <div className="cursor-pointer">
          <Link to={"/draft"}>
            <Button>Back to Draft Creation</Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default FearlessDraftPage;
