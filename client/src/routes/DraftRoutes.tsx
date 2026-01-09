import { Route, Routes } from "react-router-dom";
import { SocketProvider } from "../features/Draft/providers/SocketProvider";
import { DraftProvider } from "../features/Draft/providers/DraftProvider";
import DraftPage from "../features/Draft/pages/Draft/DraftPage";
import { FearlessProvider } from "../features/Draft/providers/FearlessProvider";
import FearlessMain from "../features/Draft/pages/Fearless/FearlessMain";
import FearlessDraftPage from "../features/Draft/pages/Fearless/FearlessDraftPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Draft from "../features/Draft/Draft";
const queryClient = new QueryClient();

const DraftRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<SocketProvider />}>
          <Route path="/" element={<Draft />} />
          <Route element={<DraftProvider />}>
            <Route path=":lobbyCode" element={<DraftPage />} />
            <Route path=":lobbyCode/:sideCode" element={<DraftPage />} />
          </Route>
          <Route element={<FearlessProvider />}>
            <Route path="fearless/:fearlessCode" element={<FearlessMain />} />
            <Route path="fearless/:fearlessCode/:teamCode" element={<FearlessMain />} />
            <Route element={<DraftProvider />}>
              <Route path="fearless/:fearlessCode/:teamCode/:lobbyCode" element={<FearlessDraftPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </QueryClientProvider>
  );
};

export default DraftRoutes;
