import Card from "./Card";

function Summary() {
  const aboutCard = {
    title: "Amateurs Unite!",
    text: `The LowBudget LCS is a competitive, free, and friendly amateur rec
              league. We have 4 leagues that range across all skill levels. We
              provide an experience that mirrors what would happen if Riot Games
              suffered a catastrophic financial disaster. Season 13 is starting
              in the fall!`,
    link: "/about",
    btnText: "Learn More",
    image: "src/assets/summaryImg.jpg",
  };

  const twitchCard = {
    title: "Watch Games Live",
    text: `Watch matches from all brackets live on Twitch! Cheer on your
              favorite team as they win big (or int big) while interacting with
              both the casters and community. Earn all the Schmeckles you can!`,
    link: "https://www.twitch.tv/lowbudgetlcs",
    btnText: "Watch Here",
    image: "src/assets/twitchPhone.jpg",
  };

  const discordCard = {
    title: "Have a Blast with Friends",
    text: `The LBLCS is a community where players of all ranks can meet
              awesome people, play organized League of Legends, and find a
              welcome environment for just about everything! Show off your pets,
              share cool memes, and talk it up with the community!`,
    link: "https://discord.gg/lblcs",
    btnText: "Join The Discord",
    image: "src/assets/smilingGamer.jpg",
  }

  return (
    <div className="summary p-8 flex flex-col items-center -mt-28 text-white/60">
      <div className="cardContainer flex flex-col gap-16 z-10 overflow-hidden">
        <Card
          reverse={false}
          title={aboutCard.title}
          text={aboutCard.text}
          link={aboutCard.link}
          btnText={aboutCard.btnText}
          image={aboutCard.image}
        />
        <Card
          reverse
          title={twitchCard.title}
          text={twitchCard.text}
          link={twitchCard.link}
          btnText={twitchCard.btnText}
          image={twitchCard.image}
        />
        <Card
          reverse={false}
          title={discordCard.title}
          text={discordCard.text}
          link={discordCard.link}
          btnText={discordCard.btnText}
          image={discordCard.image}
        />
      </div>
    </div>
  );
}

export default Summary;
