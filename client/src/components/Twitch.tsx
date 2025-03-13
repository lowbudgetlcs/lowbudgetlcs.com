import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const url = "https://backend.lowbudgetlcs.com/api/twitch/checklive"

function Twitch() {
  const [isClosed, setIsClosed] = useState(false);
  const [isLive, setIsLive] = useState();
  const [isTopClosed, setIsTopClosed] = useState(false)
  const apiKey = process.env.VITE_BACKEND_API_KEY || "";
  
  function toggleClose() {
    setIsClosed(true);
  }

  function toggleTopClose() {
    setIsTopClosed(true)
  }
  useEffect(() => {
    const checkIfLive = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "x-api-key": apiKey,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setIsLive(data.isLive);
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };
    checkIfLive();
  }, []);

  //! Change the parent attribute before deploying to production
  if (isLive && !isClosed) {
    return (
      <div
        className={`popup fixed justify-center items-center z-50 inset-0 transition duration-1000 flex bg-black/85`}
      >
        <div onClick={toggleClose} className="absolute w-full h-full"></div>
        <div className="relative px-8 pt-12 rounded-lg w-full md:w-fit text-white bg-gray z-10">
          <h2 className="text-3xl text-center font-bold">LBLCS is Live!</h2>
          <i
            onClick={toggleClose}
            className="absolute bi bi-x-lg text-3xl hover:cursor-pointer right-5 md:right-10 top-4 md:top-8"
          ></i>
          <div className="flex justify-center w-full items-center py-8">
            <iframe
              src="https://player.twitch.tv/?channel=lowbudgetlcs&parent=lowbudgetlcs.com"
              height="576"
              width="720"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    );
  } else if (isLive && isClosed && !isTopClosed) {
    return (
      <div>
        <div className="fixed bottom-0 md:top-0 mx-auto inset-x-0 md:w-1/2 h-10 text-white bg-blue z-40 rounded-t-lg md:rounded-t-none md:rounded-b-lg flex justify-center items-center gap-2">
          <h2 className="text-md md:text-xl font-normal">We are Live on Twitch!</h2>
          <NavLink target="_blank" to={"https://www.twitch.tv/lowbudgetlcs"}>
            <h3 className="text-lg md:text-xl font-bold underline">Watch Here</h3>    
          </NavLink>
          <i
            onClick={toggleTopClose}
            className="bi bi-x-lg text-xl hover:cursor-pointer right-5 md:right-10 top-4 md:top-8"
          ></i>
        </div>
      </div>
    );
  } else {
    return;
  }
}

export default Twitch;
