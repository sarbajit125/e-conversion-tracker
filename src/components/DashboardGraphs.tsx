"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions, ScriptableContext } from "chart.js";
import { DashboardDataGrid } from "@/app/api/route";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
function DashboardGraphs(props: DashboardChartProps) {
  return (
    <Line
      data={{
        labels: props.data.map((item) => item.month),
        datasets: [
          {
            data: props.data.map((item) => item.value),
            label: "Cases filled",
            fill: "start",
            backgroundColor(ctx, options) {
                const context = ctx.chart.ctx
                const gradient = context.createLinearGradient(0,0,0,200);
                gradient.addColorStop(0, "#40C0C0");
                gradient.addColorStop(1, "#40C0C0");
                return gradient;
            },
            borderColor: "#40C0C0",
            
          },
        ],
      }}
      about="Conversion cases filled per month"
      options={{
        scales: {
          x: { grid: { display: false } },
          y: { grid: { display: false } },
        },
        responsive: true,
      }}
    />
  );
}

export default DashboardGraphs;
export interface DashboardChartProps {
    data: DashboardDataGrid[]
}