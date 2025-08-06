const graphOptions = {
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

export default graphOptions;
