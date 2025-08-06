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
]