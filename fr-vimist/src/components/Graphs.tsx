import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  BarElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineController, LineElement, BarElement, PointElement, ArcElement, Title, Tooltip, Legend);

// Type definition for dataSets prop
interface DataSets {
  [key: string]: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
}

interface DynamicGraphProps {
  dataSets: DataSets;
}

const DynamicGraph: React.FC<DynamicGraphProps> = ({ dataSets }) => {
  const [graphType, setGraphType] = useState<'bar' | 'line' | 'pie'>('line');
  const [timeline, setTimeline] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  // Handlers for graph type and timeline changes
  const handleGraphTypeChange = (type: 'bar' | 'line' | 'pie') => setGraphType(type);
  const handleTimelineChange = (period: 'weekly' | 'monthly' | 'yearly') => setTimeline(period);

  return (
<div className="vn-flex vn-flex-col vn-gap-5 vn-max-w-[80%] vn-max-h-full vn-mx-auto">
  <div className="vn-flex vn-gap-5">
    {/* Graph Type Buttons */}
    {['line', 'bar', 'pie'].map((type) => (
      <button
        key={type}
        onClick={() => handleGraphTypeChange(type as 'bar' | 'line' | 'pie')}
        className={`vn-px-4 vn-py-2 vn-rounded ${
          graphType === type ? 'vn-bg-blue-600 vn-text-white' : 'vn-bg-gray-200 vn-text-black'
        }`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    ))}
  </div>
  <div className="vn-flex vn-gap-5">
    {/* Timeline Buttons */}
    {['weekly', 'monthly', 'yearly'].map((period) => (
      <button
        key={period}
        onClick={() => handleTimelineChange(period as 'weekly' | 'monthly' | 'yearly')}
        className={`vn-px-4 vn-py-2 vn-rounded ${
          timeline === period ? 'vn-bg-green-600 vn-text-white' : 'vn-bg-gray-200 vn-text-black'
        }`}
      >
        {period.charAt(0).toUpperCase() + period.slice(1)}
      </button>
    ))}
  </div>
  {/* Graph Display */}
  <div className="vn-bg-white vn-shadow-md vn-rounded-lg vn-p-4 vn-h-[300px] vn-overflow-auto">
    <Chart
      type={graphType}
      data={dataSets[timeline]}
      options={{ responsive: true, maintainAspectRatio: false }}
    />
  </div>
</div>

  );
};

export default DynamicGraph;
