import { Bar } from "react-chartjs-2";
import { ParticipantDto } from "../../interfaces/MatchV5";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useState, useMemo } from "react";
import { DamageCheckbox, MasterDamageCheckbox } from "./checkBoxes/DamageCheckbox";
import { champDamage } from "./checkBoxes/configTypes";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const getInitialState = () => {
  return champDamage.reduce((acc, Dto) => {
    acc[Dto.id] = Dto.defaultChecked;
    return acc;
  }, {} as Record<string, boolean>);
};

const DamageContainer = ({ players, team }: { players: ParticipantDto[]; team: string }) => {
  const [checkedState, setCheckedState] = useState(getInitialState());

  const allChecked = useMemo(() => Object.values(checkedState).every(Boolean), [checkedState]);

  const handleCheckboxChange = (typeId: string) => {
    setCheckedState((prev) => ({
      ...prev,
      [typeId]: !prev[typeId],
    }));
  };

  const handleSelectAllChange = () => {
    const nextState = !allChecked;
    const newState = Object.keys(checkedState).reduce((acc, key) => {
      acc[key] = nextState;
      return acc;
    }, {} as Record<string, boolean>);
    setCheckedState(newState);
  };
  const labels = players.map((player) => player.riotIdGameName);

  const activeDatasets = useMemo(() => {
    return champDamage
      .filter((type) => checkedState[type.id])
      .map((type) => ({
        label: type.label,
        data: players.map((p) => p[type.dataKey as keyof ParticipantDto]),
        backgroundColor: type.color,
        borderColor: type.color,
        minBarLength: 5,
      }));
  }, [players, checkedState]);

  const options = {
    indexAxis: "y" as const,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#252525",
        bodyFont: {
          size: 14,
        } as const,
        titleFont: {
          weight: "bold",
          size: 18,
        } as const,
      },
      datalabels: {
        display: true as const,
        color: "white" as const,
        anchor: "end" as const,
        align: "end" as const,
        font: {
          size: 12,
        } as const,
        formatter: (value: any) => value,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          display: false,
        },
        grace: "15%",
      },
      y: {
        ticks: {
          color: "#F5F5F5",
          font: {
            size: 14,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const data = {
    labels: labels,
    datasets: activeDatasets,
  };

  return (
    <div className="damageContainer flex max-w-[879.82px] min-h-[45vh]">
      <div className="optionsBar">
        <form className="flex flex-col gap-3 text-nowrap" onSubmit={(e) => e.preventDefault()}>
          <h3 className="text-white font-bold text-lg mb-2">Damage Types</h3>
          {/* Select All Checkbox */}
          <MasterDamageCheckbox
            label="Damage to Champions"
            checked={allChecked}
            onChange={handleSelectAllChange}
            team={team}
          />
          {/* Individual Damage Type Checkboxes */}
          {champDamage.map((type) => (
            <DamageCheckbox
              key={type.id}
              label={type.label}
              checked={checkedState[type.id]}
              onChange={() => handleCheckboxChange(type.id)}
              team={team}
            />
          ))}
        </form>
      </div>
      <div className="grow">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};
export default DamageContainer;
