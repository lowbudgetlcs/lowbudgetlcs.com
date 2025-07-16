import PlayerStats from "./PlayerStats";

export default interface TeamStats {
  teamId: number;
  win: boolean;
  bans: number[];
  players: PlayerStats[];
  feats: {
    EPIC_MONSTER_KILL: number;
    FIRST_BLOOD: number;
    FIRST_TURRET: number;
  };
  objectives: {
    atakhan: {
      first: boolean;
      kills: number;
    };
    baron: {
      first: boolean;
      kills: number;
    };
    champion: {
      first: boolean;
      kills: number;
    };
    dragon: {
      first: boolean;
      kills: number;
    };
    horde: {
      first: boolean;
      kills: number;
    };
    inhibitor: {
      first: boolean;
      kills: number;
    };
    riftHerald: {
      first: boolean;
      kills: number;
    };
    tower: {
      first: boolean;
      kills: number;
    };
  };
}
