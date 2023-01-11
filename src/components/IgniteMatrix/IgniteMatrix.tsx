import {
  Chart as ChartJS,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import type { BubbleDataPoint, ChartDataset } from "chart.js";

import { Bubble } from "react-chartjs-2";

import { useMemo } from "react";
import { api } from "../../utils/api";

ChartJS.register(
  RadialLinearScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  LogarithmicScale
);

const normalizeData = (
  spend: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  return ((spend - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

interface IgniteMatrixProps {}

export const IgniteMatrix: React.FC<IgniteMatrixProps> = () => {
  const { data: suppliersData } = api.supplier.getAllValidSuppliers.useQuery();

  const chartData: ChartDataset<"bubble", BubbleDataPoint[]>[] = useMemo(() => {
    if (!suppliersData) return [];

    const maxSpend = Math.max(
      ...suppliersData.map((supplier) => supplier.spend as number)
    );
    const minSpend = Math.min(
      ...suppliersData.map((supplier) => supplier.spend as number)
    );

    return suppliersData.map((supplier) => {
      return {
        label: supplier.name,
        backgroundColor: "rgba(239, 13, 62, 0.5)",
        data: [
          {
            x: (supplier.shareOfWallet as number) * 100,
            y: supplier.ebitMargin as number,
            r: normalizeData(
              supplier.spend as number,
              minSpend,
              maxSpend,
              2,
              10
            ),
          },
        ],
      };
    });
  }, [suppliersData]);

  return (
    <Bubble
      data={{
        datasets: chartData,
      }}
      options={{
        maintainAspectRatio: true,
        responsive: true,

        scales: {
          x: { type: "logarithmic" },
          r: { type: "logarithmic" },
        },

        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              // Custom label to show the correct spend since the data is normalized
              afterTitle(tooltipItems) {
                const title = tooltipItems[0]?.dataset?.label;
                return title ?? "";
              },
              beforeLabel(tooltipItem) {
                const index = tooltipItem.datasetIndex;
                const shareOfWallet =
                  Number(suppliersData?.[index]?.shareOfWallet) * 100;
                const ebitMargin = Number(suppliersData?.[index]?.ebitMargin);
                const spend = Number(suppliersData?.[index]?.spend);
                return `EBIT margin: ${ebitMargin.toFixed(
                  2
                )}\nShare of wallet: ${shareOfWallet.toFixed(
                  2
                )}\nSpend: ${spend.toFixed(2)}`;
              },
              label() {
                return "";
              },
            },
          },
        },
      }}
    />
  );
};
