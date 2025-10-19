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
