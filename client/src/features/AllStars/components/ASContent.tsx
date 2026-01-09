import { useEffect, useState } from "react";
import NavList from "../../../components/NavList";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import allStarsData, { PostProps } from "../api/allStarsData";

const ASContent = ({ activeSeason }: { activeSeason: number }) => {
  const [activeLink, setActiveLink] = useState<string>("Economy");
  const [activePost, setActivePost] = useState<number | undefined>();
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<PostProps[]>([]);
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
      const response = await allStarsData(activeSeason);
      if (response) {
        response.sort((a, b) => a.id - b.id);
        setPosts(response);
      }
    };

    fetchData();
  }, [activeSeason]);

  useEffect(() => {
    const divisionPosts: PostProps[] = posts.filter((post) => post.division === activeLink);
    setSelectedPosts(divisionPosts);

    if (divisionPosts.length > 0) {
      setActivePost(divisionPosts[0].id);
    } else {
      setActivePost(undefined);
    }
  }, [activeLink, posts]);

  const activePostIndex = selectedPosts.findIndex((post) => post.id === activePost);

  const showPreviousPost = () => {
    if (selectedPosts.length < 2) return;
    const prevIndex = activePostIndex === 0 ? selectedPosts.length - 1 : activePostIndex - 1;
    setActivePost(selectedPosts[prevIndex].id);
  };

  const showNextPost = () => {
    if (selectedPosts.length < 2) return;
    const nextIndex = activePostIndex === selectedPosts.length - 1 ? 0 : activePostIndex + 1;
    setActivePost(selectedPosts[nextIndex].id);
  };

  return (
    <div className="ascontent md:pt-20 flex flex-col items-center grow text-white animate-fadeIn opacity-0 [animation-delay:800ms]">
      <div className="navContainer flex">
        <NavList activeLink={activeLink} toggleActive={toggleActive} navItems={navItems} />
      </div>
      <div className="flex grow flex-col-reverse md:flex-row">
        <div className={`contentContainer w-full flex flex-col gap-4 py-4`}>
          {selectedPosts.map((post) => (
            <div
              key={post.id}
              className={`contentItem flex flex-col-reverse xl:flex-row justify-center px-8 gap-4 items-center opacity-0 grow ${
                activePost === post.id ? "animate-fadeIn" : "hidden"
              }`}>
              <img
                className="flex-none lg:w-136 xxl:w-3xl h-auto"
                src={post.image}
                alt={`the ${post.name}`}
              />
              <div className="text text-lg grow flex flex-col items-center">
                <h3 className="title text-2xl font-bold text-orange">{post.name}</h3>
                <div className="paragraphs text-sm md:text-xs lg:text-sm xxl:text-base flex flex-col gap-2 text-white/80 xl:px-12">
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
        {selectedPosts.length > 0 && (
          <div className={`gallerybtns p-4 flex md:flex-col items-center justify-center gap-2`}>
            <IoIosArrowUp
              className="text-4xl hover:text-orange hover:scale-125 hover:cursor-pointer transition duration-300 -rotate-90 md:rotate-0"
              onClick={showPreviousPost}
            />
            {selectedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActivePost(post.id)}
                className={`w-3 h-3 md:w-4 md:h-4 bg-gray rounded-full hover:bg-white/80 hover:cursor-pointer transition-all duration-300 ${
                  activePost === post.id ? "bg-white/80 scale-125" : ""
                }`}></div>
            ))}
            <IoIosArrowDown
              className="text-4xl hover:text-orange hover:scale-125 hover:cursor-pointer transition duration-300 -rotate-90 md:rotate-0"
              onClick={showNextPost}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ASContent;
