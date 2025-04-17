import React from 'react';
import './SummaryStats.css';

interface Props {
  data: {
    name: string;
    mass: number;
    shape: string;
    active: boolean;
  }[];
}

const SummaryStats: React.FC<Props> = ({ data }) => {
  if (!data.length) return null;

  const total = data.length;
  const avgMass = Math.round(data.reduce((sum, s) => sum + s.mass, 0) / total);
  const shapeFreq: Record<string, number> = {};
  data.forEach(s => {
    shapeFreq[s.shape] = (shapeFreq[s.shape] || 0) + 1;
  });
  const mostCommonShape = Object.entries(shapeFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  const activeCount = data.filter(d => d.active).length;
  const inactiveCount = total - activeCount;
  const activePercent = Math.round((activeCount / total) * 100);

  return (
    <div className="summary-stats">
      <div className="summary-box">
        <h4>Total Satellites</h4>
        <p>{total}</p>
      </div>
      <div className="summary-box">
        <h4>Average Mass</h4>
        <p>{avgMass} kg</p>
      </div>
      <div className="summary-box">
        <h4>Most Common Shape</h4>
        <p>{mostCommonShape}</p>
      </div>
      <div className="summary-box">
        <h4>Status</h4>
        <p>{activePercent}% Active ({activeCount}/{total})</p>
      </div>
    </div>
  );
};

export default SummaryStats;
