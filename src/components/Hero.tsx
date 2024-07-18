import video from '../assets/Coriander_Beer_Commercial.mp4'
//! Autoplay Before Uploading

function Hero() {
  return (
    <div className="hero w-full h-lvh">
        <div className="text-white heroText flex flex-col gap-6 items-center justify-center h-4/6 text-center z-[2]">
            <h1 className="text-4xl font-bold">Welcome to the Low Budget LCS</h1>
            <p className="text-lg">Competitive League of Legends for the low price of free</p>
        </div>
        <video className="heroVideo w-full h-5/6 object-cover absolute top-0 left-0 z-[-2] overflow-hidden" autoPlay muted loop><source src={video}></source> </video>
        <div className='overlay w-full h-5/6 bg-black opacity-50 absolute top-0 left-0 z-[-1]'></div>
    </div>
  );
}

export default Hero;