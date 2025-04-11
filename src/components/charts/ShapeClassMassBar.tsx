// components/charts/ShapeClassMassBar.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  data: {
    shape: string;
    objectClass: string;
    mass: number;
  }[];
}

const ShapeClassMassBar: React.FC<Props> = ({ data }) => {
  const groupMap: Record<string, { total: number; count: number }> = {};

  data.forEach(({ shape, objectClass, mass }) => {
    const key = `${shape}__${objectClass}`;
    if (!groupMap[key]) {
      groupMap[key] = { total: mass, count: 1 };
    } else {
      groupMap[key].total += mass;
      groupMap[key].count++;
    }
  });

  const shapes = [...new Set(data.map(d => d.shape))];
  const classes = [...new Set(data.map(d => d.objectClass))];

  const datasets = classes.map((cls, i) => {
    return {
      label: cls,
      data: shapes.map(shape => {
        const key = `${shape}__${cls}`;
        const group = groupMap[key];
        return group ? group.total / group.count : 0;
      }),
      backgroundColor: `hsl(${i * 60}, 70%, 60%)`,
    };
  });

  const chartData = {
    labels: shapes,
    datasets
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: 'white' }
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Shape', color: 'white' },
        ticks: { color: 'white' }
      },
      y: {
        title: { display: true, text: 'Avg Mass (kg)', color: 'white' },
        ticks: { color: 'white' }
      }
    }
  };

 
  return (
    <div className="chart-section">
      <h2 className="chart-title">Avg Mass by Shape & Object Class</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
  
};

export default ShapeClassMassBar;
