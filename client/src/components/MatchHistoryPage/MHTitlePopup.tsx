import { FormEvent, useEffect, useState } from "react";
import getMatch from "./getMatch";

const MHTitlePopup = () => {
  const [popupOpen, setPopupOpen] = useState<boolean>(true);
  const [isClosing, setIsClosing] = useState<boolean>(false);

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
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const matchID = formData.get("matchID") as string | null;
    if (Number.isInteger(matchID)) {
      const matchData = await getMatch(Number(matchID));
      console.log(matchData);
    } else if (!Number.isInteger(matchID) && matchID !== null) {
      console.error("Not a number", matchID);
    } else {
      console.error("Match ID is null");
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
          <p className="text-white/60 text-lg md:text-xl">
            You can find the match ID on the top right in the post-game screen
            in the client.
          </p>
          <form onSubmit={handleFormSubmission}>
            <input
              type="text"
              name="matchID"
              placeholder="Match ID"
              className="px-2 py-2 text-2xl bg-gray text-white rounded-md mt-2"
            ></input>
            <button className="py-4 px-8 m-4 bg-blue rounded-md hover:bg-orange transition duration-300 font-bold text-lg">
              Take a look
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MHTitlePopup;
