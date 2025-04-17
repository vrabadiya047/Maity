import React, { useRef, useState } from 'react';
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
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, zoomPlugin);

interface Props {
  data: {
    name: string;
    xSectMin: number;
    xSectMax: number;
    span: number;
  }[];
}

const CrossSectionBar: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<any>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label: 'Min Cross Section (m²)',
        data: data.map((d) => d.xSectMin),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
      {
        label: 'Max Cross Section (m²)',
        data: data.map((d) => d.xSectMax),
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
      },
      {
        label: 'Span (m)',
        data: data.map((d) => d.span),
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: 'transparent',
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'xy',
          onZoomComplete: () => {
            setIsZoomed(true);  // When user zooms, show the button
          },
        },
        pan: {
          enabled: true,
          mode: 'xy',
          onPanComplete: () => {
            setIsZoomed(true);  // When user pans, show the button
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
        ticks: {
          color: 'white',
        },
        title: {
          display: true,
          text: 'Meters² or Meters',
          color: 'white',
          font: { weight: 'bold' },
        },
      },
    },
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
      setIsZoomed(false);
    }
  };

  return (
    <div style={{ height: '450px', position: 'relative' }}>
      {isZoomed && (
        <button
          onClick={handleResetZoom}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#23A8E0',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            zIndex: 10,
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        >
          🔄 Reset Zoom
        </button>
      )}

      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default CrossSectionBar;
