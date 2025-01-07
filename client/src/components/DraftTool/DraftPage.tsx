function DraftPage() {
  return (
    <>
      <div className="teamTitles flex justify-between">
        <div className="blueTitle p-4 bg-blue/60">
          <h2>Blue Team</h2>
        </div>
        <div className="redTitle p-4 bg-red/60">
          <h2>Red Team</h2>
        </div>
        {/* Main Container */}
        <div className="mainDraftContainer flex">
          {/* Blue Side Picks */}
          <div className="blueSidePicks flex flex-col"></div>
          {/* Champion Pick Container */}
          <div className="championPickContainer flex flex-col">
            <div className="searchFilter flex justify-between">
              <div className="champFilter flex gap-2"></div>
              <form>
                <input
                  type="text"
                  className="champSearch bg-gray"
                  placeholder="Search Champion"
                ></input>
              </form>
            </div>
          </div>
          {/* Red Side Picks */}
          <div className="redSidePicks flex flex-col"></div>
        </div>
        {/* Champion Band and Timer */}
        <div className="champBansTimer flex justify-between gap-4">
            {/* Blue Side Bans */}
            <div className="blueSideBans flex gap-2"></div>
            <div className="Timer p-4 bg-orange">30</div>
            <div className="redSideBans flex gap-2"></div>
        </div>
      </div>
    </>
  );
}

export default DraftPage;
