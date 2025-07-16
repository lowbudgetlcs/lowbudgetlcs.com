import { MatchV5DTOs } from "twisted/dist/models-dto";
import TeamStats from "./interfaces/TeamStats";

const createTeamObject = (teamData: MatchV5DTOs.TeamDto) => {
  const bans: number[] = [];
  teamData.bans.forEach((ban) => {
    bans.push(ban.championId);
  });
  const teamObject: TeamStats = {
    teamId: teamData.teamId,
    win: teamData.win,
    bans: bans,
    players: [],
    feats: {
      EPIC_MONSTER_KILL: teamData.feats.EPIC_MONSTER_KILL.featState,
      FIRST_BLOOD: teamData.feats.FIRST_BLOOD.featState,
      FIRST_TURRET: teamData.feats.FIRST_TURRET.featState,
    },
    objectives: {
      atakhan: {
        first: teamData.objectives.atakhan.first,
        kills: teamData.objectives.atakhan.kills,
      },
      baron: {
        first: teamData.objectives.baron.first,
        kills: teamData.objectives.baron.kills,
      },
      champion: {
        first: teamData.objectives.champion.first,
        kills: teamData.objectives.champion.kills,
      },
      dragon: {
        first: teamData.objectives.dragon.first,
        kills: teamData.objectives.dragon.kills,
      },
      horde: {
        first: teamData.objectives.horde.first,
        kills: teamData.objectives.horde.kills,
      },
      inhibitor: {
        first: teamData.objectives.inhibitor.first,
        kills: teamData.objectives.inhibitor.kills,
      },
      riftHerald: {
        first: teamData.objectives.riftHerald.first,
        kills: teamData.objectives.riftHerald.kills,
      },
      tower: {
        first: teamData.objectives.tower.first,
        kills: teamData.objectives.tower.kills,
      },
    },
  };
  return teamObject;
};

export default createTeamObject;
