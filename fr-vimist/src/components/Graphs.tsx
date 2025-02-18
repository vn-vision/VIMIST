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

// empty apiData template

type useFetchAPIDataByPeriod = {
  data: [] | any;
  status: string;
  error: string | null;
  dataFor: string;
};

// Type definitions for transformed data across timelines
type TransformedData = {
  weekly: GraphData | null;
  monthly: GraphData | null;
  yearly: GraphData | null;
};

const DynamicGraph = ({
  data: periodicData,
  status: periodState,
  error: periodError,
  dataFor,
}: useFetchAPIDataByPeriod) => {
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

  /**
   * Transform API data into Graph.js-compatible format
   * @param apiData - Raw data fetched from the backend
   * @returns Transformed data for weekly, monthly, and yearly views
   */
  const transformData = useCallback(
    (apiData: any): TransformedData => {
      /**
       * Generate an array of random RGBA colors
       * @param count - Number of colors to generate
       * @returns Array of random RGBA colors
       */
      const generateColors = (count: number): string[] => {
        return Array.from(
          { length: count },
          () =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 256
            )}, ${Math.floor(Math.random() * 256)}, .8)`
        );
      };

      const weeklyColors = generateColors(apiData.by_day?.length);
      const monthlyColors = generateColors(apiData.by_month?.length);
      const yearlyColors = generateColors(apiData.by_year?.length);

      return {
        weekly: {
          labels: apiData.by_day.map((record: any) =>
            new Date(record.day).toLocaleDateString("en-US", {
              weekday: "short",
            })
          ),
          datasets: [
            {
              label: `Daily ${dataFor}`,
              data: apiData.by_day.map((record: any) => record.total_amount),
              backgroundColor: weeklyColors,
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        monthly: {
          labels: apiData.by_month.map((record: any) =>
            new Date(record.month).toLocaleDateString("en-US", {
              month: "short",
            })
          ),
          datasets: [
            {
              label: `Monthly ${dataFor}`,
              data: apiData.by_month.map((record: any) => record.total_amount),
              backgroundColor: monthlyColors,
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        yearly: {
          labels: apiData.by_year.map((record: any) =>
            new Date(record.year).getFullYear().toString()
          ),
          datasets: [
            {
              label: `Yearly ${dataFor}`,
              data: apiData.by_year.map((record: any) => record.total_amount),
              backgroundColor: yearlyColors,
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
      };
    },
    [dataFor]
  );

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
        by_day: data.by_day?.filter((record: any) => {
          const recordDate = new Date(record.day);
          return recordDate >= startOfWeek && recordDate <= endOfWeek;
        }),
        by_month: data.by_month?.filter(
          (record: any) => new Date(record.month).getMonth() === month
        ),
        by_year: data.by_year?.filter(
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
    <div className="vn-flex vn-flex-col vn-w-[100%] vn-h-[100%]">
      {periodError && <p className="vn-text-red-500">{periodError}</p>}

      {/* Controls for selecting date and graph type */}
      <div className="vn-bg-white vn-shadow-md vn-rounded-lg vn-flex vn-items-center vn-justify-evenly vn-gap-1">
        {/* Graph Type Dropdown */}
        <div className="vn-flex vn-items-center vn-gap-1 ">
          <select
            id="graphType"
            value={graphType}
            onChange={(e) =>
              setGraphType(e.target.value as "bar" | "line" | "pie")
            }
            className="vn-p-2 vn-rounded-md vn-border vn-text-primary vn-bg-white vn-text-gray-800 hover:vn-bg-gray-200 focus:vn-text-secondary focus:vn-outline-none"
          >
            {["line", "bar", "pie"].map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Timeline Dropdown */}
        <div className="vn-flex vn-flex-col vn-gap-1">
          <select
            id="timeline"
            value={timeline}
            onChange={(e) =>
              setTimeline(e.target.value as "weekly" | "monthly" | "yearly")
            }
            className="vn-p-2 vn-rounded-md vn-border vn-text-primary vn-bg-white vn-text-gray-800 hover:vn-bg-gray-200 focus:vn-border-green-500 focus:vn-outline-none"
          >
            {["weekly", "monthly", "yearly"].map((period) => (
              <option key={period} value={period}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div className="vn-flex vn-flex-col vn-gap-1">
          <input
            type="date"
            id="date"
            value={selectDate}
            onChange={(e) => setSelectDate(e.target.value)}
            className="vn-p-1 vn-max-w-[70%] vn-rounded-md vn-border vn-text-primary vn-bg-gray-100 vn-text-gray-800 hover:vn-bg-gray-200 focus:vn-border-red-00 focus:vn-outline-none"
          />
        </div>
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
