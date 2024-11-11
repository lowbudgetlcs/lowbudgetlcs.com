import { useLocation } from "react-router-dom";

function StatsPlayer() {
    const {gameData} = useLocation().state;
    const games = gameData
    console.log(gameData)
    return (<div>eee</div>)
}

export default StatsPlayer;