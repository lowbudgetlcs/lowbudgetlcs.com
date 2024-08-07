import Button from "./Button";

function Summary() {
  return (
    <div className="summary p-8 flex flex-col items-center">
      <div className="flex flex-col md:flex-row items-center max-w-md md:max-w-4xl min-h-72 md:h-80 overflow-hidden gap-4 rounded-lg bg-gray/40">
        <div className="w-full h-96 bg-cover bg-center text-center bg-[url('src/assets/summaryImg.jpg')] border-b-orange border-b-4 md:border-r-orange md:border-r-4"></div>
        <div className=" w-full md:w-1/2 p-2 md:p-4">
          <h2 className="text-xl text-center font-semibold p-2">
            Amateurs Unite!
          </h2>
          <p className="py-2 text-md">
            The LowBudget LCS is a competitive, free, and friendly amateur rec
            league. We have 4 leagues that range across all skill levels. We
            provide an experience that mirrors what would happen if Riot Games
            suffered a catastrophic financial disaster. Season 13 is starting in
            the fall!
          </p>
          <div className="font-semibold">
            <Button>Join The Discord</Button>
          </div>
        </div>
      </div>

      <div className="btnList grid sm:grid-cols-2 gap-2 sm:gap-8 py-2 font-bold text-4xl px-0 md:px-10 lg:px-24 xl:px-40">
        <Button>About</Button>
        <Button>Rules</Button>
        <Button>Rosters</Button>
        <Button>Stats</Button>
        <Button>Discord</Button>
        <Button>Youtube</Button>
      </div>
    </div>
  );
}

export default Summary;
