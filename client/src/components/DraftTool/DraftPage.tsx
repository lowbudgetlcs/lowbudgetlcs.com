import { useEffect, useState } from "react";

function DraftPage() {
  const [champImages, setChampImages] = useState<Record<string, string>>({});
  const picks = ["Ornn", "JarvinIV", "Vex", "Ashe", "Rell"];

  useEffect(() => {
    const modules = import.meta.glob("../../assets/champion/*.png");
    const images: Record<string, string> = {};

    const loadImages = async () => {
      for (const path in modules) {
        const name = path.match(/([^/]+)(?=\.\w+$)/)?.[0];
        if (name) {
          const module = (await modules[path]()) as { default: string };
          images[name] = module.default;
        }
      }
      setChampImages(images);
    };

    loadImages();
  }, []);
  console.log(champImages);
  return (
    <div className="mt-24 text-white">
      <div className="teamTitles flex justify-between">
        <div className="blueTitle p-4 bg-blue/60">
          <h2>Blue Team</h2>
        </div>
        <div className="redTitle p-4 bg-red/60">
          <h2>Red Team</h2>
        </div>
      </div>
      {/* Main Container */}
      <div className="mainDraftContainer flex  flex-1">
        {/* Blue Side Picks */}
        <div className="blueSidePicks flex flex-col gap-4 p-4">
          <div className="pick1 min-w-40 min-h-24 bg-gray"></div>
          <div className="pick2 min-w-40 min-h-24 bg-gray"></div>
          <div className="pick3 min-w-40 min-h-24 bg-gray"></div>
          <div className="space h-4"></div>
          <div className="pick4 min-w-40 min-h-24 bg-gray"></div>
          <div className="pick5 min-w-40 min-h-24 bg-gray"></div>
        </div>
        {/* Champion Pick Container */}
        <div className="championPickContainer flex flex-col ">
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
          {/* List of Champion Images */}
          <ul className="champions flex flex-wrap overflow-y-scroll max-h-[640px] p-4 gap-2 justify-center">
            {Object.entries(champImages).map(([name, src]) => {
              return (
                <li key={name}>
                  <img
                    src={src}
                    alt={name}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        {/* Red Side Picks */}
        <div className="redSidePicks flex flex-col gap-4 p-4">
          <div className="pick1 min-w-40 min-h-24 bg-gray"></div>
          <div className="pick2 min-w-40 min-h-24 bg-gray"></div>
          <div className="pick3 min-w-40 min-h-24 bg-gray"></div>
          <div className="space h-4"></div>
          <div className="pick4 min-w-40 min-h-24 bg-gray"></div>
          <div className="pick5 min-w-40 min-h-24 bg-gray"></div>
        </div>
      </div>
      {/* Champion Band and Timer */}
      <div className="champBansTimer flex w-full justify-between gap-8 items-center px-4">
        {/* Blue Side Bans */}
        <div className="blueSideBans flex justify-between items-center gap-4">
          <div className="ban1 w-20 h-40 bg-gray"></div>
          <div className="ban2 w-20 h-40 bg-gray"></div>
          <div className="ban3 w-20 h-40 bg-gray"></div>
          <div className="space w-8"></div>
          <div className="ban4 w-20 h-40 bg-gray"></div>
          <div className="ban5 w-20 h-40 bg-gray"></div>
        </div>
        {/* Ready Button */}
        <div className="Timer p-4 bg-orange max-h-16 flex items-center justify-center hover:cursor-pointer">
          Ready Up
        </div>
        {/* Red Side Bans */}
        <div className="redSideBans flex justify-between items-center gap-4">
          <div className="ban5 w-20 h-40 bg-gray"></div>
          <div className="ban4 w-20 h-40 bg-gray"></div>
          <div className="space w-8"></div>
          <div className="ban3 w-20 h-40 bg-gray"></div>
          <div className="ban2 w-20 h-40 bg-gray"></div>
          <div className="ban1 w-20 h-40 bg-gray"></div>
        </div>
      </div>
    </div>
  );
}

export default DraftPage;
