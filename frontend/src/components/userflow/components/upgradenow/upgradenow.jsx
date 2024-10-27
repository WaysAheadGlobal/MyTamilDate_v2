import React, { useState } from 'react'

import styles from "./upgrade.module.css";
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UpgradeModal = ({ show, setShow }) => {
    const navigate = useNavigate();
const [showmodal, setShowmodal] = useState(true)
    return (
        <div>
            <Modal centered className="selfie-modal" show={show} onHide={() => setShow(false)} style={{
                marginLeft : "-3px"
            }}>
                <Modal.Body className='selfie-modal-body'  >
                    <div style={{
                       
                        
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        
                    }}>
                        <div style={{
                            backgroundColor: "white",
                            borderRadius: "1rem",
                            width: "372px",
                        

                        }}>
                            <button 
                    onClick={() => setShow(false)} 
                    style={{
                        position: "absolute",
                        top: "-45px",
                        right: "-15px",
                        background: "none",
                        border: "none",
                        fontSize: "40px",
                        color: "black",
                        cursor: "pointer",
                        fontWeight : "300"
                    }}
                >
                    &times;
                </button>
                            <p style={{
                                fontSize: "20px",
                                fontWeight: "600",
                                color: "#424242",
                                textAlign: "center",
                                fontStyle: "Poppins",
                                padding: "3rem",
                                marginTop  :"-20px"
                            }}>Upgrade to Premium &
                                Unlock Exclusive Features</p>
                            <div className={styles.likebox}
                                style={{
                                    borderRadius: "1rem",
                                }}>
                                <p
                                    style={{
                                        fontSize: "16px",
                                        margin: "0",
                                        textAlign: "center",
                                        color: "#515151",
                                        fontStyle: "Poppins",
                                        fontWeight: "400",
                                        borderRadius: "1rem",
                                        padding: "9px",
                                        marginTop :"-30px"
                                    }}
                                >
                                    As a Premium member, you can send unlimited messages, see who liked you, view all matches, access special events, and much more!
                                </p>
                                <div style={{
                                    marginTop: "2rem",
                                    display: "flex",
                                    gap: "1rem",
                                    marginInline: "auto",
                                    width: "fit-content",
                                    borderRadius: "1rem",
                                }}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "25px"
                                    }}>
                                        {/* <button className='global-cancel-button' style={{
                                            background: "#fff",
                                        }}
                                        onClick={() => setShow(false)}
                                        >
                                            Close
                                        </button> */}
                                        <button className='global-next-btn' style={{
                                            background: "#fff",
                                            color: "#F76A7B",
                                        //    paddingRight : "-3px",
                                        //    padding: "12px 14px 12px 14px",
                                           width :"236px"
                                        }}
                                            onClick={() => navigate("/selectplan")}
                                        >
                                            Upgrade Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default UpgradeModal