function ASEconomy() {
    const color = 'bg-gradient-to-r from-gold-light to-gold-dark'
    return(<div className="flex flex-col gap-4 items-center p-2 md:p-4">
        <h2 className="relative text-xl font-bold">Economy Group A <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-md ${color}`}></span></h2>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/jLTqS4p.png' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/2IN3D8p.png' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/BV6mTN2.png' alt="all star team with player names"></img>
 
        <h2 className="relative text-xl font-bold">Economy Group B <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-md ${color}`}></span></h2>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/beDIbIm.png' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/Jq8mZmU.png' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/WgOYFIS.png' alt="all star team with player names"></img>
     </div>)
}

export default ASEconomy;
