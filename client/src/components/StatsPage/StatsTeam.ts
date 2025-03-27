export interface GameStatsProps {
  gameId: number;
  win: boolean;
  players: Array<{
    playerId: number;
    playerName: string;
    stats: {
      id: number;
      kills: number;
      deaths: number;
      assists: number;
      level: number;
      gold: number;
      visionScore: number;
      damage: number;
      healing: number;
      shielding: number;
      damageTaken: number;
      selfMitigatedDamage: number;
      damageToTurrets: number;
      longestLife: number;
      doubleKills: number;
      tripleKills: number;
      quadraKills: number;
      pentaKills: number;
      gameLength: number;
      win: boolean;
      cs: number;
      championName: string;
      teamKills: number;
      shortCode: string;
      performanceId: number;
    };
  }>;
}

export interface StatsProps {
  teamName: string;
  groupId: string;
  // captainId: number | null;
  logo: string | null;
  playerList: string[];
  divisionId: number;
  isOpen: boolean;
  onToggle: () => void;
}

export interface RosterProps {
  id: number;
  playerName: string;
}

export interface ChampionProps {
  championName: string;
  gamesPlayed: number;
}

export interface ChampImagesProps {}

export interface BannedProps {
  championName: string;
  timesBanned: number;
  banRate: number;
}

export const handleTeamSearch = async (
  teamID: number,
  // React Hooks
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setError(null);
  try {
    const apiKey = import.meta.env.VITE_BACKEND_API_KEY || "";

    // Fetch game data from db
    const gameResponse = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/stats/team/${teamID}`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (!gameResponse.ok) {
      // Handle specific status codes
      switch (gameResponse.status) {
        case 404:
          throw new Error("Player not found. Did you spell correctly?");
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error("Failed to fetch player data.");
      }
    }
    // Get game data and update gameList
    const gameData: Array<GameStatsProps> = await gameResponse.json();
    const flatArr = gameData.flat();
    return flatArr;
  } catch (err: any) {
    setError(err.message || "An unexpected error occurred");
    throw new Error("Some unexpected error in fetching player data occurred");
  }
};
