import { FaMinus, FaPlus } from "react-icons/fa";
import Button from "../../../../components/Button";
import RoleSelect from "./RoleSelect";
import { useState, ChangeEvent, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { IoMdClose, IoMdRefresh } from "react-icons/io";
import { useSettingsContext } from "../../providers/SettingsProvider";
import { LoadChampIcons } from "./LoadChampIcons";
import { useDraftContext } from "../../providers/DraftProvider";

const ReplaceChampPopup = () => {
  const { iconSize, setIconSize } = useSettingsContext();
  const { fixRequestData, setFixRequestData, sendFixRequest, setShowFixChampionList, showFixChampionList } = useDraftContext();
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const [replacementChampion, setReplacementChampion] = useState<string | null>(null);
  const backendIconUrl = `${import.meta.env.VITE_BACKEND_URL}/images/api/champion/`;
  useEffect(() => {
    if (showFixChampionList) {
      setSelectedRole("All");
      setSearchValue("");
      setReplacementChampion(null);
    }
  }, [showFixChampionList]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const closePopup = () => {
    setShowFixChampionList(false);
    setFixRequestData(null);
  };

  const sendRequest = () => {
    if (!fixRequestData || !replacementChampion || replacementChampion === fixRequestData.sourceChampion) {
      return;
    }

    sendFixRequest({
      ...fixRequestData,
      replacementChampion,
    });
    closePopup();
  };

  if (!showFixChampionList || !fixRequestData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-md border border-border bg-bg-light text-text-primary shadow-2xl">
        <div className="header flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <h2>Replacing: {fixRequestData.sourceChampion}</h2>
            <img src={backendIconUrl + fixRequestData.sourceChampion + "/square"} alt={fixRequestData.sourceChampion} className="h-6 w-6 bg-green" />
          </div>
          <button
            className="p-1 text-2xl text-text-secondary hover:text-text-primary cursor-pointer"
            onClick={closePopup}
            aria-label="Close replacement selector">
            <IoMdClose />
          </button>
        </div>
        {/* Search and Role Filter */}
        <div className="relative searchFilter flex justify-between items-center px-6 py-4 flex-col-reverse xl:flex-row gap-4">
          <div className="relative champFilter flex gap-4">
            <RoleSelect selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
          </div>
          <div className="flex gap-2">
            <form className="relative bg-gray flex items-center rounded-md" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="replacementChampionSearch" className="px-2">
                <IoSearch className="text-3xl" />
              </label>
              <input
                type="text"
                id="replacementChampionSearch"
                className="champSearch p-2 bg-gray focus:border-none rounded-md focus:outline-0"
                placeholder="Search Champion"
                value={searchValue}
                onChange={handleSearchChange}
              />
            </form>
            <div className="iconSizeButtons flex gap-2">
              <Button className="addButton text-xl flex items-center justify-center px-2! py-0.5!" onClick={() => setIconSize(iconSize + 10)}>
                <FaPlus />
              </Button>
              <Button className="subtractButton text-xl flex items-center justify-center px-2! py-0.5!" onClick={() => setIconSize(iconSize - 10)}>
                <FaMinus />
              </Button>
              <Button className="resetButton text-2xl flex items-center justify-center px-2! py-0.5!" onClick={() => setIconSize(60)}>
                <IoMdRefresh />
              </Button>
            </div>
          </div>
        </div>
        {/* List of Champion Images */}
        <div className="relative h-[48vh] overflow-y-scroll bg-transparent">
          <div className="relative">
            <ul className="relative champions flex flex-wrap gap-2 justify-center z-10 py-2">
              <LoadChampIcons
                searchValue={searchValue}
                selectedRole={selectedRole}
                selectedChampion={replacementChampion}
                onChampionSelected={setReplacementChampion}
              />
            </ul>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <Button onClick={closePopup}>Cancel</Button>
          <Button
            className="bg-green disabled:cursor-not-allowed disabled:opacity-50"
            onClick={sendRequest}
            disabled={!replacementChampion || replacementChampion === fixRequestData.sourceChampion}>
            Send Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReplaceChampPopup;
