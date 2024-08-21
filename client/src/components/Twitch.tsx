const url = import.meta.env.VITE_URL || 'https://lowbudgetlcs.com/api/checklive'

function Twitch() {
  let isLive;
  const checkIfLive = async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      isLive = data.isLive
      return isLive;
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  checkIfLive();
  //! Change the parent attribute before deploying to production
  if (isLive) {
    return (
      <div>
        <h2 className="text-4xl text-center font-semibold p-2">Twitch Stream</h2>
  
        <div className="flex justify-center items-center py-8">
          <iframe
            src="https://player.twitch.tv/?channel=lowbudgetlcs&parent=localhost"
            height="480"
            width="720"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  } else {
    return
  }

}

export default Twitch;
