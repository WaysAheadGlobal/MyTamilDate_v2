import React from 'react'
import { Image } from 'react-bootstrap'
import editcard from './editcard.module.css'
const Carddetails = ({icon,title, detail}) => {
  return (
    <div className={editcard.maincontainer}>
        <div className={editcard.icontitle} style={{display : "flex",justifyContent : "center" , alignContent:"center"}}>
            <Image width="36px" height="36px" src={icon} />
            <p style={{marginTop : "10px", font : "16px"}} >{title}</p>
        </div>
        <div>
            <p className={editcard.detailss} style={{ font : "16px"}}>
            {detail}
            </p>
        </div>
    </div>
  )
}

export default Carddetails;