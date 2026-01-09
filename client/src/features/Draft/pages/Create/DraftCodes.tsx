import { Link } from "react-router-dom";
import Button from "../../../../components/Button";
import { DraftLinkProps } from "../../interfaces/draftInterfaces";

function DraftCodes({
  draftLinks,
  setDraftLinks,
}: {
  draftLinks: DraftLinkProps;
  setDraftLinks: React.Dispatch<
    React.SetStateAction<DraftLinkProps | undefined>
  >;
}) {
  const removeDraftLinks = () => {
    setDraftLinks(undefined);
  };
  const blueLink = `https://draft.lowbudgetlcs.com/${draftLinks.lobbyCode}/${draftLinks.blueCode}`;
  const redLink = `https://draft.lowbudgetlcs.com/${draftLinks.lobbyCode}/${draftLinks.redCode}`;
  const specLink = `https://draft.lowbudgetlcs.com/${draftLinks.lobbyCode}`;
  const streamLink = `https://draft.lowbudgetlcs.com/${draftLinks.lobbyCode}/stream`;

  const copyLinks = () => {
    navigator.clipboard.writeText(`Blue:
${blueLink}
Red:
${redLink}
Spectator:
${specLink}`);
  };
  const copySpecLinks = () => {
    navigator.clipboard.writeText(`Spectator:
${specLink}`);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div onClick={removeDraftLinks} className="button hover:cursor-pointer">
        <Button>Re-Create Draft Links</Button>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-red text-center px-4">
          WARNING: you CANNOT get back to this page if the tab/browser is closed
          or if button above is pressed
        </p>
        {/* Blue Link */}
        <div className="BlueLinkDiv flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:px-0">
          <h3 className="text-2xl font-bold md:w-44">
            <span className="text-blue">Blue Side</span> Link:
          </h3>
          <Link
            target="_blank"
            to={blueLink}
            className="text-xl hover:text-blue transition duration-300 flex-1 underline underline-offset-2"
          >
            Click Here (opens new tab)
          </Link>

          <div
            className="copy hover:cursor-pointer"
            onClick={() => navigator.clipboard.writeText(blueLink)}
          >
            <Button>Copy Link</Button>
          </div>
        </div>
        {/* Red Link */}
        <div className="RedLinkDiv flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:px-0">
          <h3 className="text-2xl font-bold md:w-44">
            <span className="text-red">Red Side</span> Link:
          </h3>
          <Link
            target="_blank"
            to={redLink}
            className="text-xl hover:text-red transition duration-300 flex-1 underline underline-offset-2"
          >
            Click Here (opens new tab)
          </Link>

          <div
            className="copy hover:cursor-pointer"
            onClick={() => navigator.clipboard.writeText(redLink)}
          >
            <Button>Copy Link</Button>
          </div>
        </div>
        {/* Spec Link */}
        <div className="specLinkDiv flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:px-0">
          <h3 className="text-2xl font-bold md:w-44">
            <span className="text-yellow">Spectator</span> Link:
          </h3>
          <Link
            target="_blank"
            to={specLink}
            className="text-xl hover:text-yellow transition duration-300 flex-1 underline underline-offset-2"
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
        <div className="steamLinkDiv flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:px-0">
          <h3 className="text-2xl font-bold md:w-44">
            <span className="text-purple">Stream</span> Link:
          </h3>
          <Link
            target="_blank"
            to={streamLink}
            className="text-xl hover:text-purple transition duration-300 flex-1 underline underline-offset-2"
          >
            Click Here (opens new tab)
          </Link>

          <div
            className="copy hover:cursor-pointer"
            onClick={() => navigator.clipboard.writeText(streamLink)}
          >
            <Button>Copy Link</Button>
          </div>
        </div>
      </div>
      <div className="copyBtns flex gap-8">
        <div onClick={copyLinks} className="button hover:cursor-pointer pb-4">
          <Button>Copy All Links</Button>
        </div>
        <div
          onClick={copySpecLinks}
          className="button hover:cursor-pointer pb-4"
        >
          <Button>Copy Spectate Links</Button>
        </div>
      </div>
    </div>
  );
}
export default DraftCodes;
