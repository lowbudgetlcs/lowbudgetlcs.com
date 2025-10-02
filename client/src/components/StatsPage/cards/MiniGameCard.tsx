import { RecentGame } from "../../../types/StatTypes";

const MiniGameCard = ({ key, game }: { key: number; game: RecentGame }) => {
  const { teams: team1Stats } = game.teams[0];
  const { teams: team2Stats } = game.teams[1];
  if (!team1Stats || !team2Stats) return null;
  const timeSinceGamePlayed = BigInt(Date.now()) - game.gameEndTimeStamp;
  const gameDuration = game.gameEndTimeStamp - game.gameStartTimeStamp;
  return (
    <div
      key={key}
      className="flex flex-col items-center justify-center bg-light-gray rounded-md p-4 w-full max-w-sm">
      <h3 className="text-xl font-bold">
        {team1Stats.teamName} vs. {team2Stats.teamName}
      </h3>
      <p className="text-lg">{gameDuration}</p>
      <p className="text-sm text-gray-400">{timeSinceGamePlayed}</p>
    </div>
  );
};
export default MiniGameCard;
