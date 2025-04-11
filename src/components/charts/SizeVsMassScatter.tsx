// components/charts/SizeVsMassScatter.tsx
import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface Props {
  data: {
    name: string;
    mass: number;
    width: number;
    height: number;
    depth: number;
  }[];
}

const SizeVsMassScatter: React.FC<Props> = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: 'Mass vs Volume',
        data: data.map(item => ({
          x: item.width * item.height * item.depth,
          y: item.mass,
          label: item.name,
        })),
        backgroundColor: 'rgba(35, 168, 224, 0.6)',
        borderColor: 'rgba(35, 168, 224, 1)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const label = ctx.raw.label || '';
            return `${label} - Volume: ${ctx.raw.x.toFixed(2)} m³, Mass: ${ctx.raw.y} kg`;
          }
        }
      },
      legend: {
        labels: {
          color: 'white',
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Volume (m³)', color: 'white' },
        ticks: { color: 'white' }
      },
      y: {
        title: { display: true, text: 'Mass (kg)', color: 'white' },
        ticks: { color: 'white' }
      }
    }
  };

  return (
    <div className="chart-section">
      <h2 className="chart-title">Mass vs Volume</h2>
      <Scatter data={chartData} options={options} />
    </div>
  );
  
};

export default SizeVsMassScatter;
