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
import { champDamage, DamageTypeProps, totalDamage } from "./checkBoxes/configTypes";
import graphOptions from "./graphOptions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const getInitialState = (damageType: DamageTypeProps[]) => {
  return damageType.reduce((acc, Dto) => {
    acc[Dto.id] = Dto.defaultChecked;
    return acc;
  }, {} as Record<string, boolean>);
};

const DamageContainer = ({ players }: { players: ParticipantDto[] }) => {
  const [champDamageCheckedState, setChampDamageCheckedState] = useState(
    getInitialState(champDamage)
  );
  const [totalDamageCheckedState, setTotalDamageCheckedState] = useState(
    getInitialState(totalDamage)
  );

  const allChampDamageChecked = useMemo(
    () => Object.values(champDamageCheckedState).every(Boolean),
    [champDamageCheckedState]
  );

  const allTotalDamageChecked = useMemo(
    () => Object.values(totalDamageCheckedState).every(Boolean),
    [totalDamageCheckedState]
  );

  const handleCheckboxChange = (
    typeId: string,
    setCheckedState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    setCheckedState((prev) => ({
      ...prev,
      [typeId]: !prev[typeId],
    }));
  };

  const handleSelectAllChange = (
    allChecked: boolean,
    checkedState: Record<string, boolean>,
    setCheckedState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    const nextState = !allChecked;
    const newState = Object.keys(checkedState).reduce((acc, key) => {
      acc[key] = nextState;
      return acc;
    }, {} as Record<string, boolean>);
    setCheckedState(newState);
  };
  const labels = players.map((player) => player.riotIdGameName);

  const activeDatasets = useMemo(() => {
    return [
      ...champDamage
        .filter((type) => champDamageCheckedState[type.id])
        .map((type) => ({
          label: type.label,
          data: players.map((p) => p[type.dataKey as keyof ParticipantDto]),
          backgroundColor: type.color,
          borderColor: type.color,
          minBarLength: 5,
        })),
      ...totalDamage
        .filter((type) => totalDamageCheckedState[type.id])
        .map((type) => ({
          label: type.label,
          data: players.map((p) => p[type.dataKey as keyof ParticipantDto]),
          backgroundColor: type.color,
          borderColor: type.color,
          minBarLength: 5,
        })),
    ];
  }, [players, champDamageCheckedState, totalDamageCheckedState]);

  const data = {
    labels: labels,
    datasets: activeDatasets,
  };

  return (
    <div className="damageContainer flex max-w-[879.82px] min-h-[45vh]">
      <div className="optionsBar">
        <form
          className="flex flex-col gap-3 text-nowrap overflow-y-scroll"
          onSubmit={(e) => e.preventDefault()}>
          <h3 className="text-white font-bold text-lg mb-2">Damage Types</h3>
          {/* Select All Checkbox */}
          <MasterDamageCheckbox
            label="Damage to Champions"
            checked={allChampDamageChecked}
            onChange={() =>
              handleSelectAllChange(
                allChampDamageChecked,
                champDamageCheckedState,
                setChampDamageCheckedState
              )
            }
          />
          {/* Individual Damage Type Checkboxes */}
          {champDamage.map((type) => (
            <DamageCheckbox
              key={type.id}
              label={type.label}
              checked={champDamageCheckedState[type.id]}
              onChange={() => handleCheckboxChange(type.id, setChampDamageCheckedState)}
            />
          ))}
          <MasterDamageCheckbox
            label="Total Damage Dealt"
            checked={allTotalDamageChecked}
            onChange={() =>
              handleSelectAllChange(
                allTotalDamageChecked,
                totalDamageCheckedState,
                setTotalDamageCheckedState
              )
            }
          />
          {totalDamage.map((type) => (
            <DamageCheckbox
              key={type.id}
              label={type.label}
              checked={totalDamageCheckedState[type.id]}
              onChange={() => handleCheckboxChange(type.id, setTotalDamageCheckedState)}
            />
          ))}
        </form>
      </div>
      <div className="grow">
        <Bar options={graphOptions} data={data} />
      </div>
    </div>
  );
};
export default DamageContainer;
