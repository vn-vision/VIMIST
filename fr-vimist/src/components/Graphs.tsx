import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  LineController,
  PieController,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useFetchSalesByPeriod } from "../features/sales/salesHook";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  LineController,
  PieController,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);


type GraphData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
};

const emptyGraphData: GraphData = {
  labels: [],
  datasets: [],
};

type TransformedData = {
  weekly: GraphData | null;
  monthly: GraphData | null;
  yearly: GraphData | null;
};

const DynamicGraph = () => {
  const [graphData, setGraphData] = useState<TransformedData>({
    weekly: null,
    monthly: null,
    yearly: null,
  });
  const [graphType, setGraphType] = useState<"bar" | "line" | "pie">("line");
  const [timeline, setTimeline] = useState<"weekly" | "monthly" | "yearly">(
    "weekly"
  );

  const handleGraphTypeChange = (type: "bar" | "line" | "pie") =>
    setGraphType(type);
  const handleTimelineChange = (period: "weekly" | "monthly" | "yearly") =>
    setTimeline(period);

  const transFormData = (apiData: any): TransformedData => ({
    weekly: {
      labels: apiData.sales_by_day.map((record: any) =>
        new Date(record.day).toLocaleDateString("en-US", { weekday: "short" })
      ),
      datasets: [
        {
          label: "Daily Sales",
          data: apiData.sales_by_day.map((record: any) => record.total_sales),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    monthly: {
      labels: apiData.sales_by_month.map((record: any) =>
        new Date(record.month).toLocaleDateString("en-US", { month: "short" })
      ),
      datasets: [
        {
          label: "Monthly Sales",
          data: apiData.sales_by_month.map((record: any) => record.total_sales),
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    yearly: {
      labels: apiData.sales_by_year.map((record: any) =>
        new Date(record.year).getFullYear().toString()
      ),
      datasets: [
        {
          label: "Yearly Sales",
          data: apiData.sales_by_year.map((record: any) => record.total_sales),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
  });

  const {
    data: periodicData,
    status: periodState,
    error: periodError,
  } = useFetchSalesByPeriod();

  useEffect(() => {
    if (periodState === "succeeded" && periodicData) {
      console.log(periodicData);
      setGraphData(transFormData(periodicData));
    }
  }, [periodState, periodicData]);

  console.log("graph", graphData);
  return (
    <div className="vn-flex vn-flex-col vn-gap-5 vn-max-w-[80%] vn-max-h-full vn-mx-auto">
      {periodError && <p className="vn-text-red-500">{periodError}</p>}
      <div className="vn-flex vn-gap-5">
        {["line", "bar", "pie"].map((type) => (
          <button
            key={type}
            onClick={() =>
              handleGraphTypeChange(type as "bar" | "line" | "pie")
            }
            className={`vn-px-4 vn-py-2 vn-rounded ${
              graphType === type
                ? "vn-bg-blue-600 vn-text-white"
                : "vn-bg-gray-200 vn-text-black"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <div className="vn-flex vn-gap-5">
        {["weekly", "monthly", "yearly"].map((period) => (
          <button
            key={period}
            onClick={() =>
              handleTimelineChange(period as "weekly" | "monthly" | "yearly")
            }
            className={`vn-px-4 vn-py-2 vn-rounded ${
              timeline === period
                ? "vn-bg-green-600 vn-text-white"
                : "vn-bg-gray-200 vn-text-black"
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>
      <div className="vn-bg-white vn-shadow-md vn-rounded-lg vn-p-4 vn-h-[300px] vn-overflow-auto">
        {graphData[timeline] ? (
          <Chart
            key={`${graphType}-${timeline}`}
            type={graphType}
            data={graphData[timeline] || emptyGraphData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { type: "category" },
                y: { type: "linear" },
              },
            }}
          />
        ) : (
          <p className="vn-text-gray-500 vn-text-center">
            No data available for {timeline} timeline.
          </p>
        )}
      </div>
    </div>
  );
};

export default DynamicGraph;
