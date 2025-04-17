import React from 'react';
import {
  satelliteImage1,
  satelliteImage2,
  satelliteImage3,
  satelliteImage5,
  satelliteImage9,
} from '../assets/satelliteImages';

interface SpaceAnimationProps {
  filtersApplied: boolean;
}

const SpaceAnimation: React.FC<SpaceAnimationProps> = ({ filtersApplied }) => {
  return (
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
  );
};

export default SpaceAnimation;
