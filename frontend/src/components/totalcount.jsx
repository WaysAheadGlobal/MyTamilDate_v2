import React, { useState, useEffect } from 'react';
import vd3 from '../assets/images/vd3.png'
import { Image } from 'react-bootstrap';
import './video.css';
import { API_URL } from '../api';
const TotalCount = () => {
  const [totalCount, setTotalCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}admin/users/paymentstatu`);
        if (response.ok) {
          const data = await response.json();
          // Assuming the response contains an array and you want to count its length
          setTotalCount(data.length);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      // Cleanup code (if any)
    };
  }, []);

  return (
    <div>
      {totalCount !== null ? (
        <div>Total Count: {totalCount}</div>
      ) : (
        <div>Loading...</div>
      )}

      <div>
      <a href='https://www.instagram.com/mytamildate/' target="_blank" className="video-item">
                                <Image   src={vd3} />
                                <div className='play-btn'></div>
                            </a>
      </div>
      {/* <img src={vd3} alt="" /> */}
    </div>
  );
};

export default TotalCount;
