import { FormEvent, useEffect, useState } from "react";
import getMatch from "./getMatch";
import { useSessionStorageState } from "../../hooks/useSessionStorageState";

const MHTitlePopup = () => {
  const [popupOpen, setPopupOpen] = useState<boolean>(true);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [fetchErr, setFetchErr] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionMatchData, setSessionMatchData] = useSessionStorageState("matchData", {});
  useEffect(() => {
    let timer: number;
    if (isClosing) {
      timer = setTimeout(() => {
        setPopupOpen(false);
        setIsClosing(false);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [isClosing]);

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFetchErr(false);
    setErrMessage("");
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const matchID = formData.get("matchID") as string | null;
    if (matchID && Number.isInteger(Number(matchID))) {
      const matchData = await getMatch(Number(matchID));
      if (matchData === 404) {
        setFetchErr(true);
        setLoading(false);
        setErrMessage("Match not found");
      } else if (matchData === 500) {
        setFetchErr(true);
        setLoading(false);
        setErrMessage("Internal Server error. Try reloading the page.");
      }
      // Successful
      console.log(matchData);
      setSessionMatchData(matchData);
      setLoading(false);
    } else if (matchID && matchID.length !== 0) {
      setFetchErr(true);
      setLoading(false);
      setErrMessage("Match ID must be a number");
    } else {
      setFetchErr(true);
      setLoading(false);
      setErrMessage("Match ID is required");
    }
  };

  return (
    <>
      {/* Title Popup */}
      <div
        className={`mhpopup absolute w-screen h-screen bg-black bg-opacity-95 flex flex-col md:flex-row justify-around items-center p-2 sm:p-12 md:gap-12 transition duration-500 text-white ${
          popupOpen ? "" : "hidden"
        } ${isClosing ? "opacity-0" : ""}`}
      >
        <h1 className="text-6xl lg:text-7xl text-nowrap text-center font-bold opacity-0 [animation-delay:100ms] animate-slide-in-right">
          Match History
        </h1>
        <div className="flex flex-col items-center md:w-1/2 xl:w-1/3 opacity-0 [animation-delay:500ms] animate-slide-in-left">
          <p className="summary text-lg md:text-xl">
            Search up your match history!
          </p>
          <p className="text-orange text-lg md:text-xl pt-4 pb-4">
            Just enter in your Match ID below to search
          </p>
          <p className="text-white/60 text-lg md:text-xl text-center">
            You can find the match ID on the top right in the post-game screen
            in the client.
          </p>
          <div className="flex flex-col">
            <form className="text-center" onSubmit={handleFormSubmission}>
              <input
                type="text"
                name="matchID"
                placeholder="Match ID"
                className="px-2 py-2 text-2xl bg-gray text-white rounded-md mt-2"
              ></input>
              <button
                className={`py-4 px-8 m-4 ${
                  loading ? "bg-gray hover:bg-gray" : "bg-blue hover:bg-orange"
                } rounded-md transition duration-300 font-bold text-lg`}
                disabled={loading}
              >
                {loading ? "Loading..." : "Take a look"}
              </button>
            </form>
            <p
              className={`text-red text-center ${fetchErr ? "" : "opacity-0"}`}
            >
              Error: {errMessage}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MHTitlePopup;
