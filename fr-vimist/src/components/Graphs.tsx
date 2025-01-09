import React, { useState, useEffect, useCallback } from "react";
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

// Register required Chart.js components
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

// Type definitions for Graph Data
type GraphData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string;
    borderWidth: number;
  }[];
};

// Empty data template to handle missing or empty datasets
const emptyGraphData: GraphData = {
  labels: [],
  datasets: [],
};

// Type definitions for transformed data across timelines
type TransformedData = {
  weekly: GraphData | null;
  monthly: GraphData | null;
  yearly: GraphData | null;
};

const DynamicGraph = () => {
  // States to manage selected date, graph data, graph type, and timeline
  const [selectDate, setSelectDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [graphData, setGraphData] = useState<TransformedData>({
    weekly: null,
    monthly: null,
    yearly: null,
  });
  const [graphType, setGraphType] = useState<"bar" | "line" | "pie">("line");
  const [timeline, setTimeline] = useState<"weekly" | "monthly" | "yearly">(
    "weekly"
  );

  // Fetch data from custom hook
  const {
    data: periodicData,
    status: periodState,
    error: periodError,
  } = useFetchSalesByPeriod();

  /**
   * Generate an array of random RGBA colors
   * @param count - Number of colors to generate
   * @returns Array of random RGBA colors
   */

  /**
   * Transform API data into Graph.js-compatible format
   * @param apiData - Raw data fetched from the backend
   * @returns Transformed data for weekly, monthly, and yearly views
   */
  const transformData = useCallback((apiData: any): TransformedData => {

    const generateColors =  (count: number): string[] => {
      return Array.from(
        { length: count },
        () =>
          `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)}, 0.2)`
      );
    };

    const weeklyColors = generateColors(apiData.sales_by_day.length);
    const monthlyColors = generateColors(apiData.sales_by_month.length);
    const yearlyColors = generateColors(apiData.sales_by_year.length);

    return {
      weekly: {
        labels: apiData.sales_by_day.map((record: any) =>
          new Date(record.day).toLocaleDateString("en-US", { weekday: "short" })
        ),
        datasets: [
          {
            label: "Daily Sales",
            data: apiData.sales_by_day.map((record: any) => record.total_sales),
            backgroundColor: weeklyColors,
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
            data: apiData.sales_by_month.map(
              (record: any) => record.total_sales
            ),
            backgroundColor: monthlyColors,
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
            data: apiData.sales_by_year.map(
              (record: any) => record.total_sales
            ),
            backgroundColor: yearlyColors,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
    };
  }, [ ]);

  /**
   * Filter data based on the selected date.
   * This function adjusts the API data for weekly, monthly, and yearly views.
   * @param data - Raw data fetched from the backend
   * @returns Filtered data based on the selected date
   */
  const filterDataByDate = useCallback(
    (data: any) => {
      const date = new Date(selectDate);

      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const month = date.getMonth();
      const year = date.getFullYear();

      return {
        sales_by_day: data.sales_by_day.filter((record: any) => {
          const recordDate = new Date(record.day);
          return recordDate >= startOfWeek && recordDate <= endOfWeek;
        }),
        sales_by_month: data.sales_by_month.filter(
          (record: any) => new Date(record.month).getMonth() === month
        ),
        sales_by_year: data.sales_by_year.filter(
          (record: any) => new Date(record.year).getFullYear() === year
        ),
      };
    },
    [selectDate]
  );

  // Update graph data when API data or selected date changes
  useEffect(() => {
    if (periodState === "succeeded" && periodicData) {
      const filteredData = selectDate
        ? filterDataByDate(periodicData)
        : periodicData;
      setGraphData(transformData(filteredData));
    }
  }, [periodState, periodicData, selectDate, filterDataByDate, transformData]);

  // Rendered Component
  return (
    <div className="vn-flex vn-flex-col vn-gap-5 vn-max-w-[80%] vn-max-h-full vn-mx-auto">
      {periodError && <p className="vn-text-red-500">{periodError}</p>}
      {/* Controls for selecting date and graph type */}
      <div className="vn-flex vn-gap-5">
        <label htmlFor="date" className="vn-text-sm vn-font-medium">
          Select Date
        </label>
        <input
          type="date"
          value={selectDate}
          onChange={(e) => setSelectDate(e.target.value)}
        />
        {["line", "bar", "pie"].map((type) => (
          <button
            key={type}
            onClick={() => setGraphType(type as "bar" | "line" | "pie")}
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

      {/* Timeline control buttons */}
      <div className="vn-flex vn-gap-5">
        {["weekly", "monthly", "yearly"].map((period) => (
          <button
            key={period}
            onClick={() =>
              setTimeline(period as "weekly" | "monthly" | "yearly")
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

      {/* Graph rendering */}
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
