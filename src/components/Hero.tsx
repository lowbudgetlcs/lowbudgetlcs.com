import video from '../assets/LBLCSHeroVideo.mp4'
//! Autoplay Before Uploading

function Hero() {
  return (
    <div className="hero w-full h-47">
        <video className="heroVideo w-full h-47 object-cover absolute scale-110 top-0 left-0 z-[1] overflow-hidden" autoPlay muted loop><source src={video}></source> </video>
        <div className='overlay w-full h-47 bg-gradient-radial opacity-100 scale-110 absolute top-0 left-0 z-[2]'></div>
    </div>
  );
}

export default Hero;