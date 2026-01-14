import { useSessionStorageState } from "../../hooks/useSessionStorageState";
import Button from "../../components/Button";
import NavList from "../../layout/NavList";
import { createDraft } from "./api/createDraft";
import { checkTournamentCode, DraftCodeProps } from "./socket/draftHandler";
import { FormEvent, useState } from "react";
import DraftCodes from "./pages/Create/DraftCodes";
import createFearlessDraft from "./api/createFearlessDraft";
import FearlessLinks from "./pages/Create/FearlessLinks";
import { redirect } from "react-router-dom";
import { DraftLinkProps, FearlessInitializerProps } from "./interfaces/draftInterfaces";
import Footer from "../../layout/Footer";
import Updates from "./components/Updates";

function Draft() {
  const [draftLinks, setDraftLinks] = useSessionStorageState<DraftLinkProps | undefined>(
    "draftLinks",
    undefined
  );
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
    // const draftType = formData.get("draftType") as string | null;

    try {
      if (activeLink === "LBLCS Tournament") {
        const tournamentID = formData.get("tournamentID") as string | null;
        const team1Name = (formData.get("team1Name") as string | null) || "Team 1";
        const team2Name = (formData.get("team2Name") as string | null) || "Team 2";

        if (!tournamentID) {
          console.error("Tournament ID is missing despite being required.");
          return;
        }

        const isTournamentValid = await checkTournamentCode(tournamentID);
        if (!isTournamentValid) {
          setHasBadCode(true);
          return;
        }

        const fearlessData = await createFearlessDraft(
          team1Name,
          team2Name,
          draftCount,
          tournamentID
        );
        if (!fearlessData) {
          redirect("/error", 500);
          return;
        }
        setFearlessDraftLinks(fearlessData);
      } else if (activeLink === "Fearless Draft") {
        const team1Name = (formData.get("team1Name") as string | null) || "Team 1";
        const team2Name = (formData.get("team2Name") as string | null) || "Team 2";
        const fearlessData = await createFearlessDraft(team1Name, team2Name, draftCount, null);
        if (!fearlessData) {
          redirect("/error", 500);
          return;
        }
        setFearlessDraftLinks(fearlessData);
      } else {
        const blueName = (formData.get("blueName") as string | null) || "Blue Team";
        const redName = (formData.get("redName") as string | null) || "Red Team";
        // Create draft. This will send to the database if their is a tournament code
        // otherwise it will just create a draft state (record) on the server that will expire after a set amount of time
        const draftResult: DraftCodeProps = await createDraft(blueName, redName, null);

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
    <div className="bg-bg-dark light:bg-bg-light text-text-primary min-h-screen flex flex-col pt-20 pb-8">
      <div className="grow w-full max-w-7xl mx-auto px-4 sm:px-6">
        {draftLinks ? (
          <DraftCodes draftLinks={draftLinks} setDraftLinks={setDraftLinks} />
        ) : fearlessDraftLinks ? (
          <FearlessLinks
            fearlessDraftLinks={fearlessDraftLinks}
            setFearlessDraftLinks={setFearlessDraftLinks}
          />
        ) : (
          <>
            <div className="mb-12">
              <h1 className="text-5xl font-bold tracking-tight mb-4 text-text-primary">Draft Tool</h1>
              <div className="h-1 w-24 bg-primary-light rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-bg rounded-xl shadow-2xl border border-text-primary/10 overflow-hidden">
                  <div className="p-6 sm:p-8 bg-bg border-b border-text-primary/10">
                    <h2 className="text-2xl font-bold text-center mb-6">Create Draft</h2>
                    <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} grow />
                  </div>
                  
                  <div className="p-6 sm:p-8">
                    {activeLink === "Default Draft" ? (
                      <form
                        className="flex flex-col items-center gap-6"
                        onSubmit={handleFormSubmission}>
                        <div className="flex flex-col sm:flex-row gap-6 w-full">
                          <div className="flex flex-col w-full">
                            <p className="mb-2 font-semibold">Blue Side</p>
                            <input
                              type="text"
                              placeholder="Blue Team"
                              className="bg-bg-light border border-text-primary/10 rounded-lg p-3 text-blue focus:ring-2 focus:ring-blue/50 outline-none transition-all w-full"
                              name="blueName"
                              maxLength={28}
                            />
                          </div>
                          <div className="flex flex-col w-full">
                            <p className="mb-2 font-semibold">Red Side</p>
                            <input
                              type="text"
                              placeholder="Red Team"
                              className="bg-bg-light border border-text-primary/10 rounded-lg p-3 text-red focus:ring-2 focus:ring-red/50 outline-none transition-all w-full"
                              name="redName"
                              maxLength={28}
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full sm:w-auto px-12 py-3 mt-2">Create Draft</Button>
                      </form>
                    ) : activeLink === "LBLCS Tournament" ? (
                      <form
                        className="flex flex-col items-center gap-6"
                        onSubmit={handleFormSubmission}>
                        <input type="hidden" name="draftType" value="Tournament"></input>
                        
                        <div className="w-full">
                          <p className="mb-2 font-semibold">Draft Count</p>
                          <select
                            name="draftAmount"
                            className="bg-bg-light border border-text-primary/10 rounded-lg p-3 w-full cursor-pointer focus:ring-2 focus:ring-primary-light outline-none"
                            onChange={(e) => setDraftCount(Number(e.target.value))}
                            defaultValue={3}>
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} className="bg-bg-dark" value={num}>{num}</option>
                            ))}
                          </select>
                        </div>

                        <div className="w-full">
                          <p className="mb-2 font-semibold">
                            <span className="text-red mr-1">*</span>Tournament Code
                          </p>
                          <input
                            type="text"
                            placeholder="Tournament Code"
                            className={`bg-bg-light border ${hasBadCode ? 'border-red' : 'border-text-primary/10'} rounded-lg p-3 text-orange focus:ring-2 focus:ring-orange/50 outline-none transition-all w-full`}
                            name="tournamentID"
                            required
                          />
                           <p className={`${hasBadCode ? "" : "opacity-0"} text-sm text-red mt-1`}>
                            Invalid Tournament Code!
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 w-full">
                          <div className="flex flex-col w-full">
                            <p className="mb-2 font-semibold">Team 1 Name</p>
                            <input
                              type="text"
                              placeholder="Team 1"
                              className="bg-bg-light border border-text-primary/10 rounded-lg p-3 text-orange focus:ring-2 focus:ring-orange/50 outline-none transition-all w-full"
                              name="team1Name"
                              maxLength={18}
                            />
                          </div>
                          <div className="flex flex-col w-full">
                            <p className="mb-2 font-semibold">Team 2 Name</p>
                            <input
                              type="text"
                              placeholder="Team 2"
                              className="bg-bg-light border border-text-primary/10 rounded-lg p-3 text-orange focus:ring-2 focus:ring-orange/50 outline-none transition-all w-full"
                              name="team2Name"
                              maxLength={18}
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full sm:w-auto px-12 py-3 mt-2">Create Draft</Button>
                      </form>
                    ) : activeLink === "Fearless Draft" ? (
                      <form
                        className="flex flex-col items-center gap-6"
                        onSubmit={handleFormSubmission}>
                         <div className="bg-orange/10 border border-orange/20 rounded-lg p-3 text-center w-full">
                            <p className="text-orange">
                            Currently in Beta. DM <span className="text-green font-bold">@thyduckylord</span> on Discord with bugs
                            </p>
                        </div>
                        <input type="hidden" name="draftType" value="Fearless"></input>
                        
                         <div className="w-full">
                          <p className="mb-2 font-semibold">Draft Count</p>
                          <select
                            name="draftAmount"
                            className="bg-bg-light border border-text-primary/10 rounded-lg p-3 w-full cursor-pointer focus:ring-2 focus:ring-primary-light outline-none"
                            onChange={(e) => setDraftCount(Number(e.target.value))}
                            defaultValue={3}>
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} className="bg-bg-dark" value={num}>{num}</option>
                            ))}
                          </select>
                        </div>

                         <div className="flex flex-col sm:flex-row gap-6 w-full">
                          <div className="flex flex-col w-full">
                            <p className="mb-2 font-semibold">Team 1 Name</p>
                            <input
                              type="text"
                              placeholder="Team 1"
                              className="bg-bg-light border border-text-primary/10 rounded-lg p-3 text-orange focus:ring-2 focus:ring-orange/50 outline-none transition-all w-full"
                              name="team1Name"
                              maxLength={18}
                            />
                          </div>
                          <div className="flex flex-col w-full">
                            <p className="mb-2 font-semibold">Team 2 Name</p>
                            <input
                              type="text"
                              placeholder="Team 2"
                              className="bg-bg-light border border-text-primary/10 rounded-lg p-3 text-orange focus:ring-2 focus:ring-orange/50 outline-none transition-all w-full"
                              name="team2Name"
                              maxLength={18}
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full sm:w-auto px-12 py-3 mt-2">Create Draft</Button>
                      </form>
                    ) : null}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1 h-full">
                 <Updates />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

export default Draft;
