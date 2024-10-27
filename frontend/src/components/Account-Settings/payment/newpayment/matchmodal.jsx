import React from 'react';
import styles from './CustomModal.module.css';

import HorizontalLogo from '../../../../assets/images/HorizontalLogo.png'
// import profilepic from '../../../../assets/images/profilepic.png'
import profilepic from '../../../../assets/images/profilepic.png'

const CustomModal = ({ matchmodal, handleClose }) => {
    if (!matchmodal) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={handleClose}>&times;</button>
                <img className={styles.img} src={HorizontalLogo} alt="" />
                <p className={styles.text}>It’s a <span style={{
                    color : "#4B164C"
                }}>
                match! 
                    </span> </p>

                    <div className={styles.bothimg}>
    <div className={`${styles.maincontainer} ${styles.left}`}>
        <div className={styles.imgContainer}>
            <img className={styles.profilepicimg} src={profilepic} alt="" />
        </div>
    </div>

    <div className={`${styles.maincontainer} ${styles.right}`}>
        <div className={styles.imgContainer}>
            <img className={styles.profilepicimg} src={profilepic} alt="" />
        </div>
    </div>
</div>

                <button className={styles.button} onClick={handleClose}>Send a message</button>
                <p className={styles.keepbrowsig}>
                    Keep browsing
                </p>
            </div>
        </div>
    );
};

export default CustomModal;
