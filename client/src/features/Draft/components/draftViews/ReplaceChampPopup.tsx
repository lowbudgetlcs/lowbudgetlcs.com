import { FaMinus, FaPlus } from "react-icons/fa";
import Button from "../../../../components/Button";
import RoleSelect from "./RoleSelect";
import { useState, ChangeEvent } from "react";
import { IoSearch } from "react-icons/io5";
import { IoMdRefresh } from "react-icons/io";
import { useSettingsContext } from "../../providers/SettingsProvider";
import { LoadChampIcons } from "./LoadChampIcons";

const ReplaceChampPopup = () => {
  const { champIconsVisible, iconSize, setIconSize } = useSettingsContext();
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  return (
    <div>
      <div className="header">
        <h2>Choose a champion to replace</h2>
      </div>
      {/* Search and Role Filter */}
      <div className={`relative searchFilter flex justify-between items-center px-6 py-4 flex-col-reverse xl:flex-row gap-4`}>
        <div className="relative champFilter flex gap-4">
          <RoleSelect selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
        </div>
        <div className="flex gap-2">
          <form className="relative bg-gray flex items-center rounded-md">
            <label htmlFor="championSearch" className="px-2">
              <IoSearch className="text-3xl" />
            </label>
            <input
              type="text"
              id="championSearch"
              className="champSearch p-2 bg-gray focus:border-none rounded-md focus:outline-0"
              placeholder="Search Champion"
              value={searchValue}
              onChange={handleSearchChange}></input>
          </form>
          <div className={`iconSizeButtons flex gap-2 ${champIconsVisible ? "" : "hidden"}`}>
            <Button className={`addButton text-xl flex items-center justify-center px-2! py-0.5!`} onClick={() => setIconSize(iconSize + 10)}>
              <FaPlus />
            </Button>
            <Button className={`subtractButton text-xl flex items-center justify-center px-2! py-0.5!`} onClick={() => setIconSize(iconSize - 10)}>
              <FaMinus />
            </Button>
            <Button className={`resetButton text-2xl flex items-center justify-center px-2! py-0.5!`} onClick={() => setIconSize(60)}>
              <IoMdRefresh />
            </Button>
          </div>
        </div>
      </div>
      {/* List of Champion Images */}
      <div className={`relative overflow-y-scroll h-full bg-transparent ${champIconsVisible ? "" : "hidden"}`}>
        <div className="relative">
          <ul className="relative champions flex flex-wrap gap-2 justify-center z-10 py-2 transition-height duration-300">
            <LoadChampIcons searchValue={searchValue} selectedRole={selectedRole} />
          </ul>
        </div>
      </div>
    </div>
  );
};
