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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const DamageContainer = ({ players }: { players: ParticipantDto[] }) => {
  const labels = players.map((player) => {
    return player.riotIdGameName;
  });
  const maxDamage = players.reduce(
    (max, player) => Math.max(max, player.totalDamageDealtToChampions),
    0
  );

  const damageList = players.map((player) => player.totalDamageDealtToChampions);
  console.log(damageList);
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
        align: "start" as const,
        font: {
          size: 16,
          weight: "bold",
        } as const,
        formatter: (value: any) => value,
      },
    },
    responsive: true,
    scales: {
      x: {
        ticks: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#F5F5F5",
          font: {
            size: 14,
          },
        },
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Damage",
        data: damageList,
        backgroundColor: "#e8a012",
        borderColor: "#e8a012",
      },
    ],
  };
  return (
    <div className="damageContainer flex max-w-[879.82px]">
      <Bar options={options} data={data} />
    </div>
  );
};
export default DamageContainer;
