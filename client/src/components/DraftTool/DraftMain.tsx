import { SiRedcandlegames } from "react-icons/si";
import Button from "../Button";
import { createDraftDBEntry } from "./draftHandler";
import { FormEvent } from "react";

function DraftMain() {
  const handleFormSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const blueName = formData.get('blueName') as string | null;
    const redName = formData.get('redName') as string | null;

    console.log("Blue Name: ", blueName);
    console.log("Red Name: ", redName);
    if (blueName && redName) {
      createDraftDBEntry(blueName, redName, null);
    }
  };
  return (
    <div className="text-white">
      <div className="title m-20 text-center">
        <h1 className="text-6xl text-white">Draft Tool</h1>
      </div>
      <div className="draftOptions">
        <h2 className="text-center text-2xl font-bold">Create Draft</h2>
        <form
          className="flex flex-col items-center gap-4 justify-center p-4"
          onSubmit={handleFormSubmission}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col">
              <p>Blue Team</p>
              <input
                type="text"
                placeholder="Blue Team"
                className="bg-gray/40 border-gray border-2 rounded-md p-2 text-blue"
                name="blueName"
              ></input>
            </div>
            <div className="flex flex-col">
              <p>Red Team</p>
              <input
                type="text"
                placeholder="Red Team"
                className="bg-gray/40 border-gray border-2 rounded-md p-2 text-red"
                name="redName"
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
