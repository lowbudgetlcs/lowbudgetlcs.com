import { useEffect, useState } from "react";
import NavList from "../NavList";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import allStarsData, { PostProps } from "./provider/allStarsData";

const ASContent = ({ activeSeason }: { activeSeason: number }) => {
  const [activeLink, setActiveLink] = useState<string>("Economy");
  const [activePost, setActivePost] = useState<number>(0);
  const [posts, setPosts] = useState<PostProps[]>([]);
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
  useEffect(() => {
    const fetchData = async () => {
      // Show loading state if desired
      setPosts([]); 

      const response = await allStarsData(activeSeason);
      if (response) {
        setPosts(response);
        // When new data loads, reset the active post to the first one
        if (response.length > 0) {
          setActivePost(response[0].id);
        }
      }
    };

    fetchData();
  }, [activeSeason]);

  return (
    <div className="ascontent pt-20 flex flex-col items-center grow text-white">
      <div className="navContainer">
        <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
      </div>
      <div className="flex grow">
        <div className={`contentContainer w-full flex flex-col gap-4 py-4`}>
          {posts.map((post) => (
            <div
              className={`contentItem flex flex-col-reverse lg:flex-row justify-center px-8 gap-4 items-center opacity-0 grow ${
                activePost === post.id ? "animate-fadeIn" : "hidden"
              }`}>
              <img
                className="flex-none lg:w-[30rem] h-auto"
                src={post.image}
                alt={`the ${post.name}`}
              />
              <div className="text text-lg grow flex flex-col items-center">
                <h3 className="title text-2xl font-bold text-orange">{post.name}</h3>
                <div className="paragraphs text-sm xl:text-base flex flex-col gap-2 text-white/80 px-12">
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
        <div className={`gallerybtns p-4 flex flex-col items-center justify-center gap-2`}>
          <IoIosArrowUp
            className="text-4xl hover:scale-125 hover:cursor-pointer transition duration-300"
            onClick={() => setActivePost(activePost === 1 ? posts.length : activePost - 1)}
          />
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePost(post.id)}
              className={`w-4 h-4 bg-gray rounded-full hover:bg-white/80 hover:cursor-pointer transition duration-300 ${
                activePost === post.id ? "bg-white/80" : ""
              }`}></div>
          ))}
          <IoIosArrowDown
            className="text-4xl hover:scale-125 hover:cursor-pointer transition duration-300"
            onClick={() => setActivePost(activePost === posts.length ? 1 : activePost + 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default ASContent;
