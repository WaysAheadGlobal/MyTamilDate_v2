import React, { createContext, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Button from '../components/userflow/components/button/Button';

/**
 * @typedef {Object} Modal
 * @property {boolean} show
 * @property {string} message
 * @property {string} title
 * @property {() => void} onButtonClick
 * @property {boolean} showCancelButton
 * @property {string} buttonText
 */

/**
 * @typedef {Object} AlertModalContext
 * @property {Modal} modal
 * @property {React.Dispatch<React.SetStateAction<Modal>>} setModal
 */

/**
 * @type {React.Context<AlertModalContext>}
 */
const AlertModalContext = createContext(null);

export const useAlert = () => {
    const context = React.useContext(AlertModalContext);
    if (!context) {
        throw new Error('useAlert must be used within a AlertModalProvider');
    }
    return context;
}

export default function AlertModalProvider({ children }) {
    const [modal, setModal] = useState({
        show: false,
        message: "",
        title: "",
        onButtonClick: () => { },
        showCancelButton: false,
        buttonText: "Okay"
    });

    const value = useMemo(() => ({ modal, setModal }), [modal, setModal]);

    return (
        <AlertModalContext.Provider value={value}>
            <Modal size='sm' centered show={modal.show}>
                <Modal.Body >
                    <p style={{
                        width : "340px",
                        fontSize: "24px",
                        fontFamily : "poppins",
                        fontWeight: "600",
                        margin: "0",
                        marginBottom: "1rem",
                        color: "#6C6C6C"
                    }}>{modal.title}</p>
                    <p
                        style={{
                            fontSize: "16px",
                            margin: "0",
                            textAlign: "center",
                            color: "#6c6c6c",
                            hyphens: "none"
                        }}
                    >
                        {modal.message}
                    </p>
                    <div style={{
                        marginTop: "3rem",
                        display: "flex",
                        gap: "1rem",
                        marginInline: "auto",
                    }}>
                        {
                            modal.showCancelButton && (
                                <button
                                    type='button'
                                    style={{
                                        borderRadius: "9999px",
                                        padding: "0.75rem 1.5rem",
                                        border: "2px solid #6c6c6c",
                                        color: "#6c6c6c",
                                        backgroundColor: "transparent"
                                    }}
                                    onClick={() => {
                                        setModal({
                                            show: false,
                                            message: "",
                                            title: "",
                                            onButtonClick: () => { },
                                            showCancelButton: false
                                        });
                                    }}
                                >
                                    Close
                                </button>
                            )
                        }
                        <Button
                            onClick={() => {
                                if (modal.onButtonClick) {
                                    modal.onButtonClick();
                                }
                                setModal({
                                    show: false,
                                    message: "",
                                    title: "",
                                    onButtonClick: () => { },
                                    showCancelButton: false
                                });
                            }}
                            style={{
                                borderRadius: "9999px",
                                fontSize :"16px",
                                fontWeight :"600",
                                padding: "0.75rem 1.5rem",
                            }}
                        >
                            {modal.buttonText ?? "Okay"}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            {children}
        </AlertModalContext.Provider>
    )
}
