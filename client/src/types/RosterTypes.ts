export interface Team {
    id: number;
    divisionId: number;
    teamName: string;
    teamTag: string | null;
    active: boolean;
    createdAt: string;
    formerTeam: number | null;
}