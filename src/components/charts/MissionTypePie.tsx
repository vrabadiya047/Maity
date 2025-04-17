import React, { useRef, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(ArcElement, Tooltip, Legend, Title, zoomPlugin);

interface Props {
  data: {
    mission: string;
  }[];
}

const MissionTypePie: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<any>(null);

  const missionCounts: Record<string, number> = {};

  data.forEach((item) => {
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
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(0, 255, 255, 0.6)',
        ],
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 2,
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
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
      
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        },
      },
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.resetZoom?.();
    }
  }, [data]);

  return (
    <div style={{ height: '400px', position: 'relative' }}>
      <Pie ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default MissionTypePie;
