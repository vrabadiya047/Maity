import React, { useEffect, useState } from 'react';
import './App.css';

import { SizeVsMassScatter, CrossSectionBar, MissionTypePie, LaunchTrendLine, ShapeClassMassBar } from './components/charts';
import { exportToCSV } from './utils/exportToCSV';
import { imageMap } from './constants/imageMap';
import { fieldLabels } from './constants/fieldLabels';
import { attributesToCompare } from './constants/attributes';
import { rangeMap } from './constants/rangeOptions';
import SummaryStats from './components/SummaryStats';

import './utils/chartSetup';
import { Spacecraft, SpacecraftAttributes } from './types/spacecraft';
import {
  satelliteImage1,
  satelliteImage2,
  satelliteImage3,
  satelliteImage5,
  satelliteImage9,
} from './assets/satelliteImages'; 
import FilterPanel from './components/FilterPanel';
import SatelliteGrid from './components/SatelliteGrid';
import ComparisonModal from './components/ComparisonModal';
import SpaceAnimation from './components/SpaceAnimation';


const App: React.FC = () => {
  const [spacecrafts, setSpacecrafts] = useState<Spacecraft[]>([]);
  const [selectedSatellite, setSelectedSatellite] = useState<Spacecraft | null>(null);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'graph'>('cards');
  const [sortOption, setSortOption] = useState('name');
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');




  const [filters, setFilters] = useState({
    mission: '',
    active: '',
    objectClass: '',
    shape: '',
    year: '',
    massMin: '',
    massMax: '',
    depthMin: '',
    depthMax: '',
    heightMin: '',
    heightMax: '',
    widthMin: '',
    widthMax: '',
    spanMin: '',
    spanMax: '',
    xSectMin: '',
    xSectMax: '',
  });

  const [appliedFilters, setAppliedFilters] = useState({ ...filters });


  useEffect(() => {
    fetch('http://localhost:5003/api/spacecraft')
      .then((res) => res.json())
      .then((data) => {
        const spacecraftData = data.data || data;
        const enriched = spacecraftData.map((item: any, index: number) => ({
          ...item,
          id: item.id || index + 1,
        }));
        setSpacecrafts(enriched);
      })
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    setFiltersApplied(true);
    setViewMode('cards');
  };

  const resetFilters = () => {
    const cleared = Object.fromEntries(Object.keys(filters).map((key) => [key, '']));
    setFilters(cleared as typeof filters);
    setAppliedFilters(cleared as typeof filters);
    setFiltersApplied(false);
    setViewMode('cards');
  };

  const filteredSpacecrafts = spacecrafts.filter(({ attributes }) => {
    const {
      mission,
      active,
      objectClass,
      shape,
      firstEpoch,
      mass,
      depth,
      height,
      width,
      span,
      xSectMin,
      xSectMax,
    } = attributes;

    return (
      (!appliedFilters.mission || mission === appliedFilters.mission) &&
      (!appliedFilters.active || String(active) === appliedFilters.active) &&
      (!appliedFilters.objectClass || objectClass === appliedFilters.objectClass) &&
      (!appliedFilters.shape || shape === appliedFilters.shape) &&
      (!appliedFilters.year || firstEpoch?.startsWith(appliedFilters.year)) &&
      (!appliedFilters.massMin || mass >= parseFloat(appliedFilters.massMin)) &&
      (!appliedFilters.massMax || mass <= parseFloat(appliedFilters.massMax)) &&
      (!appliedFilters.depthMin || depth >= parseFloat(appliedFilters.depthMin)) &&
      (!appliedFilters.depthMax || depth <= parseFloat(appliedFilters.depthMax)) &&
      (!appliedFilters.heightMin || height >= parseFloat(appliedFilters.heightMin)) &&
      (!appliedFilters.heightMax || height <= parseFloat(appliedFilters.heightMax)) &&
      (!appliedFilters.widthMin || width >= parseFloat(appliedFilters.widthMin)) &&
      (!appliedFilters.widthMax || width <= parseFloat(appliedFilters.widthMax)) &&
      (!appliedFilters.spanMin || span >= parseFloat(appliedFilters.spanMin)) &&
      (!appliedFilters.spanMax || span <= parseFloat(appliedFilters.spanMax)) &&
      (!appliedFilters.xSectMin || xSectMin >= parseFloat(appliedFilters.xSectMin)) &&
      (!appliedFilters.xSectMax || xSectMax <= parseFloat(appliedFilters.xSectMax))
    );
  });

  const generateRange = (start: number, end: number, step: number): number[] => {
    const result: number[] = [];
    for (let i = start; i <= end; i += step) {
      result.push(parseFloat(i.toFixed(3)));
    }
    return result;
  };

  return (
    <>
      <div className="app-container">
        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          handleFilterChange={handleFilterChange}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
  
        {/* Main Content */}
        <div className="main-content fade-in">
          {filtersApplied && (
            <>
              {filteredSpacecrafts.length === 0 ? (
                <p>No matching satellites found.</p>
              ) : viewMode === 'graph' ? (
                <div className="card-wrapper elevated">
                  <SizeVsMassScatter
                    data={filteredSpacecrafts.map((s) => ({
                      name: s.attributes.name,
                      mass: s.attributes.mass,
                      width: s.attributes.width,
                      height: s.attributes.height,
                      depth: s.attributes.depth,
                    }))}
                  />
                  <CrossSectionBar
                    data={filteredSpacecrafts.map((s) => ({
                      name: s.attributes.name,
                      xSectMin: s.attributes.xSectMin,
                      xSectMax: s.attributes.xSectMax,
                      span: s.attributes.span,
                    }))}
                  />
                  <MissionTypePie
                    data={filteredSpacecrafts.map((s) => ({
                      mission: s.attributes.mission,
                    }))}
                  />
                  <LaunchTrendLine
                    data={filteredSpacecrafts.map((s) => ({
                      year: s.attributes.firstEpoch?.slice(0, 4) || '',
                      active: s.attributes.active,
                    }))}
                  />
                  <ShapeClassMassBar
                    data={filteredSpacecrafts.map((s) => ({
                      shape: s.attributes.shape,
                      objectClass: s.attributes.objectClass,
                      mass: s.attributes.mass,
                    }))}
                  />
                </div>
              ) : (
                <div className="card-wrapper elevated">
                  <SummaryStats
                    data={filteredSpacecrafts.map((s) => ({
                      name: s.attributes.name,
                      mass: s.attributes.mass,
                      shape: s.attributes.shape,
                      active: s.attributes.active,
                    }))}
                  />
  
                  {/* Top Bar - Sort, Search, Export */}
                  <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  }}
>
  {/* Sort Dropdown */}
  <label style={{ fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    Sort by:
    <select
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: '1px solid #23A8E0',
        backgroundColor: '#fff',
        color: '#000',
        fontWeight: '500',
        cursor: 'pointer',
      }}
    >
      <option value="name">Name (A–Z)</option>
      <option value="name-desc">Name (Z–A)</option>
      <option value="mass">Mass (Low to High)</option>
      <option value="mass-desc">Mass (High to Low)</option>
      <option value="year">Launch Year (Newest First)</option>
      <option value="year-asc">Launch Year (Oldest First)</option>
    </select>
  </label>

  {/* Search Bar */}
  <input
    type="text"
    placeholder="🔍 Search by Name or ID..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      flex: 1,
      minWidth: '250px',
      maxWidth: '400px',
      padding: '0.4rem 1rem',
      borderRadius: '8px',
      border: '1px solid #23A8E0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      fontSize: '1rem',
    }}
  />

  {/* Export and Compare Buttons */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', alignItems: 'flex-end' }}>
    <button
      onClick={() => {
        const exportData = filteredSpacecrafts.map((s) => ({
          ID: s.id,
          Name: s.attributes.name,
          Mission: s.attributes.mission,
          Active: s.attributes.active,
          Mass: s.attributes.mass,
          Shape: s.attributes.shape,
          Width: s.attributes.width,
          Height: s.attributes.height,
          Depth: s.attributes.depth,
          Span: s.attributes.span,
          'Cross Section Min': s.attributes.xSectMin,
          'Cross Section Max': s.attributes.xSectMax,
          'Launch Date': s.attributes.firstEpoch,
        }));
        exportToCSV(exportData, 'Filtered_Satellites');
      }}
      className="download-btn"
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#23A8E0',
        borderRadius: '8px',
        color: '#fff',
        border: 'none',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        cursor: 'pointer',
        transition: '0.3s',
        minWidth: '160px',
textAlign: 'center',
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1b89b8')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#23A8E0')}
    >
      ⬇️ Export as CSV
    </button>

    {selectedForComparison.length >= 2 && (
      <button
        className="compare-btn"
        onClick={() => setShowComparison(true)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#FF7A00',
          borderRadius: '8px',
          color: '#fff',
          border: 'none',
          fontWeight: 'bold',
          fontSize: '0.8rem',
          minWidth: '160px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: '0.3s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e06a00')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF7A00')}
      >
        🧮 Compare {selectedForComparison.length} Satellites
      </button>
    )}
  </div>
</div>

  
                  {/* Satellite Grid */}
                  <SatelliteGrid
                    filteredSpacecrafts={filteredSpacecrafts}
                    searchTerm={searchTerm}
                    sortOption={sortOption}
                    selectedForComparison={selectedForComparison}
                    setSelectedForComparison={setSelectedForComparison}
                    setSelectedSatellite={setSelectedSatellite}
                  />

  
                  {/* Comparison Modal */}
                  {showComparison && (
                    <ComparisonModal
                      spacecrafts={spacecrafts}
                      selectedForComparison={selectedForComparison}
                      setShowComparison={setShowComparison}
                    />
                  )}
                </div>
              )}
  
              {/* Satellite Details Modal */}
              {selectedSatellite && (
                <div className="modal" onClick={() => setSelectedSatellite(null)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={() => setSelectedSatellite(null)}>
                      ×
                    </button>
                    <h2>Satellite Details</h2>
                    <ul>
                      {Object.entries(selectedSatellite.attributes).map(([key, val]) => (
                        <li key={key}>
                          <strong>{fieldLabels[key] || key}:</strong> {String(val)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
  
      {/* Space Animation */}
      <SpaceAnimation filtersApplied={filtersApplied} />
    </>
  );
  
};

export default App;
