function ASCommercial() {
    const color = 'bg-gradient-to-r from-platinum-light to-platinum-dark'
    return(<div className="flex flex-col gap-8 items-center p-2 md:p-4">
        <h2 className="relative text-xl font-bold my-4">Commercial Group A <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-md ${color}`}></span></h2>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/BGQ6O4e.png' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/imlUaor.png' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/xTjghOo.png' alt="all star team with player names"></img>
 
        <h2 className="relative text-xl font-bold my-4">Commercial Group B <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-md ${color}`}></span></h2>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/MrtaWTd.png' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/t1GzCW1.png' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/SA25vpJ.png' alt="all star team with player names"></img>

        <h2 className="relative text-xl font-bold">Commercial Group C <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-md ${color}`}></span></h2>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/wz6WoIU.png' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/gN4AOwr.png' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://i.imgur.com/qNjFEJz.png' alt="all star team with player names"></img>
     </div>)
}

export default ASCommercial;
