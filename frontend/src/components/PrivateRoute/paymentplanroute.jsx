import { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';

// Component to handle the mobile check and redirection
const MobileCheck = ({ children }) => {
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 1000 && window.location.pathname === "/paymentplan") {
          setMobile(true);
          navigate("/selectplan");
          // navigate("/paymentplan")
            console.log("payments");
        } else if(window.innerWidth >= 1000 && window.location.pathname === "/selectplan"){
            navigate("/paymentplan")
        }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setMobile(window.innerWidth <= 1024);
  //     console.log(window.innerWidth)
  //   };
    

  //   window.addEventListener('resize', handleResize);
    
  //   // Cleanup event listener on component unmount
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

   
    return children;
  
};

export default MobileCheck;
