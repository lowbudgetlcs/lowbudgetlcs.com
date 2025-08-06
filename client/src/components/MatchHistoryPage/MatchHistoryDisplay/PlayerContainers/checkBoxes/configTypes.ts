  export interface DamageTypeProps {
    id: string;
    label: string;
    dataKey: string;
    color: string;
    defaultChecked: boolean;
  }
  
  export const champDamage: DamageTypeProps[] = [
    {
      id: "total",
      label: "Total Damage",
      dataKey: "totalDamageDealtToChampions",
      color: "#e8a012",
      defaultChecked: true,
    },
    {
      id: "physical",
      label: "Physical Damage",
      dataKey: "physicalDamageDealtToChampions",
      color: "#bf473a",
      defaultChecked: false,
    },
    {
      id: "magic",
      label: "Magic Damage",
      dataKey: "magicDamageDealtToChampions",
      color: "#5976b8",
      defaultChecked: false,
    },
    {
      id: "trueDamage",
      label: "True Damage",
      dataKey: "trueDamageDealtToChampions",
      color: "#f5f5f5",
      defaultChecked: false,
    },
  ];