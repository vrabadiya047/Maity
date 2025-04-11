import React, { useEffect, useState } from 'react';
import './App.css';
import SizeVsMassScatter from './components/charts/SizeVsMassScatter';
import CrossSectionBar from './components/charts/CrossSectionBar';
import MissionTypePie from './components/charts/MissionTypePie';
import LaunchTrendLine from './components/charts/LaunchTrendLine';
import ShapeClassMassBar from './components/charts/ShapeClassMassBar';
import SummaryStats from './components/SummaryStats';
import { exportToCSV } from './utils/exportToCSV';


import satelliteImage1 from './assets/satellite1.png';
import satelliteImage2 from './assets/satellite2.png';
import satelliteImage3 from './assets/satellite3.png';
import satelliteImage4 from './assets/satellite4.png';
import satelliteImage5 from './assets/satellite5.png';
import satelliteImage6 from './assets/satellite6.png';
import satelliteImage7 from './assets/satellite7.png';
import satelliteImage8 from './assets/satellite8.png';
import satelliteImage9 from './assets/satellite9.png';
import satelliteImage10 from './assets/satellite10.png';
import satelliteImage11 from './assets/satellite11.png';
import satelliteImage12 from './assets/satellite12.png';
import satelliteImage13 from './assets/satellite13.png';
import satelliteImage14 from './assets/satellite14.png';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



interface SpacecraftAttributes {
  name: string;
  mission: string;
  active: boolean;
  mass: number;
  objectClass: string;
  shape: string;
  firstEpoch: string;
  [key: string]: any;
}

