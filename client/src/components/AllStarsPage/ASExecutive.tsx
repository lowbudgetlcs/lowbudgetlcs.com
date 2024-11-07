function ASExecutive() {
    const color = 'bg-gradient-to-r from-challenger-blue to-challenger-gold'
    return(<div className="flex flex-col gap-4 items-center p-2 md:p-4">
        <h2 className="relative text-xl font-bold">Executive Group A <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-md ${color}`}></span></h2>
        <img className="md:w-3/4 lg:w-2/3" src='https://imgur.com/h506Hun' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://imgur.com/EjNKJgT' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://imgur.com/C1OBbcl' alt="all star team with player names"></img>
 
        <h2 className="relative text-xl font-bold">Executive Group B <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-md ${color}`}></span></h2>
        <img className="md:w-3/4 lg:w-2/3" src='https://imgur.com/m4E424u' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://imgur.com/fBAyVup' alt="all star team with player names"></img>
        <img className="md:w-3/4 lg:w-2/3" src='https://imgur.com/iOigetA' alt="all star team with player names"></img>
     </div>)
}

export default ASExecutive;
