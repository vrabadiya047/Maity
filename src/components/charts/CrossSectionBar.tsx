// components/charts/CrossSectionBar.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  data: {
    name: string;
    xSectMin: number;
    xSectMax: number;
    span: number;
  }[];
}

const CrossSectionBar: React.FC<Props> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: 'Min Cross Section (m²)',
        data: data.map(d => d.xSectMin),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
      {
        label: 'Max Cross Section (m²)',
        data: data.map(d => d.xSectMax),
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
      },
      {
        label: 'Span (m)',
        data: data.map(d => d.span),
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
      },
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: { color: 'white' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: 'white' },
        title: {
          display: true,
          text: 'Meters² or Meters',
          color: 'white'
        }
      }
    }
  };

  return (
    <div className="chart-section">
      <h2 className="chart-title">Cross Section vs Span</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CrossSectionBar;
