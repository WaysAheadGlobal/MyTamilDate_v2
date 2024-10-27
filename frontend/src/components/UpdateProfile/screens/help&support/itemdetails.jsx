import React from 'react';
import styles from './helpandsupport.module.css';
import Sidebar from '../../../userflow/components/sidebar/sidebar';
import backarrow from "../../../../assets/images/backarrow.jpg";
import { Image } from 'react-bootstrap';
const HelpSupportDetail = ({ title, content, onBack }) => {
  return (
    <Sidebar>
          <div style={{
                flex: "1",
                marginInline: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                overflowY: "auto",
                width: "-webkit-fill-available",
                padding: "2rem"
            }}>
    <div className={styles.helpSupportDetail} style={{marginTop : "20px"}}>
    <div className={styles.logoarrow} >
                        <Image onClick={onBack} src={backarrow} className={styles.backarrow}  alt="Back Arrow" />
                        <div className={styles.helpSupportTitle}>Help & Support</div>
                    </div>
      {/* <button onClick={onBack} className={styles.backButton}>Back</button> */}
      <h2 className={styles.helpSupportheading } style={{color :  "#4E1173" , fontSize : "18px"
}}>{title}</h2>
        <div
            className={styles.helpSupportContent} 
            style={{fontSize : "14px"}}
            dangerouslySetInnerHTML={{ __html: content }}
          />
    </div>
    </div>
    </Sidebar>
  );
};

export default HelpSupportDetail;
