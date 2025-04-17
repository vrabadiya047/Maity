import React from 'react';
import { Spacecraft } from '../types/spacecraft';
import { attributesToCompare } from '../constants/attributes';
import { fieldLabels } from '../constants/fieldLabels';

interface ComparisonModalProps {
  spacecrafts: Spacecraft[];
  selectedForComparison: number[];
  setShowComparison: (show: boolean) => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  spacecrafts,
  selectedForComparison,
  setShowComparison,
}) => {
  const selectedSpacecrafts = spacecrafts.filter((s) => selectedForComparison.includes(s.id));

  return (
    <div className="modal" onClick={() => setShowComparison(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={() => setShowComparison(false)}>×</button>
        <h2 style={{ textAlign: 'center', color: '#23A8E0' }}>🛰️ Comparison Table</h2>
        <div className="comparison-grid-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Attribute</th>
                {selectedSpacecrafts.map(s => (
                  <th key={s.id}>{s.attributes.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attributesToCompare.map(attr => (
                <tr key={attr}>
                  <td style={{ fontWeight: 'bold' }}>{fieldLabels[attr] || attr}</td>
                  {selectedSpacecrafts.map(s => (
                    <td key={s.id + '-' + attr}>
                      {attr === 'firstEpoch'
                        ? s.attributes[attr]?.slice(0, 10)
                        : String(s.attributes[attr] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
