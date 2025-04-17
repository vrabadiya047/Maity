import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  ScatterController,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  Filler,
  CategoryScale,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  ScatterController,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  Filler,
  CategoryScale,
  zoomPlugin
);

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
  const chartRef = useRef<any>(null);
  const [zoomed, setZoomed] = useState(false);

  const scatterData = {
    datasets: [
      {
        label: 'Satellite Mass vs Size',
        data: data.map((sat) => ({
          x: sat.mass,
          y: sat.width,
          r: Math.max(5, Math.sqrt(sat.mass) / 10),
          name: sat.name,
        })),
        backgroundColor: '#23A8E0',
        pointRadius: (ctx: any) => ctx.raw?.r || 5,
        pointHoverRadius: (ctx: any) => (ctx.raw?.r || 5) * 1.5,
        pointHoverBackgroundColor: '#FF7A00',
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Mass (kg)',
          color: '#ffffff',
          font: { weight: 'bold' },
        },
        ticks: { color: 'white' },
        grid: { color: '#444' },
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Width (m)',
          color: '#ffffff',
          font: { weight: 'bold' },
        },
        ticks: { color: 'white' },
        grid: { color: '#444' },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const point = ctx.raw;
            return `Name: ${point.name}, Mass: ${point.x}kg, Width: ${point.y}m`;
          },
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
      legend: { display: false },
    },
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
      setZoomed(false);
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  }, [data]);

  return (
    <div style={{ height: '400px', position: 'relative' }}>
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
              fontSize: '0.9rem',
              transition: '0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1B89B8')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#23A8E0')}
          >
            🔄 Reset Zoom
          </button>
        </div>
      )}

      <Scatter ref={chartRef} data={scatterData} options={options} />
    </div>
  );
};

export default SizeVsMassScatter;
