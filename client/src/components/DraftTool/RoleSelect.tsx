import topIcon from "../../assets/laneIcons/topIcon.svg";
import jungleIcon from "../../assets/laneIcons/jungleIcon.svg";
import middleIcon from "../../assets/laneIcons/middleIcon.svg";
import bottomIcon from "../../assets/laneIcons/bottomIcon.svg";
import supportIcon from "../../assets/laneIcons/supportIcon.svg";
import React, { JSX, memo } from "react";

function RoleSelect({
  selectedRole,
  setSelectedRole,
}: {
  selectedRole: string;
  setSelectedRole: React.Dispatch<React.SetStateAction<string>>;
}) {
  const roles = ["Top", "Jungle", "Mid", "Bottom", "Support"];
  const roleSelectors: JSX.Element[] = [];

  const icons: { [key: string]: string } = {
    Top: topIcon,
    Jungle: jungleIcon,
    Mid: middleIcon,
    Bottom: bottomIcon,
    Support: supportIcon,
  };

  const changeSelectedRole = (role: string) => {
    if (selectedRole === role) {
      setSelectedRole("All");
    } else {
      setSelectedRole(role);
    }
  };

  roles.forEach((role) => {
    roleSelectors.push(
      <div
        key={role}
        onClick={() => changeSelectedRole(role)}
        className={`cursor-pointer bg-none scale-125`}
      >
        <img
          src={icons[role]}
          className={`${
            selectedRole === role
              ? "drop-shadow-[0_0px_6px_orange] shadow-orange bg-transparent"
              : "opacity-60"
          }`}
        />
      </div>
    );
  });
  return <>{roleSelectors}</>;
}

export default memo(RoleSelect);
