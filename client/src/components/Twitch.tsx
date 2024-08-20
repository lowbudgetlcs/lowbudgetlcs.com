
function Twitch() {
const twitchKey = import.meta.env.VITE_TWITCH_CLIENT
const authToken = import.meta.env.VITE_TWITCH_AUTH

  async function checkIfLive() {
    try {
      const headers = {
        "Client-Id": twitchKey,
        "Authorization": `Bearer ${authToken}`
    };
      const response = await fetch(`https://api.twitch.tv/helix/streams&user_login=lowbudgetlcs`, {
        method: 'GET',
        headers});
      const data = await response.json();
      console.log(data)

    } catch (error) {
      console.log("Error occurred:", error);
    }
  }

  checkIfLive();
  //! Change the parent attribute before deploying to production
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
}

export default Twitch;
