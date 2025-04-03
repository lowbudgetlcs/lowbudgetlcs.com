import { useNavigate } from "react-router-dom";

const fearlessDraftSetupHandler = (lobbyCode: string, teamCode: string) => {
  const navigate = useNavigate();

  navigate(`/draft/${lobbyCode}/${teamCode}/fearless`);
};

export default fearlessDraftSetupHandler;
