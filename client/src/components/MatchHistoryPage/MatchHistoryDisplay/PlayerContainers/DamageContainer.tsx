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
import { useEffect, useState } from "react";
import { FaSliders } from "react-icons/fa6";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const DamageContainer = ({ players }: { players: ParticipantDto[] }) => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const images = players.map((player) => {
      const image = new Image(12, 12);
      image.src = `https://cdn.communitydragon.org/latest/champion/${player.championId}/square`;
      return image;
    });
    setImages(images);
  }, [players]);

  const labels = players.map((player) => {
    const image = new Image();
    image.src = `https://cdn.communitydragon.org/latest/champion/${player.championId}/square`;
  });
  const maxDamage = players.reduce(
    (max, player) => Math.max(max, player.totalDamageDealtToChampions),
    0
  );

  const damageList = players.map(
    (player) => player.totalDamageDealtToChampions
  );
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
        // Position the image at the start of the bar
        anchor: "end" as const,
        align: "end" as const,
        // The formatter determines what to display. We return the pre-loaded image.
        formatter: (value: any, context: any) => {
          return images[context.dataIndex];
        },
        // Add some padding between the image and the start of the axis
        offset: 8,
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
