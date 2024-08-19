import video from "../assets/LBLCSHeroVideo.mp4";
import { useInView } from "react-intersection-observer";
//! Autoplay Before Uploading

function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
  });
  return (
    <div id="hero" className="hero relative w-full overflow-hidden h-[47rem]">
      <video
        ref={ref}
        className="mt-[-1.5rem] heroVideo w-full h-[47rem] object-cover absolute scale-110 lg:translate-y-8 top-0 left-0 z-[1] overflow-hidden"
        autoPlay
        muted
        loop
      >
        <source src={video}></source>
      </video>
      <div className="overlay w-full h-[16rem] bg-gradient-to-b from-transparent dark:from-transparent via-white dark:via-black dark:to-black to-[#F4F5FB] opacity-100 scale-110 absolute bottom-0 left-0 z-[2]"></div>
    </div>
  );
}

export default Hero;
