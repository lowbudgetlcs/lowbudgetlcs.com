import logo from '../assets/lblcsLogo.svg';
function Logo() {
  return (
    <div className="logo rounded-sm">
      <img src={logo} alt="logo" width={80}/>
    </div>
  );
}

export default Logo;