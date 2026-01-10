import lblcsVideo from "../../../assets/LBLCSHeroVideo.mp4";
import corianderVideo from "../../../assets/Coriander_Beer_Commercial.mp4";

function Hero() {
  const num: number = Math.floor(Math.random() * 81);
  let video: string;
  if (num === 69) {
    video = corianderVideo;
  } else {
    video = lblcsVideo;
  }
  return (
    <div id="hero" className="hero xl:flex justify-center items-center relative w-screen h-screen overflow-hidden">
      <video
        className="-mt-6 heroVideo min-w-full min-h-160 lg:-mt-16 md:min-h-188 object-cover scale-125 lg:translate-y-8 top-0 left-0 z-1 "
        autoPlay
        muted
        playsInline
        loop
      >
        <source src={video} type="video/mp4"></source>
      </video>
      <div className="overlay w-full h-full bg-radial from-transparent via-transparent to-bg-dark absolute top-0 left-0 z-2"></div>
    </div>
  );
}

export default Hero;
