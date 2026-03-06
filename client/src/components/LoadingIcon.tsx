import coinIcon from "../assets/icons/lblcsIcon.svg";
const LoadingIcon = () => {
  return (
    <div className="animate-spin border-2 bg-linear-to-bl border-orange rounded-full w-10 h-10">
      <img src={coinIcon} className="w-full h-auto" />
    </div>
  );
};

export default LoadingIcon;
