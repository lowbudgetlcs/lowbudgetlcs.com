import coinIcon from "../assets/lblcsLogo.svg"
const LoadingIcon = () => {
  return (
    <div className="animate-spin border-2 bg-gradient-to-bl from-orange to-transparent border-orange rounded-full p-2 w-10 h-10">
        <img src={coinIcon} className="w-full h-auto"/>
    </div>
  );
};

export default LoadingIcon;
