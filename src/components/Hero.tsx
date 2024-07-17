import video from '../assets/LeagueVideoPlaceholder.webm'

function Hero() {
  return (
    <div className="hero w-full h-lvh">
        <div className="text-white heroText flex flex-col gap-6 items-center justify-center h-full text-center">
            <h1 className="text-4xl font-bold">Welcome to the Low Budget LCS</h1>
            <p className="text-lg">Non-competitive League of Legends for the low price of free</p>
        </div>
        <video className="heroVideo w-full h-full object-cover absolute top-0 left-0 z-[-1]" muted loop><source src={video}></source> </video>
        <div className='overlay w-full h-full bg-black opacity-25 absolute top-0 left-0'></div>
    </div>
  );
}

export default Hero;