interface Spacecraft {
  id: number;
  attributes: SpacecraftAttributes;
}

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

  const imageMap: Record<string, string> = {
    'Starlink 2044': satelliteImage1,
    'Starlink 5898': satelliteImage2,
    'Starlink 1869': satelliteImage3,
    'Starlink 2352': satelliteImage4,
    'Fengtai-2 (CAS-5A)': satelliteImage5,
    'Yarilo-1': satelliteImage6,
    'LignoSat': satelliteImage7,
    'Starlink 31173': satelliteImage8,
    'Starlink 4354': satelliteImage9,
    'Starlink 1953': satelliteImage10,
    'Starlink 6339': satelliteImage11,
    'Xi\'an Hangtou 112': satelliteImage12,
    'Starlink 6300': satelliteImage13,
    'Shiyan 16A': satelliteImage14,
    'Starlink 4749': satelliteImage5,
    'Starlink 1798': satelliteImage1,
    'Pearl White 2': satelliteImage2,
    'Lemur-2 NanaZ': satelliteImage3,
    'ICEYE-X19': satelliteImage4,
    'Flock 1c-11': satelliteImage5,
    'Flock 4y-4': satelliteImage6,
    'Xingshidai-17': satelliteImage7,
    'Starlink 1715': satelliteImage8,
    'Starlink 2372': satelliteImage9,
    'Starlink 1393': satelliteImage10,
    'Starlink 1990': satelliteImage11,
    'Starlink 2260': satelliteImage12,
    'Starlink 1907': satelliteImage13,
    'Starlink 2056': satelliteImage14,
    'EYE 1': satelliteImage5,

  };

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

  const fieldLabels: Record<string, string> = {
    active: "Active Status",
    cataloguedFragments: "Cataloged Fragments",
    cosparId: "COSPAR ID",
    depth: "Depth (m)",
    firstEpoch: "Launch Date",
    height: "Height (m)",
    mass: "Mass (kg)",
    mission: "Mission Type",
    name: "Satellite Name",
    objectClass: "Object Class",
    onOrbitCataloguedFragments: "On-Orbit Cataloged Fragments",
    satno: "NORAD Number",
    shape: "Shape",
    span: "Span (m)",
    width: "Width (m)",
    xSectAvg: "Avg Cross Section (m²)",
    xSectMax: "Max Cross Section (m²)",
    xSectMin: "Min Cross Section (m²)",
    year: "Launch Year"
  };

  const attributesToCompare = [
    'name',
    'mass',
    'shape',
    'span',
    'mission',
    'firstEpoch',
    'objectClass',
    'xSectMin',
    'xSectMax',
    'width',
    'height',
    'depth',
    'active'
  ];


  const generateRange = (start: number, end: number, step: number): number[] => {
    const result: number[] = [];
    for (let i = start; i <= end; i += step) {
      result.push(parseFloat(i.toFixed(3)));
    }
    return result;
  };

  const rangeMap: Record<string, number[]> = {
    mass: generateRange(0, 500, 10),
    depth: generateRange(0, 5, 0.1),
    height: generateRange(0, 5, 0.1),
    width: generateRange(0, 10, 0.1),
    span: generateRange(0, 20, 0.5),
    xSectMin: generateRange(0, 5, 0.1),
    xSectMax: generateRange(0, 50, 1),
  };

  return (
    <>
      <div className="app-container">
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
                  {options.map((opt) => (
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
                    {rangeMap[field].map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                  <select
                    name={`${field}Max`}
                    value={filters[`${field}Max` as keyof typeof filters]}
                    onChange={handleFilterChange}
                  >
                    <option value="">Max</option>
                    {rangeMap[field].map((val) => (
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


        <div className="main-content fade-in">
          {filtersApplied && (
            <>

              {filteredSpacecrafts.length === 0 ? (
                <p>No matching satellites found.</p>
              ) : viewMode === 'graph' ? (
                <div className="card-wrapper elevated">

                  <SizeVsMassScatter
                    data={filteredSpacecrafts.map(s => ({
                      name: s.attributes.name,
                      mass: s.attributes.mass,
                      width: s.attributes.width,
                      height: s.attributes.height,
                      depth: s.attributes.depth,
                    }))}
                  />

                  <CrossSectionBar
                    data={filteredSpacecrafts.map(s => ({
                      name: s.attributes.name,
                      xSectMin: s.attributes.xSectMin,
                      xSectMax: s.attributes.xSectMax,
                      span: s.attributes.span,
                    }))}
                  />

                  <MissionTypePie
                    data={filteredSpacecrafts.map(s => ({
                      mission: s.attributes.mission,
                    }))}
                  />
                  <LaunchTrendLine
                    data={filteredSpacecrafts.map(s => ({
                      year: s.attributes.firstEpoch?.slice(0, 4) || '',
                      active: s.attributes.active
                    }))}
                  />
                  <ShapeClassMassBar
                    data={filteredSpacecrafts.map(s => ({
                      shape: s.attributes.shape,
                      objectClass: s.attributes.objectClass,
                      mass: s.attributes.mass,
                    }))}
                  />




                </div>
              ) : (
                <div className="card-wrapper elevated">
                  <SummaryStats
                    data={filteredSpacecrafts.map(s => ({
                      name: s.attributes.name,
                      mass: s.attributes.mass,
                      shape: s.attributes.shape,
                      active: s.attributes.active,
                    }))}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      flexWrap: 'wrap',
                      marginBottom: '1rem',
                    }}
                  >
                    <label style={{ fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Sort by:
                      <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="name">Name (A–Z)</option>
                        <option value="name-desc">Name (Z–A)</option>
                        <option value="mass">Mass (Low to High)</option>
                        <option value="mass-desc">Mass (High to Low)</option>
                        <option value="year">Launch Year (Newest First)</option>
                        <option value="year-asc">Launch Year (Oldest First)</option>
                      </select>
                    </label>


                    <input
                      type="text"
                      placeholder="🔍 Search by Name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        flex: 1,
                        minWidth: '200px',
                        maxWidth: '300px',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        marginLeft: '20rem',
                        border: '1px solid #ccc',
                      }}
                    />


                    <button
                      onClick={() => {
                        const exportData = filteredSpacecrafts.map(s => ({
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
                      style={{ whiteSpace: 'nowrap' }} 
                    >
                      ⬇️ Export as CSV
                    </button>
                  </div>





                  <div className="grid-container">
                    {selectedForComparison.length >= 2 && (
                      <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                        <button onClick={() => setShowComparison(true)} className="compare-btn">
                          🧮 Compare {selectedForComparison.length} Satellites
                        </button>
                      </div>
                    )}

                  </div>



                  <div className="grid-container">
                    {[...filteredSpacecrafts]
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
                      })

                      .map((sat) => (

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

                  {showComparison && (
                    <div className="modal" onClick={() => setShowComparison(false)}>
                      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setShowComparison(false)}>×</button>
                        <h2 style={{ textAlign: 'center', color: '#23A8E0' }}>🛰️ Comparison Table</h2>
                        <div className="comparison-grid-wrapper">
                          <table className="comparison-table">
                            <thead>
                              <tr>
                                <th>Attribute</th>
                                {spacecrafts
                                  .filter(s => selectedForComparison.includes(s.id))
                                  .map(s => (
                                    <th key={s.id}>{s.attributes.name}</th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>
                              {attributesToCompare.map(attr => (
                                <tr key={attr}>
                                  <td style={{ fontWeight: 'bold' }}>{fieldLabels[attr] || attr}</td>
                                  {spacecrafts
                                    .filter(s => selectedForComparison.includes(s.id))
                                    .map(s => (
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
                  )}




                </div>
              )}

              {selectedSatellite && (
                <div className="modal" onClick={() => setSelectedSatellite(null)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={() => setSelectedSatellite(null)}>&times;</button>
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


      <div className="space-animation">
        <div className={`earth ${filtersApplied ? 'earth-dim' : 'earth-bright'}`}></div>


        <div className="orbit-container orbit1">
          <img src={satelliteImage1} alt="sat1" className="orbit-sat" style={{ transform: 'rotate(0deg) translateX(140px) rotate(0deg)' }} />
        </div>

        <div className="orbit-container orbit2">
          <img src={satelliteImage2} alt="sat2" className="orbit-sat" style={{ transform: 'rotate(0deg) translateX(200px) rotate(0deg)' }} />
        </div>

        <div className="orbit-container orbit3">
          <img src={satelliteImage5} alt="sat3" className="orbit-sat" style={{ transform: 'rotate(0deg) translateX(260px) rotate(0deg)' }} />
        </div>

        <div className="orbit-container orbit4">
          <img src={satelliteImage3} alt="sat4" className="orbit-sat" style={{ transform: 'rotate(0deg) translateX(320px) rotate(0deg)' }} />
        </div>

        <div className="orbit-container orbit5">
          <img src={satelliteImage9} alt="sat5" className="orbit-sat" style={{ transform: 'rotate(0deg) translateX(400px) rotate(0deg)' }} />
        </div>
      </div>
    </>
  );
};

export default App;
