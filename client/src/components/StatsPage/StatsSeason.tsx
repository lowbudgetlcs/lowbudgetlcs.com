import Button from "../Button";
import { Link } from "react-router-dom";

// When database is updated this will be used to map all seasons.
// Currently the database is set up per-season (Currently season 14)
function StatsSeason() {
  return (
    <>
      <div className="seasonList flex flex-col justify-center items-center py-4 text-center">
        <h2 className="text-center text-2xl font-bold p-4">Choose a Season</h2>
        <div className="flex flex-row items-center flex-wrap justify-center gap-4">
          {/* <Link to={"13"} className="cursor-pointer">
            <Button>
              Season 13
              <br />
              <span>Fall 2024</span>
            </Button>
          </Link> */}
          <Link to={"14"} className="cursor-pointer">
            <Button>
              Season 14
              <br />
              <span>Winter 2025</span>
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default StatsSeason;
