import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const LogoutModal = ({ showLogoutModal, handleCloseLogout, handleLogout }) => {
    return (
        <Modal show={showLogoutModal} onHide={handleCloseLogout} centered>
            <Modal.Body className="pause-modal-content">
                <div className="pause-modal-title"
                style={{
                    fontSize : "20px",
                    fontWeight : 600,
                    color: "#515151"

                }}
                >Logout?</div>
                <div className="pause-modal-message" style={{
                    fontSize : "16px"
                }}>
                    Are you sure you want to logout from myTamilDate?
                </div>
                <div className="d-flex justify-content-center" style={{
                    gap : "30px"
                }}>
                    <button  className="global-cancel-button" onClick={handleCloseLogout}>
                        Cancel
                    </button>
                    <button  className="global-save-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default LogoutModal;
