import React from 'react';
import { fieldLabels } from '../constants/fieldLabels';
import { rangeMap } from '../constants/rangeOptions';

interface FilterPanelProps {
  filters: any;
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  viewMode: 'cards' | 'graph';
  setViewMode: (mode: 'cards' | 'graph') => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  handleFilterChange,
  applyFilters,
  resetFilters,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="filter-panel right">
      <div className="filter-logo">
        <img src="/Logo.svg" alt="Logo" />
      </div>

      <div className="filter-fields">
        <h3>Filter Satellites</h3>

        {([
          ['mission', ['Commercial Communications', 'Amateur Communications', 'Defense Technology', 'Commercial Imaging', 'Amateur Technology']],
          ['active', ['true', 'false']],
          ['objectClass', ['Payload', 'Debris']],
          ['shape', ['Box', 'Box + 1 Pan', 'Box + 2 Pan']],
          ['year', ['2020', '2021', '2022', '2023', '2024']],
        ] as const).map(([key, options]) => (
          <label key={key}>
            {fieldLabels[key]}:
            <select name={key} value={filters[key]} onChange={handleFilterChange}>
              <option value="">All</option>
              {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
        ))}

        {[
          ['mass', 'Mass (kg)'],
          ['depth', 'Depth'],
          ['height', 'Height'],
          ['width', 'Width'],
          ['span', 'Span'],
          ['xSectMin', 'Min Cross Section'],
          ['xSectMax', 'Max Cross Section'],
        ].map(([field, label]) => (
          <label key={field}>
            {label}:
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                name={`${field}Min`}
                value={filters[`${field}Min` as keyof typeof filters]}
                onChange={handleFilterChange}
              >
                <option value="">Min</option>
                {rangeMap[field].map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
              <select
                name={`${field}Max`}
                value={filters[`${field}Max` as keyof typeof filters]}
                onChange={handleFilterChange}
              >
                <option value="">Max</option>
                {rangeMap[field].map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          </label>
        ))}

        <div className="toggle-container">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={viewMode === 'graph'}
              onChange={() => setViewMode(viewMode === 'cards' ? 'graph' : 'cards')}
            />
            <span className="slider" />
          </label>
          <span>{viewMode === 'cards' ? 'Cards View' : 'Graph View'}</span>
        </div>

        <button onClick={applyFilters}>Apply Filters</button>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={resetFilters}>Reset Filters</button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
