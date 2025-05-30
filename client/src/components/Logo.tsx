import logo from "../assets/lblcsLogo.svg";
import MainLink from "./MainLink";

function Logo() {
  const toggleTop = () => {
    window.scrollTo(0, 0);
  }
  return (
    <div className="logo overflow-hidden">
      <MainLink onClick={toggleTop} to={"/"}>
        <img
          src={logo}
          alt="logo"
          width={140}
          height={140}
          className="dark:bg-transparent bg-black/50 rounded-lg"
        />
      </MainLink>
    </div>
  );
}

export default Logo;
