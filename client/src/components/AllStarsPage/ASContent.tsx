import { useState } from "react";
import NavList from "../NavList";

const ASContent = ({ activeSeason }: { activeSeason: number }) => {
  const [activeLink, setActiveLink] = useState<string>("Economy");
  const toggleActive = (navItem: string) => {
    setActiveLink(navItem);
  };
  const navItems = [
    "Economy",
    "Commercial",
    "Financial",
    "Executive",
    ...(activeSeason >= 14 ? ["CEO"] : []),
  ];

  const posts = [
    {
      image: "https://i.imgur.com/m4E424u.png",
      title: "All-CEO 1st Team",
      player1Text: `@Arthur Dent (M/M) 1 as a helluva name, and it's one of the most well known in
                LBLCS. The Lane Zero top laner is known for his Gragas, but his GP and Ambessa
                terrorized teams, till showing a litany of other champs, Urgot, Camille, Yorick,
                Aurora to namea few. Dent ended the season Top 4 in CS per Minute and Damage per
                Minute, and it's no surprise seeing a strong season from one of the league's finest.`,
      player2Text: `@Seir (GM/GM) 4's known for his presence down in the bot lane, but his debut in the
                jungle was an interesting one. Despite a difficult season, the PC Divas Jungler led
                CEO in Kill Participation per Game, Kills per Game, and Damage per Minute, while
                cracking Top 10 in CS per Minute. His Kha'Zix, Naafiri, and Darius producing some of
                the most highlights. Another interesting season notched for an LBLCS legend`,
      player3Text: `@ThatsAToad (GM/M) 3 came in a monster, and maintained that moniker. Appearing Top 3
                in Damage per Minute and Top 10 in Kills per Game, Toad was part of a carry duo on
                Emperors that made teams look silly. Toad locked in 12 different champions in the
                mid lane, but visited the Hwei and Viktor most, while still whipping out his
                signature Anivia for wins when needed. A great season from a breakout mid laner.`,
      player4Text: `Another LBLCS legend and veteran slides into the bot lane here with Lane Zero's
                @Bondy (GM/GM) 4. THE Glue Eater put forth some killer performances this season,
                while not jumping off of the stat sheet, his Ezreal and Ashe were must-watch, and
                difficult to beat. All while being a consistent threat to take over any game for a
                team that had plenty of prowess and threats, which makes Bondy all that more
                difficult to handle.`,
      player5Text: `@Memersticks#NA1 (D3/D3) 6 is a man of the people and the rats, ebing a support
                player who can truly mold to the moment. On enchanters like Karma, Milio, and Lulu,
                or tanks like Naut and Braum. Even treating to a little bit if Supportlesticks in
                the Finals, Memer made things very possible on a game to game basis for a strong
                Emperors roster that was charged by his great performances.`,
    },
  ];
  return (
    <div className="ascontent pt-20 flex flex-col items-center grow text-white">
      <div className="navContainer">
        <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
      </div>
      <div className="contentContainer w-full flex flex-col gap-4 py-4 overflow-y-scroll">
        {posts.map((post) => (
          <div className="contentItem flex flex-col-reverse lg:flex-row justify-center px-8 gap-4 items-center">
            <img
              className="flex-none lg:w-[30rem] h-auto"
              src={post.image}
              alt={`the ${post.title}`}
            />
            <div className="text text-lg grow flex flex-col items-center">
              <h3 className="title text-2xl font-bold text-orange">{post.title}</h3>
              <div className="paragraphs text-sm flex flex-col gap-2 text-white/80 px-12">
                <p>{post.player1Text}</p>
                <p>{post.player2Text}</p>
                <p>{post.player3Text}</p>
                <p>{post.player4Text}</p>
                <p>{post.player5Text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ASContent;
