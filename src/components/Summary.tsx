import Button from "./Button";

function Summary() {
  return (
    <div className="summary p-8 flex flex-col items-center">
      <h2 className="text-4xl text-center font-semibold p-2">LBLCS</h2>
      <p className="py-2 text-xl px-0 md:px-20 lg:px-48 xl:px-80">
        The LowBudget LCS is a competitive, free, and friendly amateur rec
        league. We have 4 leagues that range across all skill levels. We provide
        an experience that mirrors what would happen if Riot Games suffered a
        catastrophic financial disaster. Season 13 is starting in the fall! Our
        Discord has update
      </p>
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
