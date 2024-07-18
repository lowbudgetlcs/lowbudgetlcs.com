function Twitch() {
  return (
    <div className="flex justify-center items-center py-8">
      <iframe
        src="https://player.twitch.tv/?lowbudgetlcs&parent=lowbudgetlcs.com"
        height="480"
        width="720"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default Twitch;
