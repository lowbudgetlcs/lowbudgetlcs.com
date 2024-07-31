function Twitch() {
  //! Change the parent attribute before deploying to production
  return (
    <div>
      <h2 className="text-4xl text-center font-semibold p-2">Twitch Stream</h2>

      <div className="flex justify-center items-center py-8">
        <iframe
          src="https://player.twitch.tv/?lowbudgetlcs&parent=http://localhost/anything"
          height="480"
          width="720"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default Twitch;
