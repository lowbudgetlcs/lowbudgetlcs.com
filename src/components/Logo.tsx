import logo from "../assets/Transparent_LBLCS_Logo_White_Text.png"
function Logo() {
  return (
    <div className="logo">
      {/* <NavLink to="#" className='text-white text-4xl font-bold'>Low Budget LCS</NavLink> */}
      <img src={logo} alt="logo" width={116} height={66}/>
    </div>
  );
}

export default Logo;