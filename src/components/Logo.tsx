import logo from '../assets/lblcs_logo.svg';
function Logo() {
  return (
    <div className="logo rounded-sm">
      <img src={logo} alt="logo" width={50}/>
    </div>
  );
}

export default Logo;