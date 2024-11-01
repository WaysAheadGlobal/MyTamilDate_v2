import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Image } from 'react-bootstrap';
import logo from "../assets/images/MTDlogo.png";
import backarrow from "../assets/images/backarrow.jpg";
import responsivebg from "../assets/images/responsive-bg.png";
import './job-title.css';
import { API_URL } from '../api';
import { useNavigate } from 'react-router-dom';
import { useCookies } from '../hooks/useCookies';


const options = [
    "Yes",
    "No",
    "Sometimes",
    "Prefer not to say"
]

export default function SmokeAndFamily() {
    const [selectedSmoke, setSelectedSmoke] = useState(null);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const[errorSmoke, setErrorSmoke] = useState('');
    const[errorDrink, setErrorDrink] = useState("");
    const { getCookie } = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}/customer/users/smoke-drink`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setSelectedSmoke(options[data.smoke_id - 1]);
                setSelectedDrink(options[data.drink_id - 1]);
            }
        })()
    }, [])

    async function saveSmoke() {
      
        const response = await fetch(`${API_URL}/customer/users/update-smoke`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify({ smoke_id: options.indexOf(selectedSmoke) + 1 }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            throw new Error('Error saving have kids');
        }
    }

    async function saveDrink() {
       
        const response = await fetch(`${API_URL}/customer/users/update-drink`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('token')}`
            },
            body: JSON.stringify({ drink_id: options.indexOf(selectedDrink) + 1 }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            throw new Error('Error saving want kids');
        }
    }

    async function saveAll() {
        try {
            setErrorSmoke("");
            setErrorDrink("");
            if(!selectedSmoke){
                setErrorSmoke("*Please make a selection.");
                return;
            }
            
            if(!selectedDrink){
                setErrorDrink("Please make a selection.")
                return;
            }
            await Promise.all([saveSmoke(), saveDrink()]);
            
            navigate('/approve');
        } catch (error) {

            console.error('Error saving kids and family:', error);
        }
    }

    return (
        <div className='job-container'>
            <div className='job-bg'>
                <Image className='responsive-bg' src={responsivebg} alt="Background"></Image>
            </div>
            <Container className='job-main'>
                <Container className='job-content'>
                    <Container className='logo-progressbar10'>
                        <Container className='logo-arrow10'>
                            <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} alt="Back Arrow" />
                            <Image src={logo} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                        </Container>
                        <div className='track-btn10'>
                            <div></div>
                        </div>
                    </Container>
                    <Container className='job-details'>
                        <div className='your-job'>
                            <Container className='job-text'>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="18" fill="#4E1173" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M26.5 13.5C26.5 13.2239 26.7239 13 27 13C28.3807 13 29.5 14.1193 29.5 15.5V16.2955C29.5 16.9895 29.1793 17.6086 28.6779 18.0127C29.4756 18.5519 30 19.4647 30 20.5V22C30 22.2761 29.7761 22.5 29.5 22.5C29.2239 22.5 29 22.2761 29 22V20.5C29 19.3955 28.1045 18.5 27 18.5C26.7239 18.5 26.5 18.2761 26.5 18C26.5 17.7239 26.7239 17.5 27 17.5H27.2955C27.9607 17.5 28.5 16.9607 28.5 16.2955V15.5C28.5 14.6716 27.8284 14 27 14C26.7239 14 26.5 13.7761 26.5 13.5ZM25 16.5C24.1715 16.5 23.5 17.1715 23.5 18V18.9091C23.5 19.7375 24.1715 20.4091 25 20.4091H26.5C27.3284 20.4091 28 21.0806 28 21.9091V22C28 22.2761 27.7761 22.5 27.5 22.5C27.2239 22.5 27 22.2761 27 22V21.9091C27 21.6329 26.7761 21.4091 26.5 21.4091H25C23.6193 21.4091 22.5 20.2898 22.5 18.9091V18C22.5 16.6193 23.6193 15.5 25 15.5C25.2761 15.5 25.5 15.7239 25.5 16C25.5 16.2761 25.2761 16.5 25 16.5ZM11.5 23C10.6716 23 10 23.6715 10 24.5V25.5C10 26.3285 10.6716 27 11.5 27H24.5C25.3285 27 26 26.3285 26 25.5V24.5C26 23.6715 25.3285 23 24.5 23H11.5ZM11 24.5C11 24.2239 11.2239 24 11.5 24H24.5C24.7761 24 25 24.2239 25 24.5V25.5C25 25.7761 24.7761 26 24.5 26H11.5C11.2239 26 11 25.7761 11 25.5V24.5ZM28 24C28 23.7239 27.7761 23.5 27.5 23.5C27.2239 23.5 27 23.7239 27 24V26C27 26.2761 27.2239 26.5 27.5 26.5C27.7761 26.5 28 26.2761 28 26V24ZM30 24C30 23.7239 29.7761 23.5 29.5 23.5C29.2239 23.5 29 23.7239 29 24V26C29 26.2761 29.2239 26.5 29.5 26.5C29.7761 26.5 30 26.2761 30 26V24Z" fill="white" />
                                </svg>

                                <p>Do you smoke?</p>
                            </Container>
                           
                            <div style={{
                                maxHeight: "50vh",
                                overflow: "auto",
                            }}>
                                <div className="job-columns">
                                    {options.map((option, index) => (
                                        <div key={index} className='job-item' style={{
                                            padding: "1rem",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: selectedSmoke === option ? "#F7ECFF" : "transparent",
                                        }} onClick={() => setSelectedSmoke(option)}>
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{marginTop : "5px"}}>

                        {errorSmoke && <p className="text-danger error-message">{errorSmoke}</p>}
                        </div>
                    </Container>
                    <Container className='job-details'>
                        <div className='your-job'>
                            <Container className='job-text'>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="18" fill="#4E1173" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4773 10.2563C16.2252 10.2763 15.9798 10.3469 15.7557 10.4639C15.5317 10.5809 15.3335 10.7419 15.173 10.9373C14.9158 11.2523 14.789 11.6348 14.7688 12.027C14.5631 12.0011 14.3547 12.0067 14.1508 12.0435C13.8415 12.105 13.5507 12.2372 13.301 12.4298C13.0514 12.6229 12.8494 12.8708 12.7106 13.1542C12.5717 13.4377 12.4997 13.7491 12.5 14.0648L12.5045 14.73L12.503 14.7375V14.7908L12.5015 14.946L12.5 15.6825V16.2683C12.5 16.8083 12.803 17.2755 13.244 17.5298V27.2693C13.244 28.2218 14.0188 29.0018 14.9698 29.0018H22.7743C23.7253 29.0018 24.5 28.2218 24.5 27.2693V26.0168H26.1245C26.4882 26.017 26.8372 25.873 27.095 25.6165C27.3528 25.36 27.4984 25.0117 27.5 24.648V18.3713C27.4986 18.0074 27.3531 17.659 27.0952 17.4023C26.8374 17.1456 26.4883 17.0016 26.1245 17.0018H24.5V15.8723C24.869 15.5948 25.1375 15.186 25.2223 14.7023C25.2984 14.2589 25.2128 13.8029 24.9809 13.4173C24.7491 13.0317 24.3866 12.7422 23.9593 12.6015C23.8774 12.3446 23.737 12.1102 23.5492 11.9167C23.3614 11.7232 23.1313 11.5758 22.877 11.4863C22.5643 11.3799 22.2279 11.3646 21.9069 11.442C21.5858 11.5194 21.2934 11.6864 21.0635 11.9235C20.8829 11.6767 20.6538 11.4692 20.3904 11.3137C20.127 11.1582 19.8347 11.0579 19.5313 11.019C19.0958 10.966 18.6544 11.0416 18.2615 11.2365C18.132 10.9936 17.9503 10.7823 17.7295 10.6179C17.5086 10.4534 17.2541 10.3399 16.9843 10.2855C16.8174 10.2526 16.6468 10.2432 16.4773 10.2563ZM16.5358 11.0048C16.7675 10.9869 16.999 11.0419 17.198 11.1619C17.397 11.282 17.5535 11.4612 17.6458 11.6745C17.5685 11.7524 17.497 11.8359 17.432 11.9243C17.4029 11.9641 17.382 12.0093 17.3704 12.0572C17.3588 12.1051 17.3568 12.1549 17.3644 12.2036C17.3798 12.302 17.4337 12.3902 17.5141 12.4489C17.5946 12.5076 17.6951 12.5319 17.7934 12.5165C17.8422 12.5089 17.8889 12.4917 17.931 12.466C17.9731 12.4403 18.0097 12.4066 18.0388 12.3668C18.196 12.1509 18.4081 11.981 18.6531 11.8747C18.8981 11.7684 19.167 11.7295 19.4321 11.7621C19.6972 11.7947 19.9487 11.8976 20.1606 12.06C20.3726 12.2225 20.5372 12.4387 20.6375 12.6863C20.6366 12.7752 20.6673 12.8615 20.7242 12.9299C20.781 12.9982 20.8603 13.0442 20.9479 13.0595C21.0355 13.0748 21.1256 13.0585 21.2023 13.0135C21.279 12.9685 21.3372 12.8977 21.3665 12.8138C21.4082 12.6894 21.4742 12.5746 21.5606 12.476C21.647 12.3774 21.7522 12.297 21.87 12.2393C21.9878 12.1817 22.1158 12.148 22.2467 12.1403C22.3776 12.1326 22.5088 12.1509 22.6325 12.1943C23.1553 12.375 23.4305 12.9398 23.252 13.4693C23.2346 13.5163 23.2268 13.5663 23.2291 13.6164C23.2314 13.6665 23.2437 13.7156 23.2653 13.7608C23.2869 13.8061 23.3174 13.8465 23.3549 13.8798C23.3924 13.9131 23.4362 13.9385 23.4837 13.9545C23.5312 13.9706 23.5814 13.9769 23.6314 13.9732C23.6814 13.9695 23.7302 13.9559 23.7748 13.933C23.8194 13.9101 23.859 13.8785 23.8912 13.8401C23.9234 13.8017 23.9475 13.7572 23.9623 13.7093C23.9908 13.6253 24.0058 13.5398 24.0208 13.455C24.3703 13.6995 24.5608 14.127 24.4828 14.5718C24.4351 14.8495 24.2844 15.099 24.0609 15.2705C23.8373 15.4421 23.5573 15.523 23.2768 15.4973C22.9959 15.4735 22.7343 15.3449 22.5441 15.137C22.3538 14.929 22.2488 14.6571 22.25 14.3753C22.251 14.3041 22.2317 14.234 22.1943 14.1734C22.157 14.1128 22.1031 14.064 22.0391 14.0329C21.975 14.0017 21.9035 13.9894 21.8327 13.9975C21.7619 14.0055 21.6949 14.0335 21.6395 14.0783C21.4724 14.0289 21.2992 14.0032 21.125 14.0018C20.6277 14.0026 20.151 14.2006 19.7995 14.5524C19.448 14.9041 19.2504 15.381 19.25 15.8783C19.2497 15.9073 19.2527 15.9362 19.259 15.9645C19.2528 15.9921 19.2498 16.0203 19.25 16.0485V17.781C19.25 18.1815 18.9275 18.5018 18.5 18.5018C18.0725 18.5018 17.75 18.1815 17.75 17.7818V15.8888C17.75 15.0765 17.0713 14.4188 16.2545 14.4188H16.2455C15.428 14.4188 14.75 15.0743 14.75 15.8873V16.0485C14.7487 16.0577 14.7477 16.067 14.747 16.0763L14.7425 16.2608C14.7425 16.2635 14.7425 16.2663 14.7425 16.269C14.7425 16.665 14.4193 16.986 13.9985 16.986H13.994C13.8984 16.9914 13.8027 16.9773 13.7128 16.9445C13.6229 16.9116 13.5406 16.8608 13.4709 16.7951C13.4013 16.7294 13.3458 16.6502 13.3078 16.5623C13.2698 16.4745 13.2502 16.3798 13.25 16.284V15.7388H13.2545V14.7968L13.25 14.0648C13.25 13.656 13.4383 13.2713 13.76 13.023C14.0803 12.7755 14.4935 12.6938 14.8835 12.798C14.888 12.8108 14.888 12.8243 14.8933 12.837C14.9315 12.9289 15.0048 13.0018 15.0968 13.0397C15.1889 13.0777 15.2922 13.0774 15.3841 13.0391C15.476 13.0009 15.5489 12.9276 15.5869 12.8356C15.6248 12.7435 15.6245 12.6402 15.5863 12.5483C15.5082 12.3616 15.4825 12.1571 15.512 11.9569C15.5415 11.7567 15.625 11.5683 15.7535 11.412C15.95 11.172 16.2335 11.028 16.5358 11.0048ZM21.125 14.7518C21.2773 14.7518 21.4273 14.7923 21.5705 14.8545C21.6685 15.2264 21.8784 15.5591 22.1718 15.8077C22.4652 16.0563 22.8279 16.2087 23.2108 16.2443C23.396 16.2608 23.5753 16.2413 23.75 16.2045V27.2693C23.75 27.822 23.3203 28.2525 22.775 28.2525H14.969C14.423 28.2525 13.994 27.822 13.994 27.27V17.7353H13.9978C14.8138 17.7353 15.4918 17.0798 15.4918 16.2683L15.4948 16.1333C15.4982 16.1129 15.4999 16.0924 15.5 16.0718V15.8873C15.5 15.4905 15.824 15.1673 16.2455 15.1673H16.2545C16.676 15.1673 17 15.4905 17 15.8873V17.781C17 18.5948 17.6803 19.2518 18.5 19.2518C19.3198 19.2518 20 18.5948 20 17.7818V16.0485C20.0004 16.0193 19.9974 15.9901 19.991 15.9615C19.9971 15.9342 20.0001 15.9063 20 15.8783C19.9998 15.7304 20.0288 15.584 20.0852 15.4473C20.1417 15.3106 20.2245 15.1864 20.329 15.0818C20.4335 14.9772 20.5575 14.8942 20.6941 14.8375C20.8307 14.7809 20.9771 14.7518 21.125 14.7518ZM24.5 17.7518H26.1245C26.4995 17.7518 26.75 18.0023 26.75 18.3713V24.6488C26.75 25.017 26.4995 25.2675 26.1245 25.2675H24.5V17.7518ZM15.869 19.5113C15.8198 19.5121 15.7711 19.5225 15.7259 19.5421C15.6807 19.5617 15.6398 19.59 15.6056 19.6253C15.5713 19.6607 15.5444 19.7025 15.5262 19.7483C15.5081 19.7941 15.4992 19.843 15.5 19.8923V26.5995C15.5 26.699 15.5395 26.7944 15.6098 26.8647C15.6802 26.935 15.7755 26.9745 15.875 26.9745C15.9745 26.9745 16.0698 26.935 16.1402 26.8647C16.2105 26.7944 16.25 26.699 16.25 26.5995V19.8923C16.2508 19.842 16.2415 19.7921 16.2227 19.7455C16.2038 19.6989 16.1758 19.6566 16.1402 19.6211C16.1047 19.5855 16.0623 19.5575 16.0158 19.5386C15.9692 19.5198 15.9193 19.5105 15.869 19.5113ZM18.869 19.5113C18.8198 19.5121 18.7711 19.5225 18.7259 19.5421C18.6807 19.5617 18.6398 19.59 18.6056 19.6253C18.5713 19.6607 18.5444 19.7025 18.5262 19.7483C18.5081 19.7941 18.4992 19.843 18.5 19.8923V26.5995C18.5 26.699 18.5395 26.7944 18.6098 26.8647C18.6802 26.935 18.7755 26.9745 18.875 26.9745C18.9745 26.9745 19.0698 26.935 19.1402 26.8647C19.2105 26.7944 19.25 26.699 19.25 26.5995V19.8923C19.2508 19.842 19.2415 19.7921 19.2227 19.7455C19.2038 19.6989 19.1758 19.6566 19.1402 19.6211C19.1047 19.5855 19.0623 19.5575 19.0158 19.5386C18.9692 19.5198 18.9193 19.5105 18.869 19.5113ZM21.869 19.5113C21.8198 19.5121 21.7711 19.5225 21.7259 19.5421C21.6807 19.5617 21.6398 19.59 21.6056 19.6253C21.5713 19.6607 21.5444 19.7025 21.5262 19.7483C21.5081 19.7941 21.4992 19.843 21.5 19.8923V26.5995C21.5 26.699 21.5395 26.7944 21.6098 26.8647C21.6802 26.935 21.7755 26.9745 21.875 26.9745C21.9745 26.9745 22.0698 26.935 22.1402 26.8647C22.2105 26.7944 22.25 26.699 22.25 26.5995V19.8923C22.2508 19.842 22.2415 19.7921 22.2227 19.7455C22.2038 19.6989 22.1758 19.6566 22.1402 19.6211C22.1047 19.5855 22.0623 19.5575 22.0158 19.5386C21.9692 19.5198 21.9193 19.5105 21.869 19.5113Z" fill="white" />
                                </svg>

                                <p>Do you drink?</p>
                            </Container>
                          
                            <div style={{
                                maxHeight: "50vh",
                                overflow: "auto",
                            }}>
                                <div className="job-columns">
                                    {options.map((option, index) => (
                                        <div key={index} className='job-item' style={{
                                            padding: "1rem",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: selectedDrink === option ? "#F7ECFF" : "transparent",
                                        }} onClick={() => setSelectedDrink(option)}>
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{marginTop : "5px"}}>
                        {errorDrink && <p className="text-danger error-message">{errorDrink}</p>}
                        </div>
                    </Container>
                    <div style={{
                        display: "flex",
                        justifyContent : "space-around",
                        width: "100%",
                        gap: "2rem",
                        marginTop: "auto",
                        marginBottom: "2rem",
                    }}>
                        <Button variant="primary" style={{
                            width: "148px",
                            marginTop: "1rem",
                            background: "white",
                            border: "2px solid #6c6c6c",
                            borderRadius: "9999px",
                            padding: "0.75rem",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#6c6c6c",
                        }} onClick={() => navigate("/approve")}>
                            Ask me later
                        </Button>
                        <Button variant="primary" style={{
                            width: "148px",
                            marginTop: "1rem",
                            background : (!selectedSmoke || !selectedDrink) ? "Lightgray" : "linear-gradient(180deg, #FC8C66 -4.17%, #F76A7B 110.42%)",
                            border: "none",
                            borderRadius: "9999px",
                            padding: "0.75rem",
                            fontSize: "16px",
                            fontWeight: "600",
                        }} onClick={saveAll}>
                            Next
                        </Button>
                    </div>
                </Container>
            </Container>
        </div>
    );
};