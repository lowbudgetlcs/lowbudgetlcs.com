import React from "react";

const ToggleButton = ({
  isOn,
  setFunction,
}: {
  isOn: boolean;
  setFunction: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toggle = () => {
    setFunction((prevState) => !prevState);
  };

  return (
    <label className="inline-flex items-center cursor-pointer scale-125">
      <input type="checkbox" value="" className="sr-only peer" checked={isOn} onChange={toggle} />
      <div className="relative w-11 h-6 bg-gray peer-focus:outline-hidden rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full 
      peer-checked:rtl:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5
       after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange"></div>
    </label>
  );
};

export default ToggleButton;
