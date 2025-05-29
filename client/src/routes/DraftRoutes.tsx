import { Route, Routes } from "react-router-dom";
import { SocketProvider } from "../components/DraftTool/providers/SocketProvider";
import CreateDraft from "../components/DraftTool/draftCreation/CreateDraft";
import { DraftProvider } from "../components/DraftTool/providers/DraftProvider";
import DraftPage from "../components/DraftTool/mainPages/DraftPage";
import { FearlessProvider } from "../components/DraftTool/providers/FearlessProvider";
import FearlessMain from "../components/DraftTool/mainPages/FearlessMain";
import FearlessDraftPage from "../components/DraftTool/mainPages/FearlessDraftPage";

const DraftRoutes = () => {
  return (
    <Routes>
      <Route element={<SocketProvider />}>
        <Route path="/" element={<CreateDraft />} />
        <Route element={<DraftProvider />}>
          <Route path=":lobbyCode" element={<DraftPage />} />
          <Route path=":lobbyCode/:sideCode" element={<DraftPage />} />
        </Route>
        <Route element={<FearlessProvider />}>
          <Route
            path="fearless/:fearlessCode"
            element={<FearlessMain />}
          />
          <Route
            path="fearless/:fearlessCode/:teamCode"
            element={<FearlessMain />}
          />
          <Route element={<DraftProvider />}>
            <Route
              path="fearless/:fearlessCode/:teamCode/:lobbyCode"
              element={<FearlessDraftPage />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default DraftRoutes;
