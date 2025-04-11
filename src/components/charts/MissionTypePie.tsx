// components/charts/MissionTypePie.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: {
    mission: string;
  }[];
}

const MissionTypePie: React.FC<Props> = ({ data }) => {
  const missionCounts: Record<string, number> = {};

  data.forEach(item => {
    if (!missionCounts[item.mission]) {
      missionCounts[item.mission] = 1;
    } else {
      missionCounts[item.mission]++;
    }
  });

  const chartData = {
    labels: Object.keys(missionCounts),
    datasets: [
      {
        label: 'Mission Type',
        data: Object.values(missionCounts),
        backgroundColor: [
          'rgba(35, 168, 224, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        },
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  

return (
  <div className="chart-section">
    <h2 className="chart-title">Mission Type Distribution</h2>
    <Pie data={chartData} options-={options} />
  </div>
);
  
  };

export default MissionTypePie;
