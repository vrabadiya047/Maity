import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface Props {
  data: {
    year: string;
    active: boolean;
  }[];
}

const LaunchTrendLine: React.FC<Props> = ({ data }) => {
  const yearCounts: Record<string, { active: number; inactive: number }> = {};

  data.forEach(({ year, active }) => {
    if (!year) return;
    if (!yearCounts[year]) {
      yearCounts[year] = { active: 0, inactive: 0 };
    }
    if (active) {
      yearCounts[year].active++;
    } else {
      yearCounts[year].inactive++;
    }
  });

  const sortedYears = Object.keys(yearCounts).sort();

  const chartData = {
    labels: sortedYears,
    datasets: [
      {
        label: 'Active Satellites',
        data: sortedYears.map((y) => yearCounts[y].active),
        borderColor: 'rgba(35, 168, 224, 1)',
        backgroundColor: 'rgba(35, 168, 224, 0.2)',
        fill: false,
        tension: 0.2,
      },
      {
        label: 'Inactive Satellites',
        data: sortedYears.map((y) => yearCounts[y].inactive),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Launch Year', color: 'white' },
        ticks: { color: 'white' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Satellite Count', color: 'white' },
        ticks: { color: 'white' },
      },
    },
  };

 
return (
  <div className="chart-section">
    <h2 className="chart-title">Launch Trend by Year</h2>
    <Line data={chartData} options={options} />
  </div>
);
  
  };

export default LaunchTrendLine;
