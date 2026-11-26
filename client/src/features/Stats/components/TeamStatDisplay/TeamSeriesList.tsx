import { TeamGame } from "../../../../types/StatTypes";
import MiniGameCard from "../cards/MiniGameCard";

interface TeamSeriesGroup {
  id: string;
  seriesId: string | null;
  kind: "reported" | "adjacent" | "individual";
  games: TeamGame[];
  reportedGameCount: number;
  teamPairKey: string | null;
}

interface TeamSeriesListProps {
  games: TeamGame[];
  teamId: number;
  teamName: string;
  seriesMetadataAvailable: boolean;
}

const MAX_SERIES_GAMES = 5;
const getGameEndTime = (game: TeamGame) => Number(game.gameEndTimeStamp);

const getTeamPairKey = (game: TeamGame) => {
  if (game.teams.length !== 2) {
    return null;
  }

  return game.teams
    .map((team) => team.match_team_stats.teamId)
    .toSorted((a, b) => a - b)
    .join(":");
};

const groupGamesIntoSeries = (games: TeamGame[]): TeamSeriesGroup[] => {
  const groups: TeamSeriesGroup[] = [];
  const reportedGroups = new Map<string, TeamSeriesGroup>();
  let adjacentGroup: TeamSeriesGroup | null = null;

  for (const game of games.toSorted((a, b) => getGameEndTime(b) - getGameEndTime(a))) {
    if (game.seriesId && (game.seriesGameCount ?? 1) > 1) {
      adjacentGroup = null;
      let group = reportedGroups.get(game.seriesId);
      if (!group) {
        group = {
          id: `series:${game.seriesId}`,
          seriesId: game.seriesId,
          kind: "reported",
          games: [],
          reportedGameCount: 0,
          teamPairKey: getTeamPairKey(game),
        };
        groups.push(group);
        reportedGroups.set(game.seriesId, group);
      }

      group.games.push(game);
      group.reportedGameCount = Math.max(group.reportedGameCount, game.seriesGameCount ?? 1);
      continue;
    }

    const teamPairKey = getTeamPairKey(game);
    if (
      teamPairKey &&
      adjacentGroup?.teamPairKey === teamPairKey &&
      adjacentGroup.games.length < MAX_SERIES_GAMES
    ) {
      if (adjacentGroup.kind !== "adjacent") {
        adjacentGroup.id = `adjacent:${adjacentGroup.games[0].matchId}`;
        adjacentGroup.seriesId = null;
      }
      adjacentGroup.games.push(game);
      adjacentGroup.kind = "adjacent";
      adjacentGroup.reportedGameCount = adjacentGroup.games.length;
      continue;
    }

    const isReportedSingleGame = game.seriesId !== null;
    const group: TeamSeriesGroup = {
      id: isReportedSingleGame ? `series:${game.seriesId}` : `match:${game.matchId}`,
      seriesId: game.seriesId,
      kind: isReportedSingleGame ? "reported" : "individual",
      games: [game],
      reportedGameCount: game.seriesGameCount ?? 1,
      teamPairKey,
    };
    groups.push(group);
    adjacentGroup = teamPairKey ? group : null;
  }

  return groups
    .map((group) => ({
      ...group,
      games: group.games.toSorted((a, b) => {
        const gameNumberDifference = (a.seriesGameNumber ?? Number.MAX_SAFE_INTEGER) -
          (b.seriesGameNumber ?? Number.MAX_SAFE_INTEGER);
        return gameNumberDifference || getGameEndTime(a) - getGameEndTime(b);
      }),
    }))
    .sort((a, b) => {
      const latestA = a.games.reduce((latest, game) => Math.max(latest, getGameEndTime(game)), 0);
      const latestB = b.games.reduce((latest, game) => Math.max(latest, getGameEndTime(game)), 0);
      return latestB - latestA;
    });
};

