import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import logo from '../../../../assets/images/MTDlogo.png';
import pause from './pause.module.css';
import { Button, Image, Modal } from 'react-bootstrap';
import { API_URL } from '../../../../api';
import { useCookies } from '../../../../hooks/useCookies';

const PauseMyAccount = () => {
  const { getCookie, setCookie, deleteCookie } = useCookies();
  const [showPause, setshowPause] = useState(false)

  const showUnpause = () => setshowPause(true);
  const handleClosePause = () => setshowPause(false);


  const handlePauseAccount = () => {
    handleClosePause();
    window.location.replace('/user/home');
  }

  const handleUnpause = async () => {
    try {
      const response = await fetch(`${API_URL}/customer/setting/unpause`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`
        }
      });

      if (response.ok) {
        showUnpause(); // Call the function to show the unpause action success
      } else {
        console.error('Failed to unpause account:', response.statusText);
      }
    } catch (err) {
      console.error('Error occurred during unpause request:', err);
    }
  };


  return (
    <Sidebar>
      <div style={{
        flex: "1",
        marginInline: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        overflowY: "auto",
        padding: "2rem"
      }}>
        {/* <div className={pause.logo}>
          <div>
            <Image  src={logo} />
          </div>
        </div> */}
        <div className='logo-progressbar5'>
                        <div className='logo-arrow5'>
                         
                            <Image src={logo} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </div>
          
                    </div>


        <div className={pause.alldetails}>
          <div >
            <svg width="102" height="102" viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M51 102C79.1665 102 102 79.1665 102 51C102 22.8335 79.1665 0 51 0C22.8335 0 0 22.8335 0 51C0 79.1665 22.8335 102 51 102Z" fill="#E5E5E5" />
              <path d="M66.2837 99.5946C67.3609 99.2768 68.4272 98.9235 69.4811 98.5354C71.0644 97.9189 72.616 97.2236 74.1299 96.4522C75.6451 95.6804 77.1207 94.8332 78.5512 93.914C79.9819 92.9964 81.3659 92.0078 82.6979 90.9521C84.0309 89.8947 85.3101 88.7713 86.5307 87.5861C87.7508 86.4012 88.9109 85.156 90.0066 83.8552C91.1015 82.554 92.1306 81.1989 93.0901 79.7948C94.0513 78.3913 94.9417 76.9406 95.7578 75.4481C96.5741 73.956 97.3151 72.4241 97.9783 70.8581C98.6001 69.3733 99.1512 67.8599 99.6299 66.323L67.649 34.3499C65.4647 32.161 62.8693 30.4255 60.012 29.2433C57.1546 28.061 54.0917 27.4553 50.9994 27.461C47.9068 27.4568 44.8437 28.0628 41.9856 29.2442C39.1275 30.4255 36.5305 32.1591 34.3433 34.3455C32.1561 36.532 30.4216 39.1285 29.2393 41.9862C28.057 44.8439 27.45 47.9068 27.4531 50.9994C27.4531 53.4396 27.8258 55.7895 28.5124 58.0021V58.01C28.9674 59.4811 29.5677 60.8934 30.2895 62.2234V62.2312C31.3723 64.232 32.7454 66.0562 34.3421 67.649L66.2837 99.5946Z" fill="#E5E5E5" />
              <path d="M50.9994 27.4609C64.0241 27.4609 74.5379 37.9748 74.5379 50.9994C74.5379 64.024 64.0241 74.5379 50.9994 74.5379C47.9068 74.542 44.8437 73.936 41.9856 72.7547C39.1275 71.5733 36.5305 69.8398 34.3433 67.6533C32.1561 65.4668 30.4216 62.8704 29.2393 60.0127C28.057 57.1549 27.45 54.092 27.4531 50.9994C27.4531 37.9748 37.9748 27.4609 50.9994 27.4609ZM45.1148 41.1917V60.8071H49.0379V41.1917H45.1148ZM52.961 41.1917V60.8071H56.8841V41.1917H52.961Z" fill="white" />
            </svg>
          </div>
          <div className={pause.pausetext}>
            <p>You have paused your profile from being shown to new people</p>
          </div>
          <button className={pause.unpausebutton} onClick={handleUnpause}>
            Unpause Profile
          </button>
        </div>

        <Modal show={showPause} onHide={handleClosePause} centered>
          <Modal.Body className="pause-modal-content">

            <div className="pause-modal-title">Unpause Account</div>
            <div className="pause-modal-message">
              Welcome Back! Your profile is now Active
            </div>
            <div className="d-flex justify-content-center">

              <button className={pause.unpausebutton} onClick={handlePauseAccount}>
                Okay
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </Sidebar>
  );
}

export default PauseMyAccount;
