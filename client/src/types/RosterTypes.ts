export interface Team {
  id: number;
  divisionId: number;
  teamName: string;
  teamTag: string | null;
  active: boolean;
  createdAt: string;
  formerTeam: number | null;
  logo?: string;
}

interface Divisions {
  id: number;
  seasonId: number;
  divisionName: string;
  createdAt: string;
  eventId: number;
}

export interface TeamBySeason {
  divisions: Divisions[];
  teams: {
    divisions: Divisions;
    teams: Team;
  }[];
}
export interface Player {
  points: string;
  name: string;
}

export interface RosterData {
  divisions: string[];
  teams: {
    logo: string | null;
    name: string;
    division: string;
    players: Player[];
  }[];
}
