import Button from "../Button";

function DraftMain() {
  return (
    <div className="text-white">
      <div className="title m-20 text-center">
        <h1 className="text-6xl text-white">Draft Tool</h1>
      </div>
      <div className="draftOptions">
        <h2 className="text-center text-2xl font-bold">Create Draft</h2>
        <form className="flex flex-col items-center gap-4 justify-center p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col">
              <p>Blue Team</p>
              <input
                type="text"
                placeholder="Blue Team"
                className="bg-gray/40 border-gray border-2 rounded-md p-2 text-blue"
              ></input>
            </div>
            <div className="flex flex-col">
              <p>Red Team</p>
              <input
                type="text"
                placeholder="Red Team"
                className="bg-gray/40 border-gray border-2 rounded-md p-2 text-red"
              ></input>
            </div>
          </div>
          <button type="submit" className="">
            <Button>Create Draft</Button>
          </button>
        </form>
      </div>
    </div>
  );
}

export default DraftMain;
