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
import { Checkbox, MasterCheckbox } from "./checkBoxes/Checkbox";
import {
  champDamage,
  damageTakenAndHealed,
  DamageTypeProps,
  farming,
  income,
  totalDamage,
  vision,
} from "./checkBoxes/configTypes";
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
  const [defenseCheckedState, setDefenseCheckedState] = useState(
    getInitialState(damageTakenAndHealed)
  );
  const [incomeCheckedState, setIncomeCheckedState] = useState(getInitialState(income));
  const [visionCheckedState, setVisionCheckedState] = useState(getInitialState(vision));
  const [farmingCheckedState, setFarmingCheckedState] = useState(getInitialState(farming));

  const allChampDamageChecked = useMemo(
    () => Object.values(champDamageCheckedState).every(Boolean),
    [champDamageCheckedState]
  );

  const allTotalDamageChecked = useMemo(
    () => Object.values(totalDamageCheckedState).every(Boolean),
    [totalDamageCheckedState]
  );
  const allDefenseChecked = useMemo(
    () => Object.values(defenseCheckedState).every(Boolean),
    [defenseCheckedState]
  );
  const allIncomeChecked = useMemo(
    () => Object.values(incomeCheckedState).every(Boolean),
    [incomeCheckedState]
  );
  const allVisionChecked = useMemo(
    () => Object.values(visionCheckedState).every(Boolean),
    [visionCheckedState]
  );
  const allFarmingChecked = useMemo(
    () => Object.values(farmingCheckedState).every(Boolean),
    [farmingCheckedState]
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
          minBarLength: 8,
        })),
      ...totalDamage
        .filter((type) => totalDamageCheckedState[type.id])
        .map((type) => ({
          label: type.label,
          data: players.map((p) => p[type.dataKey as keyof ParticipantDto]),
          backgroundColor: type.color,
          borderColor: type.color,
          minBarLength: 8,
        })),
      ...damageTakenAndHealed
        .filter((type) => defenseCheckedState[type.id])
        .map((type) => ({
          label: type.label,
          data: players.map((p) => p[type.dataKey as keyof ParticipantDto]),
          backgroundColor: type.color,
          borderColor: type.color,
          minBarLength: 8,
        })),
      ...income
        .filter((type) => incomeCheckedState[type.id])
        .map((type) => ({
          label: type.label,
          data: players.map((p) => p[type.dataKey as keyof ParticipantDto]),
          backgroundColor: type.color,
          borderColor: type.color,
          minBarLength: 8,
        })),
      ...vision
        .filter((type) => visionCheckedState[type.id])
        .map((type) => ({
          label: type.label,
          data: players.map((p) => p[type.dataKey as keyof ParticipantDto]),
          backgroundColor: type.color,
          borderColor: type.color,
          minBarLength: 8,
        })),
      ...farming
        .filter((type) => farmingCheckedState[type.id])
        .map((type) => ({
          label: type.label,
          data: players.map((p) => p[type.dataKey as keyof ParticipantDto]),
          backgroundColor: type.color,
          borderColor: type.color,
          minBarLength: 8,
        })),
    ];
  }, [
    players,
    champDamageCheckedState,
    totalDamageCheckedState,
    defenseCheckedState,
    incomeCheckedState,
    visionCheckedState,
    farmingCheckedState,
  ]);

  const data = {
    labels: labels,
    datasets: activeDatasets,
  };

  return (
    <div className="damageContainer flex max-w-[879.82px] max-h-[50vh] flex-col-reverse md:flex-row gap-2">
      <div className="optionsBar overflow-y-scroll">
        <form className="flex flex-col gap-3 text-nowrap" onSubmit={(e) => e.preventDefault()}>
          {/* Select All Checkbox */}
          <MasterCheckbox
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
            <Checkbox
              key={type.id}
              label={type.label}
              checked={champDamageCheckedState[type.id]}
              onChange={() => handleCheckboxChange(type.id, setChampDamageCheckedState)}
            />
          ))}
          {/* Select All Checkbox */}
          <MasterCheckbox
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
          {/* Individual Damage Type Checkboxes */}
          {totalDamage.map((type) => (
            <Checkbox
              key={type.id}
              label={type.label}
              checked={totalDamageCheckedState[type.id]}
              onChange={() => handleCheckboxChange(type.id, setTotalDamageCheckedState)}
            />
          ))}
          {/* Select All Checkbox */}
          <MasterCheckbox
            label="Defense"
            checked={allDefenseChecked}
            onChange={() =>
              handleSelectAllChange(allDefenseChecked, defenseCheckedState, setDefenseCheckedState)
            }
          />
          {/* Individual Damage Type Checkboxes */}
          {damageTakenAndHealed.map((type) => (
            <Checkbox
              key={type.id}
              label={type.label}
              checked={defenseCheckedState[type.id]}
              onChange={() => handleCheckboxChange(type.id, setDefenseCheckedState)}
            />
          ))}
          {/* Select All Checkbox */}
          <MasterCheckbox
            label="Income"
            checked={allIncomeChecked}
            onChange={() =>
              handleSelectAllChange(allIncomeChecked, incomeCheckedState, setIncomeCheckedState)
            }
          />
          {/* Individual Damage Type Checkboxes */}
          {income.map((type) => (
            <Checkbox
              key={type.id}
              label={type.label}
              checked={incomeCheckedState[type.id]}
              onChange={() => handleCheckboxChange(type.id, setIncomeCheckedState)}
            />
          ))}
          {/* Select All Checkbox */}
          <MasterCheckbox
            label="Vision"
            checked={allVisionChecked}
            onChange={() =>
              handleSelectAllChange(allVisionChecked, visionCheckedState, setVisionCheckedState)
            }
          />
          {/* Individual Damage Type Checkboxes */}
          {vision.map((type) => (
            <Checkbox
              key={type.id}
              label={type.label}
              checked={visionCheckedState[type.id]}
              onChange={() => handleCheckboxChange(type.id, setVisionCheckedState)}
            />
          ))}
          {/* Select All Checkbox */}
          <MasterCheckbox
            label="Farming"
            checked={allFarmingChecked}
            onChange={() =>
              handleSelectAllChange(allFarmingChecked, farmingCheckedState, setFarmingCheckedState)
            }
          />
          {/* Individual Damage Type Checkboxes */}
          {farming.map((type) => (
            <Checkbox
              key={type.id}
              label={type.label}
              checked={farmingCheckedState[type.id]}
              onChange={() => handleCheckboxChange(type.id, setFarmingCheckedState)}
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
