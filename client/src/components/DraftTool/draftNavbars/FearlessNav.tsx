import { Link, useParams } from "react-router-dom";
import { useFearlessContext } from "../providers/FearlessProvider";

const FearlessNav = () => {
  const { fearlessState } = useFearlessContext();
  if (!fearlessState) return;
  const draftNavLinks = [];
  const activeDraftLinks: { link: string; i: number }[] = [];
  const params = useParams();
  const teamCode = params.teamCode || "spectator";
  for (let i = 0; i < fearlessState.draftCount; i++) {
    if (fearlessState.draftLobbyCodes && fearlessState.draftLobbyCodes[i]) {
      const link = `http://localhost:3000/draft/${fearlessState.fearlessCode}/${teamCode}/${fearlessState.draftLobbyCodes[i]}`;
      const linkObject = { link, i };
      activeDraftLinks.push(linkObject);
    }
    draftNavLinks.push(i + 1);
  }
  return (
    <>
      <div className="h-12 w-full flex items-center justify-center">
        <ul className="navItems flex items-center justify-center gap-8 text-white/40">
          {draftNavLinks.map((draft) => {
            let findLink = null;
            console.log(fearlessState)
            activeDraftLinks.forEach((link) => {
              if (link.i === draft) {
                findLink = link.link;
              }
            });
            if (findLink) {
              return (
                <li key={draft} className="hover:cursor-pointer text-white">
                  <Link to={findLink}>Draft {draft} </Link>
                </li>
              );
            } else {
              return <li key={draft}>Draft {draft}</li>;
            }
          })}
        </ul>
      </div>
    </>
  );
};

export default FearlessNav;
