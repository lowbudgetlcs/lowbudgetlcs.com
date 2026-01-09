import { useEffect, useState } from "react";

import { Link, useLocation, useParams } from "react-router-dom";
import DraftDisplay from "../../components/draftViews/DraftDisplay";
import Button from "../../../../components/Button";
import StreamDisplay from "./StreamDisplay";
import { useDraftContext } from "../../providers/DraftProvider";
import MobileDraftDisplay from "./MobileDraftDisplay";
import { useSettingsContext } from "../../providers/SettingsProvider";
import ReconnectPopup from "../../components/popups/ReconnectPopup";
import ConnectPopup from "../../components/popups/ConnectPopup";
import ErrorPopup from "../../components/popups/ErrorPopup";

function DraftPage() {
  const { draftState, draftSocket, isPastDraft, loading, error, initializeDraft, championList } =
    useDraftContext();
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [reloadPage, setReloadPage] = useState<boolean>(false);
  const { forceDesktopView } = useSettingsContext();
  // Grab the lobby code
  const params = useParams();
  const lobbyCode: string | undefined = params.lobbyCode;
  const sideCode: string | undefined = params.sideCode;

  // Check if "stream" is found in the browser to enable stream mode
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

  useEffect(() => {
    if (!lobbyCode) {
      return;
    }

    initializeDraft(lobbyCode, sideCode);
  }, [lobbyCode, sideCode, initializeDraft]);

  const preloadImage = (url: string) => {
    const img = new Image();
    img.src = url;
  };

  // Preload all champion images
  useEffect(() => {
    championList.forEach((champion) => {
      const fixedName = champion.name.toLowerCase() === "wukong" ? "monkeyking" : champion.name;
      preloadImage(`${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${fixedName}/splashTile`);
      preloadImage(
        `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${fixedName}/splashCentered`
      );
      if (streamMode) {
        preloadImage(`${import.meta.env.VITE_BACKEND_URL}/images/api/champion/${fixedName}/portrait`);
      }
    });
  }, [championList]);

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
        <StreamDisplay championRoles={championList} />
      </>
    );
  } else if (draftState && lobbyCode && (draftSocket || isPastDraft) && !error) {
    return windowWidth >= 870 || forceDesktopView ? (
      <>
        <ErrorPopup />
        <ConnectPopup />
        <ReconnectPopup />
        <DraftDisplay championRoles={championList} />
      </>
    ) : (
      <>
        <ErrorPopup />
        <ConnectPopup />
        <ReconnectPopup />
        <MobileDraftDisplay championRoles={championList} />
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
  // Should never hit
  return null;
}

export default DraftPage;
