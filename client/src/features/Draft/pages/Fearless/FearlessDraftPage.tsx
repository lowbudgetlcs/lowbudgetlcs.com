import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Champion } from "../../interfaces/draftInterfaces";
import DraftDisplay from "../../components/draftViews/DraftDisplay";
import Button from "../../../../components/Button";
import StreamDisplay from "../Draft/StreamDisplay";
import { useDraftContext } from "../../providers/DraftProvider";
import championData from "../../data/championRoles.json";
import { useFearlessContext } from "../../providers/FearlessProvider";
import MobileDraftDisplay from "../Draft/MobileDraftDisplay";
import { useSettingsContext } from "../../providers/SettingsProvider";
import ConnectPopup from "../../components/popups/ConnectPopup";
import ReconnectPopup from "../../components/popups/ReconnectPopup";
import ErrorPopup from "../../components/popups/ErrorPopup";

function FearlessDraftPage() {
  const { draftState, draftSocket, isPastDraft, loading, error, initializeDraft } =
    useDraftContext();

  const [championRoles] = useState<Champion[]>(championData);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [reloadPage, setReloadPage] = useState<boolean>(false);
  const { fearlessState, initializeFearless } = useFearlessContext();
  const { forceDesktopView } = useSettingsContext();
  // Set stream mode
  const location = useLocation();
  const streamMode = location.pathname.includes("stream");

  // Shows reload button after time has passed loading
  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setReloadPage(true);
      }, 4000);
    }
  }, [loading]);

  // Grab the codes
  const params = useParams();
  const teamCode = params.teamCode;
  const lobbyCode = params.lobbyCode;
  const fearlessCode = params.fearlessCode;
  // Initialize draft
  useEffect(() => {
    if (!lobbyCode) return;
    initializeDraft(lobbyCode, teamCode);
  }, [lobbyCode, teamCode, initializeDraft]);

  useEffect(() => {
    if (!fearlessCode || !teamCode) return;

    if (!fearlessState) {
      initializeFearless(fearlessCode, teamCode);
    }
  }, [fearlessCode, teamCode, initializeFearless]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (lobbyCode && streamMode && (draftSocket || isPastDraft) && !error) {
    return (
      <>
        <ErrorPopup />
        <ConnectPopup />
        <ReconnectPopup />
        <StreamDisplay championRoles={championRoles} />
      </>
    );
  } else if (draftState && lobbyCode && (draftSocket || isPastDraft) && !error) {
    return windowWidth >= 870 || forceDesktopView ? (
      <>
        <ErrorPopup />
        <ConnectPopup />
        <ReconnectPopup />
        <DraftDisplay championRoles={championRoles} />
      </>
    ) : (
      <>
        <ErrorPopup />
        <ConnectPopup />
        <ReconnectPopup />
        <MobileDraftDisplay championRoles={championRoles} />
      </>
    );
  } else if (loading) {
    return (
      <div className="text-white w-screen h-screen flex flex-col items-center justify-center gap-8 text-6xl">
        <p>Loading Draft</p>
        <div className="animate-spin border-b-2 border-r-2 border-t-2 border-orange rounded-full p-4 w-24 h-24"></div>
        <div className={`${reloadPage ? "" : "hidden"} text-xl`}>
          <p className="text-orange">Draft taking a long time to load?</p>
          <div onClick={() => window.location.reload()}>
            <Button>Reload Page</Button>
          </div>
        </div>
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
          <Link to={"/"}>
            <Button>Back to Draft Creation</Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default FearlessDraftPage;
