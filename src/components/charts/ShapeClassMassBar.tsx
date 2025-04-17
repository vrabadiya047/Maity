import React, { useRef, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title, zoomPlugin);

interface Props {
  data: {
    shape: string;
    objectClass: string;
    mass: number;
  }[];
}

const ShapeClassMassBar: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<any>(null);
  const [zoomed, setZoomed] = useState(false);

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

  const shapes = [...new Set(data.map((d) => d.shape))];
  const classes = [...new Set(data.map((d) => d.objectClass))];

  const datasets = classes.map((cls, i) => ({
    label: cls,
    data: shapes.map((shape) => {
      const key = `${shape}__${cls}`;
      const group = groupMap[key];
      return group ? group.total / group.count : 0;
    }),
    backgroundColor: `hsl(${i * 60}, 70%, 60%)`,
    borderRadius: 8,
    barThickness: 30,
  }));

  const chartData = {
    labels: shapes,
    datasets,
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'white', font: { size: 14 } },
        position: 'top',
      },
      
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw.toFixed(2)} kg`,
        },
      },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'xy',
          onZoom: () => setZoomed(true),
        },
        pan: {
          enabled: true,
          mode: 'xy',
          onPan: () => setZoomed(true),
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Shape', color: 'white', font: { weight: 'bold' } },
        ticks: { color: 'white' },
        grid: { color: '#444' },
      },
      y: {
        title: { display: true, text: 'Average Mass (kg)', color: 'white', font: { weight: 'bold' } },
        ticks: { color: 'white' },
        grid: { color: '#444' },
      },
    },
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
      setZoomed(false);
    }
  };

  return (
    <div style={{ height: '450px', position: 'relative' }}>
      {zoomed && (
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <button
            onClick={handleResetZoom}
            style={{
              backgroundColor: '#23A8E0',
              color: 'white',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: '0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1B89B8')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#23A8E0')}
          >
            🔄 Reset Zoom
          </button>
        </div>
      )}

      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default ShapeClassMassBar;
