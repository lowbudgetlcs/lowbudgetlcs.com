import { Link } from "react-router-dom";
import Button from "../Button";

function NotDone() {
    return(
        <div className="h-[87vh] flex flex-col items-center justify-center bg-black text-white">
            <h1 className="text-6xl m-4 font-bold text-yellow">Under Construction</h1>
            <p className="text-white/50 text-lg p-2">Season has not started yet so, natually, the rosters are not available!</p>
            <p className="text-white/50 text-lg p-2">Click below to return to Home</p>
            <Link to={'/'}><Button>Home</Button></Link>
        </div>
    )
}

export default NotDone;