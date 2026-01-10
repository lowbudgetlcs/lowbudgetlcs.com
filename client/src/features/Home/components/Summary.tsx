import HomeCard from "./HomeCard";
import aboutImage from "../../../assets/summaryImg.jpg";
import twitchImage from "../../../assets/twitchPhone.jpg";
import discordImage from "../../../assets/smilingGamer.jpg";
import Button from "../../../components/Button";
import AltButton from "../../../components/AltButton";

function Summary() {
  // const aboutCard = {
  //   title: "Amateurs Unite!",
  //   text: `The LowBudget LCS is a competitive, free, and friendly amateur rec
  //             league. We have multiple leagues that range across all skill levels. We
  //             provide an experience that mirrors what would happen if Riot Games
  //             suffered a catastrophic financial disaster.`,
  //   link: "/about",
  //   btnText: "About Us",
  //   image: aboutImage,
  // };

  // const twitchCard = {
  //   title: "Watch Games Live",
  //   text: `Watch matches from all brackets live on Twitch! Cheer on your
  //             favorite team as they win big (or int big) while interacting with
  //             both the casters and community. Earn all the Schmeckles you can!`,
  //   link: "https://www.twitch.tv/lowbudgetlcs",
  //   btnText: "Watch Here",
  //   image: twitchImage,
  // };

  // const discordCard = {
  //   title: "Have a Blast with Friends",
  //   text: `The LBLCS is a community where players of all ranks can meet
  //             awesome people, play organized League of Legends, and find a
  //             welcome environment for just about everything! Show off your pets,
  //             share cool memes, and talk it up with the community!`,
  //   link: "https://discord.com/invite/XfsEEq4aPC",
  //   btnText: "Join The Discord",
  //   image: discordImage,
  // };

  const slogans: { top: string; bottom: string }[] = [
    { top: "The League Where Your Mom", bottom: "Can Be Your Coach." },
    { top: "Competitive Enough to Crash Out.", bottom: "Casual Enough to Have Fun." },
    { top: "Find Your Team, Lose Your Lane,", bottom: "Keep Your Friends." },
  ];
  const slogan = slogans[Math.floor(Math.random() * slogans.length)];
  return (
    <div className="summary absolute top-0 left-0 w-full h-full grid md:grid-cols-2 gap-4 place-items-center items-center bg-linear-90 from-bg-dark to-transparent">
      <div className="titleContent flex flex-col gap-4 max-w-xl rounded-md p-6">
        <h1 className="title text-4xl text-text-primary font-bold text-center">
          {slogan.top}
          <br />
          {slogan.bottom}
        </h1>
        <p className="text-wrap text-text-secondary text-xl">
          We are a free, and friendly amateur rec league that mirrors what would
          happen if Riot Games suffered a catastrophic financial disaster
        </p>
        <div className="flex gap-4 justify-center">
          <Button className="discord">Join The Discord</Button>
          <AltButton>About Us</AltButton>
        </div>
      </div>
      <div className="Something"></div>
    </div>
  );
}

export default Summary;
