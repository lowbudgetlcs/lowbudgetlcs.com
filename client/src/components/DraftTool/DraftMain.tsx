import Button from "../Button";
import NavList from "../NavList";
import { createDraftDBEntry, DraftCodeProps } from "./draftHandler";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

function DraftMain() {
  const [draftLinks, setDraftLinks] = useState<Array<string>>([]);

  // Required variables for Nav List
  const [activeLink, setActiveLink] = useState<string>("Default Draft");
  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };
  const navItems = ['Default Draft', 'LBLCS Tournament', 'Fearless Draft']

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    let blueName = formData.get("blueName") as string | null;
    let redName = formData.get("redName") as string | null;
    if(!blueName) {
      blueName = "Blue Team"
    }
    if (!redName) {
      redName = "Red Team"
    }
    console.log("Blue Name: ", blueName);
    console.log("Red Name: ", redName);
    if (blueName && redName) {
      const draftResult: DraftCodeProps = await createDraftDBEntry(
        blueName,
        redName,
        null
      );
      setDraftLinks([
        draftResult.draft.blueCode,
        draftResult.draft.redCode,
        draftResult.draft.specCode,
      ]);
    }
  };

  return (
    <div className="text-white">
      <div className="title m-20 text-center">
        <h1 className="text-6xl text-white">Draft Tool</h1>
      </div>
      {draftLinks.length > 0 ? (
        <DraftCodes draftLinks={draftLinks} setDraftLinks={setDraftLinks} />
      ) : (
        <div className="draftInput">
          <h2 className="text-center text-2xl font-bold">Create Draft</h2>
          <div className="draftMenu">
            <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems}/>
          </div>
          <form
            className="flex flex-col items-center gap-4 justify-center p-4"
            onSubmit={handleFormSubmission}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col">
                <p>Blue Side</p>
                <input
                  type="text"
                  placeholder="Blue Team"
                  className="bg-gray/40 border-gray border-2 rounded-md p-2 text-blue"
                  name="blueName"
                ></input>
              </div>
              <div className="flex flex-col">
                <p>Red Side</p>
                <input
                  type="text"
                  placeholder="Red Team"
                  className="bg-gray/40 border-gray border-2 rounded-md p-2 text-red"
                  name="redName"
                ></input>
              </div>
            </div>
            <button type="submit" className="">
              <Button>Create Draft</Button>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function DraftCodes({
  draftLinks,
  setDraftLinks,
}: {
  draftLinks: string[];
  setDraftLinks: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const removeDraftLinks = () => {
    setDraftLinks([]);
  };
  const copyLinks = () => {
    navigator.clipboard.writeText(`Blue Side Link:
https://lowbudgetlcs.com/draft/${draftLinks[0]}
Red Side Link:
https://lowbudgetlcs.com/draft/${draftLinks[1]}
Spectator Link:
https://lowbudgetlcs.com/draft/${draftLinks[2]}`);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div onClick={removeDraftLinks} className="button hover:cursor-pointer">
        <Button>Re-Create Draft Links</Button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="BlueLinkDiv flex flex-col">
          <h3 className="text-2xl font-bold">
            <span className="text-blue">Blue Side</span> Link:
          </h3>
          <Link
            to={`https://lowbudgetlcs.com/draft/${draftLinks[0]}`}
            className="text-xl hover:text-blue transition duration-300 py-4"
          >
            https://lowbudgetlcs.com/draft/{draftLinks[0]}
          </Link>
        </div>
        <div className="RedLinkDiv flex flex-col">
          <h3 className="text-2xl font-bold">
            <span className="text-red">Red Side</span> Link:
          </h3>
          <Link
            to={`https://lowbudgetlcs.com/draft/${draftLinks[1]}`}
            className="text-xl hover:text-red transition duration-300 py-4"
          >
            https://lowbudgetlcs.com/draft/{draftLinks[1]}
          </Link>
        </div>
        <div className="specLinkDiv flex flex-col">
          <h3 className="text-2xl font-bold">
            <span className="text-yellow">Spectator</span> Link:
          </h3>
          <Link
            to={`https://lowbudgetlcs.com/draft/${draftLinks[2]}`}
            className="text-xl hover:text-yellow transition duration-300 py-4"
          >
            https://lowbudgetlcs.com/draft/{draftLinks[2]}
          </Link>
        </div>
      </div>
      <div onClick={copyLinks} className="button hover:cursor-pointer pb-4">
        <Button>Copy All Links</Button>
      </div>
    </div>
  );
}
export default DraftMain;
