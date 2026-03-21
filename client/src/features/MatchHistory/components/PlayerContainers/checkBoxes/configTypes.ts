export interface DamageTypeProps {
  id: string;
  label: string;
  dataKey: string;
  color: string;
  defaultChecked: boolean;
}

export const champDamage: DamageTypeProps[] = [
  {
    id: "total-champion",
    label: "Total Damage",
    dataKey: "totalDamageDealtToChampions",
    color: "#e8a012",
    defaultChecked: true,
  },
  {
    id: "physical-champion",
    label: "Physical Damage",
    dataKey: "physicalDamageDealtToChampions",
    color: "#bf473a",
    defaultChecked: false,
  },
  {
    id: "magic-champion",
    label: "Magic Damage",
    dataKey: "magicDamageDealtToChampions",
    color: "#5976b8",
    defaultChecked: false,
  },
  {
    id: "trueDamage-champion",
    label: "True Damage",
    dataKey: "trueDamageDealtToChampions",
    color: "#f5f5f5",
    defaultChecked: false,
  },
];

export const totalDamage = [
  {
    id: "total-total",
    label: "Total Damage",
    dataKey: "totalDamageDealt",
    color: "#e8a012",
    defaultChecked: false,
  },
  {
    id: "physical-total",
    label: "Physical Damage",
    dataKey: "physicalDamageDealt",
    color: "#bf473a",
    defaultChecked: false,
  },
  {
    id: "magic-total",
    label: "Magic Damage",
    dataKey: "magicDamageDealt",
    color: "#5976b8",
    defaultChecked: false,
  },
  {
    id: "trueDamage-total",
    label: "True Damage",
    dataKey: "trueDamageDealt",
    color: "#f5f5f5",
    defaultChecked: false,
  },
  {
    id: "turrets-total",
    label: "Damage To Turrets",
    dataKey: "damageDealtToTurrets",
    color: "#28a745",
    defaultChecked: false,
  },
  {
    id: "objectives-total",
    label: "Damage To Objectives",
    dataKey: "damageDealtToObjectives",
    color: "#8a2be2",
    defaultChecked: false,
  },
];
export const damageTakenAndHealed: DamageTypeProps[] = [
  {
    id: "damage-taken",
    label: "Damage Taken",
    dataKey: "totalDamageTaken",
    color: "#dc3545",
    defaultChecked: false,
  },
  {
    id: "healing-done",
    label: "Healing Done",
    dataKey: "totalHeal",
    color: "#28a745",
    defaultChecked: false,
  },
  {
    id: "physical-taken",
    label: "Physical Damage Taken",
    dataKey: "physicalDamageTaken",
    color: "#bf473a",
    defaultChecked: false,
  },
  {
    id: "magic-taken",
    label: "Magic Damage Taken",
    dataKey: "magicDamageTaken",
    color: "#5976b8",
    defaultChecked: false,
  },
  {
    id: "true-taken",
    label: "True Damage Taken",
    dataKey: "trueDamageTaken",
    color: "#f5f5f5",
    defaultChecked: false,
  },
  {
    id: "self-mitigated",
    label: "Self Mitigated Damage",
    dataKey: "damageSelfMitigated",
    color: "#6c757d",
    defaultChecked: false,
  },
];

export const income: DamageTypeProps[] = [
  {
    id: "gold-earned",
    label: "Gold Earned",
    dataKey: "goldEarned",
    color: "#ffc107",
    defaultChecked: false,
  },
  {
    id: "gold-spent",
    label: "Gold Spent",
    dataKey: "goldSpent",
    color: "#e8a012",
    defaultChecked: false,
  },
];

export const vision: DamageTypeProps[] = [
  {
    id: "vision-score",
    label: "Vision Score",
    dataKey: "visionScore",
    color: "#00bfff",
    defaultChecked: false,
  },
  {
    id: "wards-placed",
    label: "Wards Placed",
    dataKey: "wardsPlaced",
    color: "#20c997",
    defaultChecked: false,
  },
  {
    id: "wards-destroyed",
    label: "Wards Destroyed",
    dataKey: "wardsKilled",
    color: "#fd7e14",
    defaultChecked: false,
  },
  {
    id: "control-wards-purchased",
    label: "Control Wards Purchased",
    dataKey: "visionWardsBoughtInGame",
    color: "#e83e8c",
    defaultChecked: false,
  },
];

export const farming: DamageTypeProps[] = [
  {
    id: "minions-killed",
    label: "Minions Killed",
    dataKey: "totalMinionsKilled",
    color: "#6610f2",
    defaultChecked: false,
  },
  {
    id: "jungle-monsters-killed",
    label: "Total Jungle Monsters Killed",
    dataKey: "neutralMinionsKilled",
    color: "#17a2b8",
    defaultChecked: false,
  },
  {
    id: "ally-jungle-monsters",
    label: "Ally Jungle Monsters",
    dataKey: "totalAllyJungleMinionsKilled",
    color: "#4caf50",
    defaultChecked: false,
  },
  {
    id: "enemy-jungle-monsters",
    label: "Enemy Jungle Monsters",
    dataKey: "totalEnemyJungleMinionsKilled",
    color: "#f44336",
    defaultChecked: false,
  },
];
