import React from 'react'
import basics from './basics.module.css';
import { Image } from 'react-bootstrap';

const Basics = ({icon, detail}) => {
  return (
    <div className={basics.box}>
        <Image width="24px" height="24px" src={icon}/>
        <p className={basics.detail}>{detail}</p>
    </div>
  )
}

export default Basics;

