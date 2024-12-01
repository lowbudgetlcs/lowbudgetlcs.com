import { Link } from "react-router-dom";
import Button from "../Button";

function StatsTeam() {
  return (
    <div className="seasonList flex flex-col justify-center items-center py-4 text-center">
      <h2 className="text-center text-2xl font-bold p-4">Choose a Season</h2>
      <Link to={"s13"}>
        <Button>
          Season 13
          <br />
          <span>Summer/Fall 2024</span>
        </Button>
      </Link>
    </div>
  );
}

export default StatsTeam;
