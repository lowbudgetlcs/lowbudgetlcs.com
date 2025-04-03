import { Link } from "react-router-dom";
import { FearlessInitializerProps } from "../interfaces/draftInterfaces";
import Button from "../../Button";

function FearlessLinks({
  fearlessDraftLinks,
  setFearlessDraftLinks,
}: {
  fearlessDraftLinks: FearlessInitializerProps;
  setFearlessDraftLinks: React.Dispatch<
    React.SetStateAction<FearlessInitializerProps | undefined>
  >;
}) {
  // Save check for if the initial side is already chosen to session storage
  const {
    team1Name,
    team2Name,
    fearlessCode,
    team1Code,
    team2Code,
    draftCount,
  } = fearlessDraftLinks;

  const team1Link = `http://localhost:3000/draft/fearless/${fearlessCode}/${team1Code}`;
  const team2Link = `http://localhost:3000/draft/fearless/${fearlessCode}/${team2Code}`;
  const specLink = `http://localhost:3000/draft/fearless/${fearlessCode}/spectator`;

  const removeDraftLinks = () => {
    setFearlessDraftLinks(undefined);
  };

  const copyLinks = () => {
    navigator.clipboard.writeText(`${team1Name}:
 ${team1Link}
${team2Name}:
${team2Link}
Spectator:
${specLink}`);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Fearless: Best of <span className="text-orange underline">{draftCount}</span></h2>
      <div onClick={removeDraftLinks} className="button hover:cursor-pointer">
        <Button>Re-Create Draft Links</Button>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-red text-center px-4">
          WARNING: Copy the links BEFORE closing the tab/browser or they will be
          lost!
        </p>
        {/* Blue Link */}
        <div className="BlueLinkDiv flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:px-0">
          <h3 className="text-2xl font-bold md:min-w-44">
            <span className="text-blue">{team1Name}'s</span> Link:
          </h3>
          <Link
            target="_blank"
            to={team1Link}
            className="text-xl hover:text-blue transition duration-300 flex-1 underline underline-offset-2 text-right"
          >
            Click Here (opens new tab)
          </Link>

          <div
            className="copy hover:cursor-pointer"
            onClick={() => navigator.clipboard.writeText(team1Link)}
          >
            <Button>Copy Link</Button>
          </div>
        </div>
        {/* Red Link */}
        <div className="RedLinkDiv flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:px-0">
          <h3 className="text-2xl font-bold md:min-w-44">
            <span className="text-red">{team2Name}'s</span> Link:
          </h3>
          <Link
            target="_blank"
            to={team2Link}
            className="text-xl hover:text-red transition duration-300 flex-1 underline underline-offset-2 text-right"
          >
            Click Here (opens new tab)
          </Link>

          <div
            className="copy hover:cursor-pointer"
            onClick={() => navigator.clipboard.writeText(team2Link)}
          >
            <Button>Copy Link</Button>
          </div>
        </div>
        {/* Spec Link */}
        <div className="specLinkDiv flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:px-0">
          <h3 className="text-2xl font-bold md:min-w-44">
            <span className="text-yellow">Spectator</span> Link:
          </h3>
          <Link
            target="_blank"
            to={specLink}
            className="text-xl hover:text-yellow transition duration-300 flex-1 underline underline-offset-2 text-right"
          >
            Click Here (opens new tab)
          </Link>

          <div
            className="copy hover:cursor-pointer"
            onClick={() => navigator.clipboard.writeText(specLink)}
          >
            <Button>Copy Link</Button>
          </div>
        </div>
        {/* Stream Link */}
        {/* <div className="steamLinkDiv flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:px-0">
          <h3 className="text-2xl font-bold md:w-44">
            <span className="text-purple">Stream</span> Link:
          </h3>
          <Link
            target="_blank"
            to={"#"}
            className="text-xl hover:text-purple transition duration-300 flex-1 underline underline-offset-2"
          >
            Click Here (opens new tab)
          </Link>

          <div
            className="copy hover:cursor-pointer"
            onClick={() => navigator.clipboard.writeText("#")}
          >
            <Button>Copy Link</Button>
          </div>
        </div> */}
      </div>
      <div className="copyBtns flex gap-8">
        <div onClick={copyLinks} className="button hover:cursor-pointer pb-4">
          <Button>Copy All Links</Button>
        </div>
      </div>
    </div>
  );
}
export default FearlessLinks;
