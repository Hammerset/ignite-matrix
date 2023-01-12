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
import { Supplier } from "@prisma/client";

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

interface IgniteMatrixProps {
  suppliers: Supplier[];
}

export const IgniteMatrix: React.FC<IgniteMatrixProps> = ({ suppliers }) => {
  const chartData: ChartDataset<"bubble", BubbleDataPoint[]>[] = useMemo(() => {
    const maxSpend = Math.max(
      ...suppliers.map((supplier) => supplier.spend as number)
    );
    const minSpend = Math.min(
      ...suppliers.map((supplier) => supplier.spend as number)
    );

    return suppliers.map((supplier) => {
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
  }, [suppliers]);

  return (
    <Bubble
      data={{
        datasets: chartData,
      }}
      options={{
        responsive: true,

        scales: {
          x: {
            type: "logarithmic",
            title: { display: true, text: "Share of wallet (%)" },
            ticks: {
              callback(value) {
                return `${value}%`;
              },
              maxTicksLimit: 10,
            },
          },
          y: {
            type: "linear",
            title: { display: true, text: "EBIT margin (%)" },
            ticks: {
              callback(value) {
                return `${Number(value) * 100}%`;
              },
              maxTicksLimit: 10,
            },
          },
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
                  Number(suppliers?.[index]?.shareOfWallet) * 100;
                const ebitMargin = Number(suppliers?.[index]?.ebitMargin) * 100;
                const spend = Number(suppliers?.[index]?.spend);
                return `EBIT margin: ${ebitMargin.toFixed(
                  2
                )} %\nShare of wallet: ${shareOfWallet.toFixed(
                  2
                )} %\nSpend: ${spend.toFixed(2)} $`;
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
