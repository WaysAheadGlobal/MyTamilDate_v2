import React, { useEffect, useState } from 'react';

import { Routes, Route } from 'react-router-dom';


import { Headerlp } from './header';
import { Pictext } from './pic-text';


import { Join } from './join';
import { Footer } from './footer';
import { Video2 } from './video2';
import { NavBar } from './nav';
import { TheirStories } from "./theirstories";
import styles from './lb.module.css'


export const LP = () => {
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
      if (window.innerWidth <= 768) {
        setMobile(true);

      }
      window.addEventListener("resize", () => {
        if (window.innerWidth <= 768) {
          setMobile(true);
        } else {
          setMobile(false);
        }
      });
    }, [])
    
    return (
        
        <div className={styles.mainbox}>
        {
            !mobile && <NavBar />
        }
            
            <Headerlp />
            <Pictext />
            <TheirStories />
            <Video2 />
            <Join />
            <Footer />
            </div>
           
        

    );
}

