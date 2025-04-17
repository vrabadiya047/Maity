import React from 'react';
import { Spacecraft } from '../types/spacecraft';
import { imageMap } from '../constants/imageMap';
import {
  satelliteImage1,
} from '../assets/satelliteImages';

interface SatelliteGridProps {
  filteredSpacecrafts: Spacecraft[];
  searchTerm: string;
  sortOption: string;
  selectedForComparison: number[];
  setSelectedForComparison: (ids: number[]) => void;
  setSelectedSatellite: (sat: Spacecraft | null) => void;
}

const SatelliteGrid: React.FC<SatelliteGridProps> = ({
  filteredSpacecrafts,
  searchTerm,
  sortOption,
  selectedForComparison,
  setSelectedForComparison,
  setSelectedSatellite,
}) => {
  const sortedAndFiltered = [...filteredSpacecrafts]
    .filter((sat) => {
      const idMatch = String(sat.id).includes(searchTerm.trim());
      const nameMatch = sat.attributes.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
      return idMatch || nameMatch;
    })
    .sort((a, b) => {
      const nameA = a.attributes.name.toLowerCase();
      const nameB = b.attributes.name.toLowerCase();
      const massA = a.attributes.mass;
      const massB = b.attributes.mass;
      const yearA = parseInt(a.attributes.firstEpoch?.slice(0, 4) || '0');
      const yearB = parseInt(b.attributes.firstEpoch?.slice(0, 4) || '0');

      switch (sortOption) {
        case 'name':
          return nameA.localeCompare(nameB);
        case 'name-desc':
          return nameB.localeCompare(nameA);
        case 'mass':
          return massA - massB;
        case 'mass-desc':
          return massB - massA;
        case 'year':
          return yearB - yearA;
        case 'year-asc':
          return yearA - yearB;
        default:
          return 0;
      }
    });

  return (
    <div className="grid-container">
      {sortedAndFiltered.map((sat) => (
        <div className="grid-item" key={sat.id} onClick={() => setSelectedSatellite(sat)} style={{ position: 'relative' }}>
          <input
            type="checkbox"
            checked={selectedForComparison.includes(sat.id)}
            onClick={(e) => e.stopPropagation()}
            onChange={() => {
              if (selectedForComparison.includes(sat.id)) {
                setSelectedForComparison(selectedForComparison.filter(id => id !== sat.id));
              } else {
                setSelectedForComparison([...selectedForComparison, sat.id].slice(-3));
              }
            }}
            style={{ position: 'absolute', top: '8px', left: '8px', transform: 'scale(1.2)' }}
            title="Select to compare"
          />
          <img
            loading="lazy"
            src={imageMap[sat.attributes.name] || satelliteImage1}
            alt={`Image of ${sat.attributes.name}`}
            className="satellite-image"
          />
          <div className="details">
            <h3>Satellite ID: {sat.id}</h3>
            <p>Name: {sat.attributes.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SatelliteGrid;
