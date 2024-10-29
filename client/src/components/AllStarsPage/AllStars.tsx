function AllStars() {
  return (
    <div className="allstars bg-white text-black dark:bg-black dark:text-white font-serif">
      <div className="title h-64 w-full flex items-center justify-center">
        <h1 className="text-6xl">All Stars</h1>
      </div>
      <div className="flex flex-col items-center pb-8">
        <p className="summary text-lg md:text-xl px-16 w-full md:w-2/3 pt-8  ">
          After Every LBLCS season, each team votes for players on who is the
          best in their role. We then take those results and smash all these
          stars into teams of their own and make them compete for charity!
        </p>
        <p className=" text-xl pt-4 pb-4">
          All proceeds gained from the stream go to the charity announced in
          discord. Please donate to help the cause!
        </p>
        <p className="text-white/60 text-lg">
          The 1st all-star teams play in the event. If people are not available,
          2nd and 3rd team members are asked to fill in.
        </p>
      </div>
      <div className="cardContainer">
        <div className="firstTeams text-3xl font-bold text-orange text-center py-32">Teams Announced Soon</div>
      </div>
    </div>
  );
}

export default AllStars;
