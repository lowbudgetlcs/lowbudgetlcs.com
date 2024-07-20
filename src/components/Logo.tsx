import { NavLink } from "react-router-dom";
function Logo() {
  return (
    <div className="logo">
      <NavLink to="#" className='text-white text-4xl font-bold'>Low Budget LCS</NavLink>
      {/* <img src={logo} alt="logo" width={116} height={66}/> */}
    </div>
  );
}

export default Logo;