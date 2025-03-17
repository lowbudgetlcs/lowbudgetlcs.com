import { eq, sql } from "drizzle-orm";
import { db } from "../index";
import {
  divisions,
  draftLobbies,
  games,
  playerGameData,
  players,
  series,
  teamGameData,
  teamPerformances,
  teams,
  teamToSeries,
} from "../schema";
import { ClientDraftStateProps } from "../../sockets/draftState";

export async function getRosterData() {
  try {
    const divisionData = await db.select().from(divisions);
    const teamData = await db.select().from(teams);
    const playerData = await db.select().from(players);

    return { divisionData, teamData, playerData };
  } catch (err) {
    console.error("Error fetching roster data: ", err);
    throw new Error("Failed to fetch roster data");
  }
}

export async function getTournamentCodes() {
  const tournamentCodes = await db.select().from(games);
  return tournamentCodes;
}

// export async function getIdFromPerformance(id: number) {
//   const performanceStats = await db
//     .select({ performanceId: performances.id })
//     .from(performances)
//     .where(eq(performances.playerId, id));
//   return performanceStats;
// }

export async function getPlayer(summonerName: string) {
  const player = await db
    .select({ summonerName: players.summonerName, id: players.id })
    .from(players)
    .where(eq(sql`LOWER(${players.summonerName})`, summonerName.toLowerCase()));

  if (player.length < 1) {
    throw new Error("No Player Found");
  }

  return player;
}
// export async function getPlayerGameStats(id: number) {
//   const gameStats = await db
//     .select()
//     .from(playerData)
//     .where(eq(playerData.performanceId, id));
//   return gameStats;
// }

// export async function getAllGameIDs(id: number) {
//   const gameStats = await db
//     .select({
//       gameId: games.id,
//       teamWinId: games.winnerId,
//       teamLoseId: games.loserId,
//     })
//     .from(games)
//     .leftJoin(performances, eq(games.id, performances.gameId))
//     .where(eq(performances.teamId, id));
//   return gameStats;
// }
// export async function getTeamGameStats(id: number) {
//   const gameStats = await db
//     .select({
//       gameId: games.id,
//       playerId: players.id,
//       playerName: players.summonerName,
//       playerStats: playerData,
//     })
//     .from(games)
//     .leftJoin(performances, eq(games.id, performances.gameId)) // Join games and performances
//     .leftJoin(playerData, eq(playerData.performanceId, performances.id)) // Join performances and playerData
//     .leftJoin(players, eq(players.id, performances.playerId)) // Join performances and players
//     .where(eq(performances.teamId, id)); // Filter by team ID
//   return gameStats;
// }

export async function checkDBForURL(blueCode: string, redCode: string) {
  const matchingURL = await db
    .select({
      blueCode: draftLobbies.blueCode,
      redCode: draftLobbies.redCode,
    })
    .from(draftLobbies)
    .where(
      sql`${draftLobbies.blueCode} = ${blueCode} or ${draftLobbies.redCode} = ${redCode}`
    );
  return matchingURL;
}

// Check to see if shortCode exists in game table
export async function getMatchingShortCode(shortCode: string) {
  try {
    const matchingCode = await db
      .select({ shortCode: games.shortcode })
      .from(games)
      .where(eq(games.shortcode, shortCode));
    const checkDupes = await checkDuplicateShortCode(shortCode);
    if (checkDupes) {
      return false;
    } else {
      return matchingCode.length > 0;
    }
  } catch (err) {
    console.error("Error checking tournamentID with server: ", err);
    throw new Error("Failed to check tournamentID");
  }
}

export async function checkDuplicateShortCode(shortCode: string) {
  try {
    const matchingCode = await db
      .select({ shortCode: draftLobbies.shortcode })
      .from(draftLobbies)
      .where(eq(draftLobbies.shortcode, shortCode));
    return matchingCode.length > 0;
  } catch (err) {
    console.error("Error checking tournamentID with server: ", err);
    throw new Error("Failed to check tournamentID");
  }
}

export async function getLobbyCodes(lobbyCode: string) {
  const matchingCodes = await db
    .select({
      lobbyCode: draftLobbies.lobbyCode,
      redCode: draftLobbies.redCode,
      blueCode: draftLobbies.blueCode,
    })
    .from(draftLobbies)
    .where(eq(draftLobbies.lobbyCode, lobbyCode));
  return matchingCodes.length > 0 ? matchingCodes[0] : null;
}

