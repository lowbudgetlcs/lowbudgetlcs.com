import { TeamOverallStats } from "../../../types/StatTypes";

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
    <div className="sidePerformanceCard bg-gray/20 border-2 border-gray rounded-md p-4 text-white">
      <div className="sideRows mt-2 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm flex items-center gap-2">
              <div className="h-3 w-3 bg-blue rounded-xs" />
              <span>Blue Side</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60">Win Rate: {Number(blue.winrate).toFixed(0)}%</div>
              <div className="text-sm text-white/60">Games: {blue.games}</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-sm h-4">
            <div
              className="h-4 rounded-sm bg-blue"
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
            <div className="text-sm text-white/60 text-right">
              <div>Win Rate: {Number(red.winrate).toFixed(0)}%</div>
              <div>Games: {red.games}</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-sm h-4">
            <div
              className="h-4 rounded-sm bg-red"
              style={{ width: `${Math.max(0, Math.min(100, Number(red.winrate)))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePerformance;
