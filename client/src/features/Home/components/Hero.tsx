import lblcsVideo from "../../../assets/LBLCSHeroVideo.mp4";
import corianderVideo from "../../../assets/Coriander_Beer_Commercial.mp4";
import Summary from "./Summary";

function Hero() {
  const num: number = Math.floor(Math.random() * 81);
  let video: string;
  if (num === 69) {
    video = corianderVideo;
  } else {
    video = lblcsVideo;
  }
  return (
    <div id="hero" className="hero relative w-full h-screen overflow-hidden">
      <video
        className="heroVideo absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        loop
      >
        <source src={video} type="video/mp4"></source>
      </video>
      <Summary />
    </div>
  );
}

export default Hero;
