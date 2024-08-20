function Twitch() {
  // const username: string = "lowbudgetlcs";
  // async function checkIfLive(username: string) {
  //   try {
  //     const response = await fetch(`https://twitch.tv/${username}&parent=lowbudgetlcs.com`);
  //     const sourceCode = await response.text();

  //     if (sourceCode.includes("isLiveBroadcast")) {
  //       console.log(`${username} is live`);
  //     } else {
  //       console.log(`${username} is not live`);
  //     }
  //   } catch (error) {
  //     console.log("Error occurred:", error);
  //   }
  // }

  // checkIfLive(username);
  //! Change the parent attribute before deploying to production
  return (
    <div>
      <h2 className="text-4xl text-center font-semibold p-2">Twitch Stream</h2>

      <div className="flex justify-center items-center py-8">
        <iframe
          src="https://player.twitch.tv/?channel=lowbudgetlcs&parent=lowbudgetlcs.com"
          height="480"
          width="720"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default Twitch;
