import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export interface TrendSeries {
  label: string;
  values: number[];
  color: string;
  unit?: string;
  decimals?: number;
  axis?: "y" | "y1";
}

interface StatsTrendChartProps {
  title: string;
  labels: string[];
  series: TrendSeries[];
}

const formatValue = (value: number, series: TrendSeries) =>
  `${Number.isFinite(value) ? value.toFixed(series.decimals ?? 1) : "—"}${series.unit ? ` ${series.unit}` : ""}`;

const summarizeSeries = (series: TrendSeries) => {
  const values = series.values.filter(Number.isFinite);
  if (values.length === 0) return `${series.label}: no data.`;

  const range = values.reduce(
    (result, value) => ({ min: Math.min(result.min, value), max: Math.max(result.max, value) }),
    { min: values[0], max: values[0] },
  );
  return `${series.label} starts at ${formatValue(values[0], series)} and ends at ${formatValue(values[values.length - 1], series)}, ranging from ${formatValue(range.min, series)} to ${formatValue(range.max, series)}.`;
};

const StatsTrendChart = ({ title, labels, series }: StatsTrendChartProps) => {
  const chartDescription = `${labels.length} matches from oldest to newest. ${series.map(summarizeSeries).join(" ")}`;
  const hasRightAxis = series.some((item) => item.axis === "y1");
  const chartData = {
    labels,
    datasets: series.map((item) => ({
      label: item.label,
      data: item.values,
      borderColor: item.color,
      backgroundColor: item.color,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHitRadius: 8,
      tension: 0.25,
      yAxisID: item.axis ?? "y",
    })),
  };
  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      datalabels: { display: false },
      legend: {
        position: "bottom",
        labels: { color: "#64748b", usePointStyle: true, boxWidth: 8, padding: 10, font: { size: 11 } },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const item = series[context.datasetIndex];
            return `${item.label}: ${formatValue(context.parsed.y, item)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b", maxTicksLimit: 6, maxRotation: 0, minRotation: 0, font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        type: "linear",
        position: "left",
        ticks: { color: "#64748b", maxTicksLimit: 4, padding: 6, font: { size: 10 } },
        grid: { color: "rgba(148, 163, 184, 0.08)", drawTicks: false },
      },
      y1: {
        type: "linear",
        position: "right",
        display: hasRightAxis,
        ticks: { color: "#64748b", maxTicksLimit: 4, padding: 6, font: { size: 10 } },
        grid: { drawOnChartArea: false, drawTicks: false },
      },
    },
  };

  return (
    <article className="min-w-0 rounded-xl border border-border bg-bg-light/50 p-3">
      <figure>
        <figcaption className="mb-2 text-base font-semibold">{title}</figcaption>
        {labels.length > 0 && series.length > 0 ? (
          <>
            <div role="img" aria-label={`${title}. ${chartDescription}`} className="relative h-48 w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
            <table className="sr-only">
              <caption>{title} data by match</caption>
              <thead>
                <tr>
                  <th scope="col">Match</th>
                  {series.map((item) => (
                    <th key={item.label} scope="col">{item.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {labels.map((label, index) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {series.map((item) => (
                      <td key={item.label}>{formatValue(item.values[index] ?? 0, item)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="text-sm text-text-secondary">No match data available.</p>
        )}
      </figure>
    </article>
  );
};

export default StatsTrendChart;
