import React from 'react';
import './ProgressCircles.css'; // Import the CSS file
import profilepic from '../../../../assets/images/profilepic.png'
import { Image } from 'react-bootstrap';
const ProfileProgress = ({ completion,profilepic }) => {
  const progressClass = completion > 50 ? 'over50' : '';

  const leftStyle = {
    transform: `rotate(${completion > 50 ? 180 : (completion / 100) * 360}deg)`
  };

  const rightStyle = {
    transform: `rotate(${completion > 50 ? ((completion - 50) / 100) * 360 : 0}deg)`
  };

  return (
    <div className="row d-flex  ">
      <div className="col-md-6">
        <div className={`progress blue ${progressClass}`}>
          <span className="progress-left">
            <span 
              className="progress-bar" 
              style={leftStyle}
            ></span>
          </span>
          <span className="progress-right">
            <span 
              className="progress-bar" 
              style={rightStyle}
            ></span>
          </span>
          <div className="progress-value" style={{ backgroundImage: `url(${profilepic})` }}>
           
          </div>
          <div>
         
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default ProfileProgress;
