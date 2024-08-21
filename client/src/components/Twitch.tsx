import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const url =
  import.meta.env.VITE_URL || "http://localhost:8080/api/checklive";

function Twitch() {
  const [isClosed, setIsClosed] = useState(false);
  const [isLive, setIsLive] = useState();

  function toggleClose() {
    setIsClosed(!isClosed);
  }
  useEffect(() => {
    const checkIfLive = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
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
        <div className="relative px-8 pt-12 rounded-lg bg-gray z-10">
          <h2 className="text-3xl text-center font-bold">LBLCS is Live!</h2>
          <i
            onClick={toggleClose}
            className="absolute bi bi-x-lg text-3xl hover:cursor-pointer right-10 top-8"
          ></i>
          <div className="flex justify-center items-center py-8">
            <iframe
              src="https://player.twitch.tv/?channel=lowbudgetlcs&parent=localhost"
              height="480"
              width="720"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    );
  } else if (isLive && isClosed) {
    return (
      <div>
        <div className="fixed mx-auto inset-x-0 w-1/3 h-10 bg-blue z-40 rounded-b-lg flex justify-center items-center gap-2">
          <h2 className="text-xl font-normal">We are Live!</h2>
          <NavLink target="_blank" to={"https://www.twitch.tv/lowbudgetlcs"}>
            <h3 className="text-xl font-bold underline">Watch Here</h3>
          </NavLink>
        </div>
      </div>
    );
  } else {
    return;
  }
}

export default Twitch;
