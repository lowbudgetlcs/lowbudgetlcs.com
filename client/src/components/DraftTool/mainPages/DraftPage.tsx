import { useEffect, useState } from "react";

import { Link, useLocation, useParams } from "react-router-dom";
import { Champion } from "../interfaces/draftInterfaces";
import DraftDisplay from "../draftViews/DraftDisplay";
import Button from "../../Button";
import StreamDisplay from "../StreamView/StreamDisplay";
import { useDraftContext } from "../providers/DraftProvider";
import championData from "../championRoles.json";
import MobileDraftDisplay from "../mobileViews/MobileDraftDisplay";
import { useSettingsContext } from "../providers/SettingsProvider";

function DraftPage() {
  const {
    draftState,
    draftSocket,
    isPastDraft,
    loading,
    error,
    initializeDraft,
  } = useDraftContext();
  const [championRoles] = useState<Champion[]>(championData);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const { forceDesktopView } = useSettingsContext();
  // Grab the lobby code
  const params = useParams();
  const lobbyCode: string | undefined = params.lobbyCode;
  const sideCode: string | undefined = params.sideCode;

  // Check if "stream" is found in the browser to enable stream mode
  const location = useLocation();
  const streamMode = location.pathname.includes("stream");

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
    championRoles.forEach((champion) => {
      const fixedName =
        champion.name.toLowerCase() === "wukong" ? "monkeyking" : champion.name;
      preloadImage(
        `https://cdn.communitydragon.org/latest/champion/${fixedName}/tile`
      );
      preloadImage(
        `https://cdn.communitydragon.org/latest/champion/${fixedName}/splash-art/centered`
      );
      if (streamMode) {
        preloadImage(`https://cdn.communitydragon.org/latest/champion/${fixedName}/portrait`)
      }
    });
  }, [championRoles]);

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
    return <StreamDisplay championRoles={championRoles} />;
  } else if (
    draftState &&
    lobbyCode &&
    (draftSocket || isPastDraft) &&
    !error
  ) {
    return windowWidth >= 870 || forceDesktopView ? <DraftDisplay championRoles={championRoles} /> : <MobileDraftDisplay championRoles={championRoles} />;
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