const TeamSeriesList = ({ games, teamId, teamName, seriesMetadataAvailable }: TeamSeriesListProps) => {
  const seriesGroups = groupGamesIntoSeries(games);
  const seriesCount = seriesGroups.filter((group) => group.kind !== "individual").length;
  const inferredSeriesCount = seriesGroups.filter((group) => group.kind === "adjacent").length;
  const ungroupedGameCount = seriesGroups
    .filter((group) => group.kind === "individual")
    .reduce((count, group) => count + group.games.length, 0);
  const incompleteSeriesCount = seriesGroups.filter(
    (group) =>
      group.kind !== "individual" &&
      (group.games.length !== group.reportedGameCount ||
        group.games.some(
          (game) =>
            !game.teams.some((team) => team.match_team_stats.teamId === teamId) ||
            !game.teams.some((team) => team.match_team_stats.teamId !== teamId),
        )),
  ).length;

  return (
    <section aria-labelledby="team-series-heading" className="flex flex-col gap-2">
      <h3 id="team-series-heading" className="border-b border-border pb-1 text-lg font-semibold">
        Series ({seriesCount})
      </h3>
      {!seriesMetadataAvailable ? (
        <p role="status" className="text-sm text-text-secondary">
          Series information is unavailable; consecutive games between the same teams are grouped, and other matches
          are shown individually.
        </p>
      ) : inferredSeriesCount > 0 ? (
        <p role="status" className="text-sm text-text-secondary">
          {inferredSeriesCount} {inferredSeriesCount === 1 ? "series was" : "series were"} grouped from consecutive
          games between the same teams.
        </p>
      ) : null}
      {seriesMetadataAvailable && ungroupedGameCount > 0 && (
        <p role="status" className="text-sm text-text-secondary">
          {ungroupedGameCount} {ungroupedGameCount === 1 ? "match was" : "matches were"} not linked to a reported
          series or an adjacent game and {ungroupedGameCount === 1 ? "is" : "are"} shown individually.
        </p>
      )}
      {incompleteSeriesCount > 0 && (
        <p role="status" className="text-sm text-text-secondary">
          {incompleteSeriesCount} {incompleteSeriesCount === 1 ? "series has" : "series have"} missing match data;
          displayed scores are not final.
        </p>
      )}
      <ul className="flex flex-col gap-2">
        {seriesGroups.map((group) => {
          const firstGame = group.games[0];
          const ownTeam = firstGame.teams.find((team) => team.match_team_stats.teamId === teamId);
          const opponent = firstGame.teams.find((team) => team.match_team_stats.teamId !== teamId);
          const displayedTeamName = ownTeam?.teams?.teamName ?? teamName;
          const opponentName = opponent?.teams?.teamName ?? "Opponent";
          const isSeries = group.kind !== "individual";
          let teamWins = 0;
          let opponentWins = 0;
          let gamesWithResults = 0;

          for (const game of group.games) {
            const gameTeam = game.teams.find((team) => team.match_team_stats.teamId === teamId);
            const gameOpponent = game.teams.find((team) => team.match_team_stats.teamId !== teamId);
            if (!gameTeam || !gameOpponent) {
              continue;
            }

            gamesWithResults++;
            if (gameTeam.match_team_stats.win) teamWins++;
            if (gameOpponent.match_team_stats.win) opponentWins++;
          }

          const scoreIsFinal =
            isSeries &&
            group.games.length === group.reportedGameCount &&
            gamesWithResults === group.reportedGameCount;
          const resultLabel = scoreIsFinal
            ? teamWins > opponentWins
              ? "Series win"
              : teamWins < opponentWins
                ? "Series loss"
                : "Series tied"
            : isSeries
              ? "Score so far"
              : "Series information unavailable";
          const resultColor =
            scoreIsFinal && teamWins > opponentWins
              ? "border-blue bg-blue/20"
              : scoreIsFinal && teamWins < opponentWins
                ? "border-red bg-red/20"
                : "border-border bg-bg-light/50";

          return (
            <li key={group.id}>
              <details className={`rounded-lg border ${resultColor}`}>
                <summary className="cursor-pointer rounded-lg px-3 py-4">
                  <span className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4">
                    <span className="min-w-0 truncate text-right font-semibold sm:text-lg">{displayedTeamName}</span>
                    <span className="flex min-w-20 flex-col items-center text-center">
                      {isSeries ? (
                        <>
                          <span className="text-3xl font-bold tabular-nums sm:text-4xl">
                            {teamWins}-{opponentWins}
                          </span>
                          <span className="text-xs text-text-secondary">{resultLabel}</span>
                        </>
                      ) : (
                        <span className="text-sm text-text-secondary">{resultLabel}</span>
                      )}
                    </span>
                    <span className="min-w-0 truncate font-semibold sm:text-lg">{opponentName}</span>
                  </span>
                  <span className="mt-1 block text-center text-xs text-text-secondary">
                    {isSeries ? `${group.games.length} of ${group.reportedGameCount} games` : "Individual match"}
                  </span>
                </summary>
                <div className="flex flex-col gap-2 p-2 pt-0">
                  {group.games.map((game) => (
                    <MiniGameCard key={game.matchId} game={game} teamName={teamName} showChampionNames />
                  ))}
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default TeamSeriesList;
