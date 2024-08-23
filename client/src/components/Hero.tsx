import lblcsVideo from "../assets/LBLCSHeroVideo.mp4";
import corianderVideo from "../assets/Coriander_Beer_Commercial.mp4";

function Hero() {
  const num: number = Math.floor(Math.random() * 81);
  let video: string;
  if (num === 69) {
    video = corianderVideo;
  } else {
    video = lblcsVideo;
  }
  return (
    <div id="hero" className="hero xl:flex justify-center items-center relative w-full h-[47rem] overflow-hidden">
      <video
        className="mt-[-1.5rem] heroVideo min-w-full min-h-[40rem] lg:-mt-16 md:min-h-[47rem] object-cover scale-110 lg:translate-y-8 top-0 left-0 z-[1] "
        autoPlay
        muted
        playsInline
        loop
      >
        <source src={video} type="video/mp4"></source>
      </video>
      <div className="overlay w-full h-[22rem] md:h-[16rem] bg-gradient-to-b from-transparent dark:from-transparent via-white dark:via-black dark:to-black to-[#F4F5FB] opacity-100 scale-110 absolute bottom-0 left-0 z-[2]"></div>
      <div className="hidden md:block overlay w-[10rem] h-full bg-gradient-to-l from-transparent dark:from-transparent via-white dark:via-black dark:to-black to-[#F4F5FB] opacity-100 scale-110 absolute top-0 left-0 z-[2]"></div>
      <div className="hidden md:block overlay w-[10rem] h-full bg-gradient-to-r from-transparent dark:from-transparent via-white dark:via-black dark:to-black to-[#F4F5FB] opacity-100 scale-110 absolute top-0 right-0 z-[2]"></div>
    </div>
  );
}

export default Hero;
