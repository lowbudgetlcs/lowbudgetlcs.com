import logo from "../assets/lblcsLogo.svg";
import altLogo from "../assets/altLogo.svg";
import MainLink from "./MainLink";

function Logo({isHome, isLightMode }: {isHome: boolean; isLightMode: boolean}) {
  const toggleTop = () => {
    window.scrollTo(0, 0);
  }
  return (
    <div className="logo overflow-hidden">
      <MainLink onClick={toggleTop} to={"/"}>
        <img
          src={isHome || (!isHome && !isLightMode) ? logo : altLogo}
          alt="logo"
          width={100}
          height={100}
        />
      </MainLink>
    </div>
  );
}

export default Logo;
