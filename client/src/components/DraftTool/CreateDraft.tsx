import { useSessionStorageState } from "../../hooks/useLocalStorageState";
import Button from "../Button";
import NavList from "../NavList";
import { createDraft } from "./createDraft";
import { checkTournamentCode, DraftCodeProps } from "./draftHandler";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface DraftLinkProps {
  lobbyCode: string;
  blueCode: string;
  redCode: string;
}
function CreateDraft() {
  const [draftLinks, setDraftLinks] = useSessionStorageState<
    DraftLinkProps | undefined
  >("draftLinks", undefined);
  const [hasBadCode, setHasBadCode] = useState<boolean>(false);

  // Check if urls have been previously generated
  useEffect(() => {}, []);
  // Required variables for Nav List
  const [activeLink, setActiveLink] = useState<string>("Default Draft");
  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };
  const navItems = ["Default Draft", "LBLCS Tournament"];

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Team names and tournament code from /draft form
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const draftType = formData.get("draftType") as string | null;
    const tournamentID = formData.get("tournamentID") as string | null;
    let blueName = (formData.get("blueName") as string | null) || "Blue Team";
    let redName = (formData.get("redName") as string | null) || "Red Team";

    try {
      // Only runs if the LBLCS Tournament option is selected
      if (draftType === "Tournament") {
        if (!tournamentID) {
          console.error("Tournament ID is missing despite being required.");
          return;
        }

        // Checks if the tournament code exists in the database (when a player generates one with the discord bot)
        const isTournamentValid = await checkTournamentCode(tournamentID);

        // If there is no code or the code is not in the database, show error to user on tournament input box
        if (!isTournamentValid) {
          setHasBadCode(true);
          return;
        }
      }

      // Create draft. This will send to the database if their is a tournament code
      // otherwise it will just create a draft state (record) on the server that will expire after a set amount of time
      const draftResult: DraftCodeProps = await createDraft(
        blueName,
        redName,
        tournamentID || null
      );

      // For Draft Links
      const draftLobbyCodes = {
        lobbyCode: draftResult.draft.lobbyCode,
        blueCode: draftResult.draft.blueCode,
        redCode: draftResult.draft.redCode,
      };
      setDraftLinks(draftLobbyCodes);
    } catch (err) {
      console.error("Error during form submission:", err);
    }
  };

  return (
    <div className="text-white">
      <div className="title m-20 text-center">
        <h1 className="text-6xl text-white">Draft Tool</h1>
      </div>
      {draftLinks ? (
        <DraftCodes draftLinks={draftLinks} setDraftLinks={setDraftLinks} />
      ) : (
        <div className="draftInput">
          <h2 className="text-center text-2xl font-bold">Create Draft</h2>
          <div className="draftMenu">
            <NavList
              activeLink={activeLink}
              toggleActive={toggleActive}
              navItems={navItems}
            />
          </div>
          {activeLink === "Default Draft" ? (
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
                    maxLength={18}
                  ></input>
                </div>
                <div className="flex flex-col">
                  <p>Red Side</p>
                  <input
                    type="text"
                    placeholder="Red Team"
                    className="bg-gray/40 border-gray border-2 rounded-md p-2 text-red"
                    name="redName"
                    maxLength={18}
                  ></input>
                </div>
              </div>
              <button type="submit" className="">
                <Button>Create Draft</Button>
              </button>
            </form>
          ) : activeLink === "LBLCS Tournament" ? (
            <form
              className="flex flex-col items-center gap-4 justify-center p-4"
              onSubmit={handleFormSubmission}
            >
              <input type="hidden" name="draftType" value="Tournament"></input>
              <div className="flex flex-col">
                <p className="text-xl font-bold">
                  <span className="text-red">*</span> Tournament Code
                </p>
                <input
                  type="text"
                  placeholder="Tournament Code"
                  className="bg-gray/40 border-gray border-2 rounded-md p-2 text-orange"
                  name="tournamentID"
                  required
                ></input>
                <p
                  className={`${
                    hasBadCode ? "" : "opacity-0"
                  } text-sm text-red p-1`}
                >
                  Invalid Tournament Code!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col">
                  <p className="text-xl">Blue Side</p>
                  <input
                    type="text"
                    placeholder="Blue Team"
                    className="bg-gray/40 border-gray border-2 rounded-md p-2 text-blue"
                    name="blueName"
                  ></input>
                </div>
                <div className="flex flex-col">
                  <p className="text-xl">Red Side</p>
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
          ) : activeLink === "Fearless Draft" ? (
            <form
              className="flex flex-col items-center gap-4 justify-center p-4"
              onSubmit={handleFormSubmission}
            >
              <input type="hidden" name="draftType" value="Fearless"></input>
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
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}

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
  const copyLinks = () => {
    navigator.clipboard.writeText(`Blue Side Link:
https://lowbudgetlcs.com/draft/${draftLinks.lobbyCode}/${draftLinks.blueCode}
Red Side Link:
https://lowbudgetlcs.com/draft/${draftLinks.lobbyCode}/${draftLinks.redCode}
Spectator Link:
https://lowbudgetlcs.com/draft/${draftLinks.lobbyCode}`);
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
            target="_blank"
            to={`https://lowbudgetlcs.com/draft/${draftLinks.lobbyCode}/${draftLinks.blueCode}`}
            className="text-xl hover:text-blue transition duration-300 py-4"
          >
            https://lowbudgetlcs.com/draft/{draftLinks.lobbyCode}/
            {draftLinks.blueCode}
          </Link>
        </div>
        <div className="RedLinkDiv flex flex-col">
          <h3 className="text-2xl font-bold">
            <span className="text-red">Red Side</span> Link:
          </h3>
          <Link
            target="_blank"
            to={`https://lowbudgetlcs.com/draft/${draftLinks.lobbyCode}/${draftLinks.redCode}`}
            className="text-xl hover:text-red transition duration-300 py-4"
          >
            https://lowbudgetlcs.com/draft/{draftLinks.lobbyCode}/
            {draftLinks.redCode}
          </Link>
        </div>
        <div className="specLinkDiv flex flex-col">
          <h3 className="text-2xl font-bold">
            <span className="text-yellow">Spectator</span> Link:
          </h3>
          <Link
            target="_blank"
            to={`https://lowbudgetlcs.com/draft/${draftLinks.lobbyCode}`}
            className="text-xl hover:text-yellow transition duration-300 py-4"
          >
            https://lowbudgetlcs.com/draft/{draftLinks.lobbyCode}
          </Link>
        </div>
      </div>
      <div onClick={copyLinks} className="button hover:cursor-pointer pb-4">
        <Button>Copy All Links</Button>
      </div>
    </div>
  );
}
export default CreateDraft;
