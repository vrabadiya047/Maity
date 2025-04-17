import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  zoomPlugin
);

interface Props {
  data: {
    year: string;
    active: boolean;
  }[];
}

const LaunchTrendLine: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<any>(null);
  const [zoomed, setZoomed] = useState(false); 

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
        borderColor: '#23A8E0',
        backgroundColor: 'rgba(35, 168, 224, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#23A8E0',
      },
      {
        label: 'Inactive Satellites',
        data: sortedYears.map((y) => yearCounts[y].inactive),
        borderColor: '#FF7A00',
        backgroundColor: 'rgba(255, 122, 0, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#FF7A00',
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: { size: 14 },
        },
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw}`,
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
        title: {
          display: true,
          text: 'Launch Year',
          color: 'white',
          font: { weight: 'bold' },
        },
        ticks: { color: 'white' },
        grid: { color: '#444' },
      },
      y: {
        title: {
          display: true,
          text: 'Satellite Count',
          color: 'white',
          font: { weight: 'bold' },
        },
        beginAtZero: true,
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

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  }, [data]);

  return (
    <div style={{ height: '400px', position: 'relative' }}>
      {/* Reset Zoom Button */}
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

      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default LaunchTrendLine;
