
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import bgl from "../assets/images/l-bg.png";
import bgr from "../assets/images/r-bg.png";
import bgl from "../assets/images/mobilewelcomepic.png";

import newdesktop from "../assets/images/successdesktop.png"
import mobileBg from "../assets/images/responsive-bg.png";
import getstart from "../assets/images/getstart.png";
import './get-started.css'

export const GetStarted = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = React.useState(false);
  const goToBasicDetails = () => {
    navigate("/basicdetails");
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobile(true);
    } else {
      setMobile(false);
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    })
  }, [])

  return (

    <>
{
  mobile && 
  <section style={{

    position: "relative",
    maxHeight: "100dvh",
    height: "100dvh",
    
    
  }}>
    {/* <img src={bgl} alt="" style={{
      width: "100%",
      height: "100dvh",
      objectFit: "cover",
    }} /> */}
    {/* <img src={bgr} alt="" style={{
      width: "100%",
      height: "100dvh",
      objectFit: "cover",
    }} /> */}
<div 
style={{
  backgroundImage: `url(${mobile ? bgl : newdesktop})`,
  backgroundSize: "cover",
  backgroundPosition:  "center",
  backgroundRepeat: "no-repeat", 
}}>
<div style={{
        maxWidth: "100%",
        height: "100dvh",
                
        display: "flex",
        flexDirection: "column",
      }}>
        <div
          style={{
            marginTop: "auto",
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 41.92%, rgba(0, 0, 0, 0.8) 100%)",
            color: "white",
            padding: "2rem",
            height: "fit-content",
          }}
        >
          <p style={{
            fontSize: "30px",
            fontWeight: "700",
            lineHeight: "36px",
            letterSpacing: "1.765517234802246px",
            textAlign: "center",
          }}>Welcome to myTamiIDate!</p>
          <p style={{
            marginTop: "1em",
            fontSize: "16px",
            fontWeight: "400",
            lineHeight: "24px",
            textAlign: "center",
          }}>Amazing people join MTD everyday, and one could be your perfect match!</p>
          <p style={{
            marginTop: "1em",
            fontSize: "16px",
            fontWeight: "400",
            lineHeight: "24px",
            textAlign: "center",
          }}>A detailed, authentic & complete profile increases your chances of finding meaningful connections.</p>
          <button style={{
            marginTop: "2rem",
            background: "linear-gradient(180deg, #FC8C66 -4.17%, #F76A7B 110.42%)",
            border: "none",
            borderRadius: "9999px",
            padding: "1rem 2.5rem",
            fontSize: "16px",
            fontWeight: "600",
            marginInline: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            color: "white",
          }}
            onClick={goToBasicDetails}
          >
            Let&apos;s get to know you
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_3152_8560)">
                <path d="M12.9555 4.99497L15.4777 12.6035C15.4987 12.6666 15.4987 12.7296 15.4777 12.7927L12.9555 20.4012C12.8505 20.7165 13.2288 20.9477 13.481 20.7375L21.657 12.9398C21.7831 12.8137 21.7831 12.6035 21.657 12.4774L13.46 4.6797C13.2288 4.4485 12.8505 4.6797 12.9555 4.99497Z" fill="white" />
                <path d="M13.7742 12.9359C13.9003 12.8097 13.9003 12.5996 13.7742 12.4735L5.59815 4.67576C5.36695 4.44456 4.98863 4.69678 5.0727 5.01205L7.59487 12.6206C7.61588 12.6836 7.61588 12.7467 7.59487 12.8098L5.0727 20.4183C4.96761 20.7336 5.34593 20.9648 5.59815 20.7546L13.7742 12.9359Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_3152_8560">
                  <rect width="25.2217" height="25.2217" fill="white" transform="translate(0.78125 0.09375)" />
                </clipPath>
              </defs>
            </svg>

          </button>
        </div>
      </div>
</div>
     
    
  </section >
}

{
  !mobile && 
  <div className="get-start-container11">
  <div className="text-content11">
    <h1>Welcome to myTamilDate!</h1>
    <p>Amazing people join MTD everyday, and one could be your perfect match!</p>
    <p>A detailed, authentic & complete profile increases your chances of finding meaningful connections.</p>
    <button  onClick={goToBasicDetails}>
    Let’s get to know you <span>
    <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.96167 8.86555C9.08778 8.73944 9.08778 8.52926 8.96167 8.40315L0.78565 0.605448C0.554451 0.37425 0.176126 0.626466 0.260198 0.941737L2.78237 8.55027C2.80338 8.61333 2.80338 8.67638 2.78237 8.73944L0.260198 16.348C0.155108 16.6632 0.533433 16.8944 0.78565 16.6843L8.96167 8.86555Z" fill="white"/>
</svg>

    </span>
    <span>
    <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.96167 8.86555C9.08778 8.73944 9.08778 8.52926 8.96167 8.40315L0.78565 0.605448C0.554451 0.37425 0.176126 0.626466 0.260198 0.941737L2.78237 8.55027C2.80338 8.61333 2.80338 8.67638 2.78237 8.73944L0.260198 16.348C0.155108 16.6632 0.533433 16.8944 0.78565 16.6843L8.96167 8.86555Z" fill="white"/>
</svg>

    </span>
    </button>
  </div>
  {/* Other content */}
</div>
}
    </>
  )
}

/**
 *
 */