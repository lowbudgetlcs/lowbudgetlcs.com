import { useSessionStorageState } from "../../hooks/useSessionStorageState";
import Button from "../Button";
import NavList from "../NavList";
import { createDraft } from "./createDraft";
import { checkTournamentCode, DraftCodeProps } from "./draftHandler";
import { FormEvent, useState } from "react";
import { DraftLinkProps } from "./draftInterfaces";
import DraftCodes from "./DraftCodes";
import createFearlessDraft from "./createFearlessDraft";
import { FearlessInitializerProps } from "./interfaces/draftInterfaces";
import FearlessLinks from "./draftCreation/FearlessLinks";
import { redirect } from "react-router-dom";

function CreateDraft() {
  const [draftLinks, setDraftLinks] = useSessionStorageState<
    DraftLinkProps | undefined
  >("draftLinks", undefined);
  const [fearlessDraftLinks, setFearlessDraftLinks] = useSessionStorageState<
    FearlessInitializerProps | undefined
  >("fearlessDraftLinks", undefined);
  const [hasBadCode, setHasBadCode] = useState<boolean>(false);
  const [draftCount, setDraftCount] = useState<number>(3);
  // Required variables for Nav List
  const [activeLink, setActiveLink] = useState<string>("Default Draft");
  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };
  const navItems = ["Default Draft", "LBLCS Tournament", "Fearless Draft"];

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Team names and tournament code from /draft form
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const draftType = formData.get("draftType") as string | null;
    const tournamentID = formData.get("tournamentID") as string | null;
    let blueName = (formData.get("blueName") as string | null) || "Blue Team";
    let redName = (formData.get("redName") as string | null) || "Red Team";
    let team1Name = (formData.get("team1Name") as string | null) || "Team 1";
    let team2Name = (formData.get("team2Name") as string | null) || "Team 2";
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

      if (draftType === "Fearless") {
        // Create draft. This will send to the database
        //Creates 1 - 5 drafts
        const fearlessData = await createFearlessDraft(
          team1Name,
          team2Name,
          draftCount
        );
        if (!fearlessData) {
          redirect("/error", 500);
          return;
        }
        setFearlessDraftLinks(fearlessData);
      } else {
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
      }
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
      ) : fearlessDraftLinks ? (
        <FearlessLinks
          fearlessDraftLinks={fearlessDraftLinks}
          setFearlessDraftLinks={setFearlessDraftLinks}
        />
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
                  <p className="text-xl font-bold">Blue Side</p>
                  <input
                    type="text"
                    placeholder="Blue Team"
                    className="bg-gray/40 border-gray border-2 rounded-md p-2 text-blue"
                    name="blueName"
                    maxLength={18}
                  ></input>
                </div>
                <div className="flex flex-col">
                  <p className="text-xl font-bold">Red Side</p>
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
                  <p className="text-xl font-bold">Blue Side</p>
                  <input
                    type="text"
                    placeholder="Blue Team"
                    className="bg-gray/40 border-gray border-2 rounded-md p-2 text-blue"
                    name="blueName"
                  ></input>
                </div>
                <div className="flex flex-col">
                  <p className="text-xl font-bold">Red Side</p>
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
              <p className="text-orange text-center px-4">
                Currently in Beta. DM{" "}
                <span className="text-green">@thyduckylord</span> on Discord
                with bugs
              </p>
              <input type="hidden" name="draftType" value="Fearless"></input>
              <div className="flex flex-col">
                <p className="text-xl font-bold">Draft Count</p>
                <select
                  name="draftAmount"
                  className="bg-gray/60 border-2 border-gray text-white text-sm rounded-md focus:ring-gray focus:border-orange block w-full p-2.5 cursor-pointer"
                  onChange={(e) => setDraftCount(Number(e.target.value))}
                  defaultValue={3}
                >
                  <option className={`bg-gray`} value={1}>
                    1
                  </option>
                  <option className={`bg-gray`} value={2}>
                    2
                  </option>
                  <option className={`bg-gray`} value={3}>
                    3
                  </option>
                  <option className={`bg-gray`} value={4}>
                    4
                  </option>
                  <option className={`bg-gray`} value={5}>
                    5
                  </option>
                </select>
              </div>
              <p className="opacity-0 hover:cursor-default">
                LaChance Licks Toes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex flex-col">
                  <p className="text-xl font-bold">Team 1 Name</p>
                  <input
                    type="text"
                    placeholder="Team 1"
                    className="bg-gray/40 border-gray border-2 rounded-md p-2 text-orange"
                    name="team1Name"
                    maxLength={18}
                  ></input>
                </div>
                <div className="flex flex-col">
                  <p className="text-xl font-bold">Team 2 Name</p>
                  <input
                    type="text"
                    placeholder="Team 2"
                    className="bg-gray/40 border-gray border-2 rounded-md p-2 text-orange"
                    name="team2Name"
                    maxLength={18}
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

export default CreateDraft;