// Finds valid past draft and returns it in the client state form
export async function getPastDraft(lobbyCode: string) {
  const result = await db
    .select()
    .from(draftLobbies)
    .where(eq(draftLobbies.lobbyCode, lobbyCode));

  const draft = result[0];

  if (draft) {
    const draftFinished = draft.draftFinished;
    const clientState: ClientDraftStateProps = {
      draftStarted: false,
      activePhase: "finished",
      phaseType: null,
      blueDisplayName: draft.blueName,
      redDisplayName: draft.redName,
      blueReady: true,
      redReady: true,
      timer: 30,
      bansArray: [],
      picksArray: [],
      bluePicks: [
        draft.bPick1 || "nothing",
        draft.bPick2 || "nothing",
        draft.bPick3 || "nothing",
        draft.bPick4 || "nothing",
        draft.bPick5 || "nothing",
      ],
      redPicks: [
        draft.rPick1 || "nothing",
        draft.rPick2 || "nothing",
        draft.rPick3 || "nothing",
        draft.rPick4 || "nothing",
        draft.rPick5 || "nothing",
      ],
      blueBans: [
        draft.bBan1 || "nothing",
        draft.bBan2 || "nothing",
        draft.bBan3 || "nothing",
        draft.bBan4 || "nothing",
        draft.bBan5 || "nothing",
      ],
      redBans: [
        draft.rBan1 || "nothing",
        draft.rBan2 || "nothing",
        draft.rBan3 || "nothing",
        draft.rBan4 || "nothing",
        draft.rBan5 || "nothing",
      ],
      banIndex: 0,
      pickIndex: 0,
      currentTurn: "",
      currentBluePick: 0,
      currentRedPick: 0,
      currentBlueBan: 0,
      currentRedBan: 0,
      displayTurn: null,
      currentHover: null,
      bluePick: null,
      redPick: null,
      draftComplete: true,
    };

    return { clientState, draftFinished };
  }

  return null;
}

// Match History fetch
export async function getSeriesData(seriesID: number) {
  const results = await db
    .select({
      divisionInfo: {
        divisionID: divisions.id,
        divisionName: divisions.name,
      },
      teamInfo: {
        teamID: teams.id,
        teamName: teams.name,
        teamLogo: teams.logo,
      },
      seriesInfo: {
        seriesID: series.id,
        winnerID: series.winnerId,
        loserID: series.loserId,
      },
      gameInfo: {
        id: games.id,
        shortcode: games.shortcode,
        gameNum: games.gameNum,
        winnerId: games.winnerId,
        loserId: games.loserId,
      },
      teamPerformances: teamPerformances,
      gameData: teamGameData,
    })
    .from(series)
    .where(eq(series.id, seriesID))
    .leftJoin(teamToSeries, eq(series.id, teamToSeries.seriesId))
    .leftJoin(teams, eq(teams.id, teamToSeries.teamId))
    .leftJoin(divisions, eq(divisions.id, teams.divisionId))
    .leftJoin(games, eq(games.seriesId, series.id))
    .leftJoin(teamPerformances, eq(teamPerformances.gameId, games.id))
    .leftJoin(
      teamGameData,
      eq(teamGameData.teamPerformanceId, teamPerformances.id)
    );

  if (!results.length) {
    return null;
  }
  interface TeamArrayProps {
    teamID: number;
    teamName: string;
    teamLogo: string | null;
  }
  // Remove duplicate teams from teams array
  interface GamesArrayProps {
    id: number;
    shortcode: string;
    gameNum: number;
    winnerId: number | null;
    loserId: number | null;
  }
  interface GameDataArrayProps {
    id: number;
    teamPerformanceId: number;
    win: boolean;
    side: string;
    gold: number;
    gameLength: number;
    kills: number;
    barons: number;
    dragons: number;
    grubs: number;
    heralds: number;
    towers: number;
    inhibitors: number;
    firstBaron: boolean;
    firstDragon: boolean;
    firstGrub: boolean;
    firstHerald: boolean;
    firstTower: boolean;
    firstInhibitor: boolean;
    firstBlood: boolean;
  }

  const teamArray: TeamArrayProps[] = [];
  const gamesArray: GamesArrayProps[] = [];
  const gameDataArray: GameDataArrayProps[] = [];

  // Remove duplicate objects from arrays
  results.forEach((result) => {
    const team = result.teamInfo;
    const game = result.gameInfo;
    const gameData = result.gameData;

    // Make typescript happy (there will ALWAYS be data)
    if (!game || !team || !gameData) {
      return;
    }
    if (!gamesArray.some((existingGame) => existingGame.id === game.id)) {
      gamesArray.push(game);
    }
    if (
      !teamArray.some((existingTeam) => existingTeam.teamID === team.teamID)
    ) {
      teamArray.push(team);
    }
    if (
      !gameDataArray.some((existingData) => existingData.id === gameData.id)
    ) {
      gameDataArray.push(gameData);
    }
  });

  const seriesData = {
    divisionInfo: results[0].divisionInfo,
    seriesInfo: results[0].seriesInfo,
    teams: teamArray,
    games: gamesArray,
    gameData: gameDataArray,
  };

  seriesData.teams.forEach((team) => {
    if (!team) {
      return;
    }

    // Assign winner property to each team
    if (seriesData.seriesInfo.winnerID === team.teamID) {
      const winnerProp = { winner: true };
      Object.assign(team, winnerProp);
    } else {
      const winnerProp = { winner: false };
      Object.assign(team, winnerProp);
    }
  });

  return seriesData;
}
