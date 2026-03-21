import { TeamOverallStats } from "../../../../types/StatTypes";

const SidePerformance = ({
  blueSidePerformance,
  redSidePerformance,
}: {
  blueSidePerformance?: TeamOverallStats["blueSidePerformance"] | null;
  redSidePerformance?: TeamOverallStats["redSidePerformance"] | null;
}) => {
  const blue = blueSidePerformance || { games: 0, wins: 0, winrate: 0 };
  const red = redSidePerformance || { games: 0, wins: 0, winrate: 0 };

  return (
    <div className="sidePerformanceCard bg-bg-light border border-border rounded-md p-4 text-text-primary">
      <div className="sideRows space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm flex items-center gap-2">
              <div className="h-3 w-3 bg-blue rounded-xs" />
              <span>Blue Side</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-secondary">Win Rate: {Number(blue.winrate).toFixed(0)}%</div>
              <div className="text-sm text-text-secondary">Games: {blue.games}</div>
            </div>
          </div>
          <div className="w-full bg-bg-dark rounded-sm h-4">
            <div
              className="h-4 rounded-sm bg-blue origin-left animate-growBar"
              style={{ width: `${Math.max(0, Math.min(100, Number(blue.winrate)))}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm flex items-center gap-2">
              <div className="h-3 w-3 bg-red rounded-xs" />
              <span>Red Side</span>
            </div>
            <div className="text-sm text-text-secondary text-right">
              <div>Win Rate: {Number(red.winrate).toFixed(0)}%</div>
              <div>Games: {red.games}</div>
            </div>
          </div>
          <div className="w-full bg-bg-dark rounded-sm h-4">
            <div
              className="h-4 rounded-sm bg-red origin-left animate-growBar"
              style={{ width: `${Math.max(0, Math.min(100, Number(red.winrate)))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePerformance;
