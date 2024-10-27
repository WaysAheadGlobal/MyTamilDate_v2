import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './accountSetting.css';
import profile from './accountset.module.css'
import { Container, Image } from 'react-bootstrap';
import { Modal, Button, Form, Dropdown, InputGroup, FormControl } from 'react-bootstrap';
import backarrow from "../../assets/images/backarrow.jpg";
import premium from "../../assets/images/premium.png";
import editlogo from "../../assets/images/editlogo.png";
import username from "../../assets/images/username.png";
import CreditCard from "../../assets/images/CreditCard.png";
import pauseicon from "../../assets/images/pauseicon.png";
import privacy from "../../assets/images/privacy.png";
import emailicon from "../../assets/images/emailicon.png";
import service from "../../assets/images/service.png";
import logout from "../../assets/images/logout.png";
import phonenumber from "../../assets/images/phonenumber.png";
import deleteicon from "../../assets/images/deleteicon.png";
import Right from "../../assets/images/Right.png";
import { useNavigate } from 'react-router-dom';
import { useCookies } from '../../hooks/useCookies';
import { API_URL } from '../../api';
import Flag from 'react-world-flags';
import { countries } from "country-list-json";
import { useAppContext } from '../../Context/UseContext';
import VerifyPhoneModal from './verifyphoneotp';
import LogoutModal from './logout';
import Sidebar from '../userflow/components/sidebar/sidebar';
import { useAlert } from '../../Context/AlertModalContext';
import PricingCard from './payment/SelectPlan/plandetails';

export const AccountSetting = () => {
    const navigate = useNavigate();
    const { getCookie, setCookie, deleteCookie } = useCookies();
    const [showRejectedModal, setShowRejectedModal] = useState(false);
    const [showUserName, setshowUserName] = useState(false);
    const [showUserEmail, setshowUserEmail] = useState(false);
    const [showUserEmailotp, setshowUserEmailotp] = useState(false);
    const [showUserPhoneotp, setshowUserPhoneotp] = useState(false);
    const [showUserphone, setshowUserphone] = useState(false);
    const [showUnsubscribeEmail, setShowUnsubscribeEmail] = useState(false);
    const [showPause, setShowPause] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);
    const [showPauseOption, setShowPauseOpion] = useState(false);
    const [showDeleteOption, setShowDeleteOpion] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showFinalDetele, setFinalDetele] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const[showsubscription, setShowsubcription] = useState(false);
    const[SubscriptSuccess, setSubscriptionsSuccess] = useState(false);
    const [timer, setTimer] = useState(120);
    const [canResend, setCanResend] = useState(false);
    const [pathname, setPathname] = useState([]);
    const [Rejected, setRejected] = useState(false);
    const alert = useAlert();
    const id = getCookie('userId')



    useEffect(() => {
        if (window.location.pathname === "/user/pause") {
            return;
        }

        (async () => {
            const response = await fetch(`${API_URL}/user/check-approval`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`,
                },
            });
            const result = await response.json();
            if (result.approval === "REJECTED" || result.approval === "PENDING") {
                setRejected(true);
            }
        })()
    }, [pathname])
      
    function navigateTo(path) {
       
            navigate(path);
        
    }

    const OldImageURL = 'https://data.mytamildate.com/storage/public/uploads/user';
    const [images2, setImages2] = useState({
        main: null,
        first: null,
        second: null,
    });

    const ImageURL = async () => {
        try {
            const response = await fetch(`${API_URL}/customer/update/media`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            });
            const data = await response.json();
            console.log("datadaa", data);
            if (response.ok) {
                if (data[0].type === 31 || data[1].type === 31 || data[2].type === 31) {
                    const others = data.filter(image => image.type === 32);
                    const main = data.filter(image => image.type === 31)[0];

                    setImages2({
                        main: API_URL + "media/avatar/" + main.hash + "." + main.extension,
                        first: API_URL + "media/avatar/" + others[0].hash + "." + others[0].extension,
                        second: API_URL + "media/avatar/" + others[1].hash + "." + others[1].extension,
                    })


                    console.log('imges', {
                        main: API_URL + "media/avatar/" + main.hash + "." + main.extension,
                        first: API_URL + "media/avatar/" + others[0].hash + "." + others[0].extension,
                        second: API_URL + "media/avatar/" + others[1].hash + "." + others[1].extension,
                    })
                }
                else {
                    const others = data.filter(image => image.type === 2);
                    const main = data.filter(image => image.type === 1)[0];
                    console.log(others, main)
                    setImages2({
                        main: OldImageURL + "/" + id + "/avatar/" + main.hash + "-large" + "." + main.extension,
                        first: OldImageURL + "/" + id + "/photo/" + others[0].hash + "-large" + "." + main.extension,
                        second: OldImageURL + "/" + id + "/photo/" + others[1].hash + "-large" + "." + main.extension,
                    })

                    console.log({
                        main: OldImageURL + "/" + id + "/avatar/" + main.hash + "-large" + "." + main.extension,
                        first: OldImageURL + "/" + id + "/photo/" + others[0].hash + "-large" + "." + main.extension,
                        second: OldImageURL + "/" + id + "/photo/" + others[1].hash + "-large" + "." + main.extension,
                    })

                }

            }
        } catch (error) {
            console.error('Error saving images:', error);
        }
    }
    // Data from the backend
    const [NamePhoneEmail, setNamePhoneEmail] = useState({})
    const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/customer/setting/namedetails`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setNamePhoneEmail(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
        ImageURL();
    }, []);

    // update first Name and Last Name
    const handleFirstNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z ]/g, ''); // Allows only letters and spaces
        setFirstName(value);
    };

    // Function to handle input change for last name and filter out special characters
    const handleLastNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z ]/g, ''); // Allows only letters and spaces
        setLastName(value);
    };
    const UpdateNameAndLastName = async () => {
        try {
            const response = await fetch(`${API_URL}/customer/setting/namedetails`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({ first_name: firstName, last_name: lastName })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setCookie('Userfullname',firstName, 30 )
            console.log('Profile updated successfully:', data);
            // Optionally, you can handle success actions here, such as showing a success message

        } catch (error) {
            console.error('Error updating name:', error);
        }
    };

    const handleSaveFirstLastName = () => {
        UpdateNameAndLastName();
        fetchData();
        handleCloseName();
    };




    //update Phone Number 

    const UpdatePhoneNumber = async () => {
        try {
            const response = await fetch(`${API_URL}/customer/setting/namedetails`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({ first_name: firstName })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Profile updated successfully:', data);
            // Optionally, you can handle success actions here, such as showing a success message

        } catch (error) {
            console.error('Error updating name:', error);
        }
    };
    const [errorMessagephone, setErrorMessagephone] = useState('');




    const handleCloseName = () => setshowUserName(false);
    const handleShowName = () => setshowUserName(true);

    const handleCloseEmail = () => setshowUserEmail(false);
    const handleShowEmail = () => setshowUserEmail(true);

    const handleCloseEmailotp = () => setshowUserEmailotp(false);
    const handleShowEmailotp = () => setshowUserEmailotp(true);

    const handleClosephone = () => setshowUserphone(false);
    const handleShowPhone = () => setshowUserphone(true);

    const handleClosePhoneotp = () => setshowUserPhoneotp(false);
    const handleShowPhoneotp = () => {
        setshowUserPhoneotp(true);
        setResendTimer(120);
    };

    const handleClosePause = () => setShowPause(false);
    const handleShowPause = () => setShowPause(true);

    const handleCloseDeleteAccount = () => setShowDeleteAccount(false);
    const handleShowDeleteAccount = () => setShowDeleteAccount(true);

    const handleCloseDeleteOption = () => setShowDeleteOpion(false);
    const handleShowDeleteOption = () => setShowDeleteOpion(true);


    const handleCloseFinalDetele = () => setFinalDetele(false);
    const handleShowFinalDetele = () => setFinalDetele(true);

    const handleShowLogout = () => setShowLogoutModal(true);
    const handleCloseLogout = () => setShowLogoutModal(false);
    const handleLogout = () => {
        deleteCookie("token");
        deleteCookie("approval");
        deleteCookie("isPremium");
        navigate("/");
        setShowLogoutModal(false);
    };


    const GotoPrivacyPolicy = () => {
        navigate("/PrivacyPolicyDetails")
    }
    const Gototermandconditions = () => {
        navigate("/termandconditions")
    }
    // Delete My Account now
    const [showFinalDelete, setShowFinalDelete] = useState(false);
    const [selectedDeleteOption, setSelectedDeleteOption] = useState('');
    const [deleteReason, setDeleteReason] = useState('');
    const handleShowFinalDelete = () => setShowFinalDelete(true);
    const handleCloseFinalDelete = () => setShowFinalDelete(false);

    const handleDeleteAccount = () => {
        handleCloseDeleteAccount();
        handleShowDeleteOption();
    };

    const handleDeleteAccountOption = () => {
        handleCloseDeleteOption();
        handleShowFinalDelete();
    };

    const handleFinalDelete = async () => {


        try {

            let response = await fetch(`${API_URL}/delete-reason`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({
                    reason_id: selectedDeleteOption,
                    reason_description: deleteReason,
                }),
            });

            if (!response.ok) {
                throw new Error('Error submitting delete reason');
            }

            console.log('Delete reason submitted successfully:', await response.json());



            response = await fetch(`${API_URL}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
            });

            if (!response.ok) {
                throw new Error('Error deleting user account');
            }

            console.log('User deleted successfully:', await response.json());
            handleCloseFinalDelete();
        } catch (error) {
            console.error(error);
        }
    };

    const handleShowPauseModel = () => {
        handleCloseDeleteAccount();
        handleCloseDeleteOption();
        handleShowPause();
    };

    const feedbackOptions = [
        "There aren’t enough people in my area",
        "The site is hard to use",
        "It's too expensive",
        "I got too many messages from other members",
        "I Met Somebody On Site",
        "I met somebody elsewhere",
        "Others"
    ];


    // Unsubscribe Email
    const handleCloseUnsubscribeEmail = () => setShowUnsubscribeEmail(false);
    const handleShowUnsubscribeEmail = () => setShowUnsubscribeEmail(true);

    const handleUnsubscribeEmail = () => {

        navigateTo("/unsubscribe")
    };

    //pause my account 
    const handlePauseAccount = () => {
        setShowPause(false);
        handleShowPauseOption();
    };
    const [selectedOption, setSelectedOption] = useState('');
    const handleClosePauseOption = () => setShowPauseOpion(false);
    const handleShowPauseOption = () => setShowPauseOpion(true);
    const handlePauseAccountOption = () => {
        setShowPauseOpion(false);
    };






    //success modal of Email OTP  open and close
    const [showsuccessemail, setShowsuccess] = useState(false);
    const handleClosesuccess = () => setShowsuccess(false);
    const handleShowsuccess = () => setShowsuccess(true);

    //success modal of Phone OTP  open and close
    const [showsuccessphone, setShowsuccessphone] = useState(false);
    const handleClosesuccessphone = () => setShowsuccessphone(false);
    const handleShowsuccessphone = () => setShowsuccessphone(true);




    //  email update 
    const [errorMessageemail, setErrorMessageemail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const intervalRef = useRef(null);
    useEffect(() => {
        if (showUserEmailotp) {
            startTimer();
        }
        return () => clearInterval(intervalRef.current);
    }, [showUserEmailotp]);

    const startTimer = () => {
        clearInterval(intervalRef.current);
        setTimer(120);
        setCanResend(false);
        intervalRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev === 1) {
                    clearInterval(intervalRef.current);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrorMessageemail('*Please enter a valid email address');
            return;
        } else if (!email.includes('@')) {
            setErrorMessageemail('*Please enter a valid email address');
            return;
        }
        setErrorMessageemail('');
        console.log("req send")
        try {
            const response = await fetch(`${API_URL}/customer/setting/request-email-update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            console.log('Response:', response);
            console.log('Response Data:', data);

            if (response.ok) {
                console.log('Email submitted:', email);
                setCookie("UpdateEmail", email, 1);
                setEmail('');
                setErrorMessageemail('');
                handleCloseEmail();
                handleShowEmailotp();
            } else {
                setErrorMessageemail( "*" + data.message + ".");
            }
        } catch (err) {
            console.error('Error submitting email:', err);
            setErrorMessageemail('An error occurred while submitting the email. Please try again later.');
        }
    };
    const handleResendCode = async () => {
        const email = getCookie("UpdateEmail")

        if (!email) {
            setErrorMessageemail('*Please re-enter email address');
            return;
        } else if (!email.includes('@')) {
            setErrorMessageemail('*Please re-enter email address');
            return;
        }
        setErrorMessageemail('');
        console.log("req send")
        try {
            const response = await fetch(`${API_URL}/customer/setting/request-email-update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            console.log('Response:', response);
            console.log('Response Data:', data);

            if (response.ok) {
                console.log('Email submitted:', email);
                setCookie("UpdateEmail", email, 1);
                setEmail('');
                setErrorMessageemail('');
                handleCloseEmail();
                handleShowEmailotp();
                startTimer();
            } else {
                setErrorMessageemail(data.message);
            }
        } catch (err) {
            console.error('Error submitting email:', err);
            setErrorMessageemail('An error occurred while submitting the email. Please try again later.');
        }
    };




    //otp for email code 

    const goToSigninEmailSuccessful = () => {
        navigate("/signinemailsuccessful");
    };

    const [code1, setCode1] = useState('');
    const [code2, setCode2] = useState('');
    const [code3, setCode3] = useState('');
    const [code4, setCode4] = useState('');
    const [errorMessageotp, setErrorMessageotp] = useState('');

    const code1ref = useRef(null);
    const code2ref = useRef(null);
    const code3ref = useRef(null);
    const code4ref = useRef(null);

    const handleCodeChange = (e, setter, nextRef) => {
        const value = e.target.value;
        if (!isNaN(value) && value.length <= 1) {
            setter(value);
            if (value.length === 1 && nextRef) {
                nextRef.current.focus();
            }
        }
    };

    const handleKeyDown = (e, prevRef) => {
        if (e.key === 'Backspace' && e.target.value === '' && prevRef) {
            prevRef.current.focus();
        }
    };

    const handleSubmitEmailotp = async (e) => {
        e.preventDefault();
        const otp = `${code1}${code2}${code3}${code4}`;

        if (otp.length !== 4) {
            setErrorMessageotp('*Invalid verification code.');
            return;
        }

        setErrorMessageotp('');
        const UpdateEmail = getCookie("UpdateEmail")

        try {
            console.log("email", UpdateEmail);
            const response = await fetch(`${API_URL}/customer/setting/verifyotp`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({ email: UpdateEmail, otp }),

            });

            const data = await response.json();

            if (response.ok) {
                console.log('OTP verified successfully');
                setErrorMessage('');
                handleCloseEmailotp();
                handleShowsuccess();
                fetchData();

            } else {
                setErrorMessageotp( "*" + data.message + ".");
            }
        } catch (err) {
            console.error('Error verifying OTP:', err);
            setErrorMessageotp('An error occurred while verifying the OTP. Please try again later.');
        }
    };






    // phone number update code
    const [showModalcountry, setshowModalcountry] = useState(false);
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('CA');
    const [selectedCountryInfo, setSelectedCountryInfo] = useState(countries.find(country => country.code === 'CA'));
    const [phoneNumberupdate, setPhoneNumberupdate] = useState("");
    const [errorMessagephoneupdate, setErrorMessagephoneupdate] = useState('');
    const { setPhoneNumber } = useAppContext();
    const [resendTimer, setResendTimer] = useState(120);
    const [modalPhoneNumber, setModalPhoneNumber] = useState('');


    const handleCountrySelect = (countryCode) => {
        setSelectedCountry(countryCode);
        const countryInfo = countries.find(country => country.code === countryCode);
        setSelectedCountryInfo(countryInfo);
        setPhoneNumberupdate(''); // Clear the phone number input when a country is selected
        toggleModal();
    };

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.dial_code.includes(searchTerm)
    );

    const toggleModal = () => {
        setshowModalcountry(!showModalcountry);
    };

    // const handlePhoneNumberChange = (e) => {
    //     const value = e.target.value.replace(/\D/g, '');
    //     setPhoneNumberupdate(value);
    // };

    const handlePhoneNumberChange = (e) => {
        let rawValue = e.target.value.replace(/\D/g, ''); // Store the raw value without formatting

        // Format the value for display
        let formattedValue = rawValue;
        if (rawValue.length > 6) {
            formattedValue = `(${rawValue.substring(0, 3)}) ${rawValue.substring(3, 6)}-${rawValue.substring(6, 10)}`;
        } else if (rawValue.length > 3) {
            formattedValue = `(${rawValue.substring(0, 3)}) ${rawValue.substring(3, 6)}`;
        } else if (rawValue.length > 0) {
            formattedValue = `(${rawValue}`;
        }

        setFormattedPhoneNumber(formattedValue); // Update the formatted value for display
        console.log(rawValue)
        setPhoneNumberupdate(rawValue); // Store the raw value in the state
    };

    const handleSubmitphone = async (e) => {
        e.preventDefault();
        const completePhoneNumber = selectedCountryInfo.dial_code + phoneNumberupdate;
        console.log('Submitting phone number:', completePhoneNumber);
        setModalPhoneNumber(completePhoneNumber);
        if (phoneNumberupdate.length === 0) {
            setErrorMessagephoneupdate('*Phone is required.');
        } else {
            setErrorMessagephoneupdate('');

            try {
                const response = await fetch(`${API_URL}/customer/setting/updatephone/otp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('token')}`
                    },
                    body: JSON.stringify({
                        phone: completePhoneNumber,
                    }),
                });

                const result = await response.json();
                if (response.ok) {

                    handleClosephone();
                    setResendTimer(120)
                    handleShowPhoneotp();
                } else {
                    if (response.status === 409) {
                        setErrorMessagephoneupdate('Phone number already exists. Please use a different number.');
                    } else {
                        setErrorMessagephoneupdate( "*" + result.message + "." || 'Failed to send OTP');
                    }
                    console.error('Server response:', result);
                }
            } catch (error) {
                console.error('Error:', error);
                setErrorMessagephoneupdate('An error occurred. Please try again later.');
            }
        }
    };

    const PauseMyAccount = async () => {
        try {
            const response = await fetch(`${API_URL}/customer/setting/pause`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                }
            });

            if (response.ok) {
                setShowPauseOpion(false);
                window.location.replace('/user/pause');
                console.log("Account paused successfully");
            }
            else {
                const errorData = await response.json();
                console.error("Failed to pause account:", errorData.message);
            }
        } catch (err) {
            console.error("Error in PauseMyAccount:", err);
        }
    }

    const showsubscriptionModal = ()=> setShowsubcription(true);
    const HidesubcriptionsModal = ()=> setShowsubcription(false);

    const ShowSubscriptionSuccess = ()=>  setSubscriptionsSuccess(true);
    const HideSubscriptionSuccess = ()=> setSubscriptionsSuccess(false);

    async function cancelSubscription() {
        try {
            try {
                const response = await fetch(`${API_URL}customer/subscription/cancel`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getCookie('token')}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    HidesubcriptionsModal();
                    ShowSubscriptionSuccess();
                    // alert.setModal({
                    //     title: "Subscription Cancelled",
                    //     message: "Your subscription has been successfully cancelled.",
                    //     show: true,
                    //     onButtonClick: () => {
                    //         window.location.reload();
                    //     }
                    // });
                }
            } catch (err) {
                console.error(err);
            }
        } catch (error) {
            console.error('Error cancelling subscription:', error);
        }
    }

    const GoTOAccountsetting = ()=>{
        HideSubscriptionSuccess();
        window.location.reload();
    }

    return (

        <Sidebar>

            <div style={{
                flex: "1",
                marginInline: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                overflowY: "auto",
                marginTop: "-30px",
                width: "100%",
                paddingInline: "1rem",
            }}>
                <div className='account-setting-container' style={{
                    width: "100%",
                }}>
  <RejectModal show={showRejectedModal} setShow={setShowRejectedModal} />
                    <div className='account-setting-main' style={{
                        width: "100%",
                    }}>
                        <div className='account-setting-box'>
                            <Container className='logo-progressbar3'>

                                <Container className='logo-arrow3'>
                                    <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
                                    <h1 className='account-setting-heading'>
                                        Account Settings
                                    </h1>
                                </Container>

                            </Container>
                            {/* <div className={profile.maincontainer}>

                                <div className={profile.imgContainer}>
                                    <div >
                                        <img className={profile.profilepicimg} src={images2.main} alt="" />
                                    </div>
                                </div>
                            </div> */}

                            {
                                getCookie('isPremium') !== 'true' && (
                                    <div className="upgrade-button">

                                        <div> <span><Image src={premium} /></span> Upgrade Account</div>
                                        <div className="description">
                                            Upgrade your account, you will have unlimited access and wider exposure
                                        </div>
                                        <button className={profile.upgradebutton} onClick={() => navigateTo('/selectplan')} >Upgrade Now</button>
                                    </div>
                                )
                            }

                            <div className='edittext-logo'>
                                <p className='textofedit'>Tap on each section to edit</p>
                                <div>
                                    <Image className='editlogo' src={editlogo} />
                                </div>
                            </div>


                            <div>
                                {/* User Info Section */}
                                <div className="user-info-container">
                                    <div className="user-info-item" onClick={handleShowName}>
                                        <div className='leftsideinfo'>
                                            {/* <Image className='userinfoicon' src={username} /> */}
                                            <div>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 15H8C5.79086 15 4 16.7909 4 19V21H20V19C20 16.7909 18.2091 15 16 15Z" stroke="#4E1173" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#4E1173" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                                            </div>
                                            <span className='userleftinfo' >User name</span>
                                        </div>
                                        <div>
                                            <span className="value">{NamePhoneEmail.first_name + " " + (NamePhoneEmail.last_name ? NamePhoneEmail.last_name : "")}</span>
                                        </div>
                                    </div>
                                    <div className="user-info-item" onClick={handleShowPhone}>
                                        <div className='leftsideinfo'>
                                            {/* <Image className='userinfoicon' src={phonenumber} /> */}
                                            <div>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.9994 19.1864V16.4767C21.0104 16.0337 20.8579 15.6021 20.5709 15.264C19.7615 14.3106 16.9855 13.7008 15.8851 13.935C15.0273 14.1176 14.4272 14.9788 13.8405 15.5644C11.5746 14.2785 9.69858 12.4062 8.41019 10.1448C8.9969 9.55929 9.85987 8.96036 10.0428 8.10428C10.2771 7.00777 9.66813 4.24949 8.72131 3.43684C8.38828 3.151 7.96247 2.99577 7.52325 3.00009H4.80811C3.77358 3.00106 2.91287 3.92895 3.00706 4.96919C3 13.935 10 21 19.0264 20.9929C20.0722 21.0873 21.0036 20.2223 20.9994 19.1864Z" stroke="#4E1173" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                                            </div>
                                            <span className='userleftinfo'>Phone Number</span>
                                        </div>
                                        <div>
                                            <span className="value">{NamePhoneEmail.phone}</span>
                                        </div>
                                    </div>
                                    <div className="user-info-item" style={{border : "none"}} onClick={handleShowEmail}>
                                        <div className='leftsideinfo'>
                                            {/* <Image className='userinfoicon' src={emailicon} /> */}
                                            <div>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.29289 5.29289C3.47386 5.11193 3.72386 5 4 5H20C20.2761 5 20.5261 5.11193 20.7071 5.29289M3.29289 5.29289C3.11193 5.47386 3 5.72386 3 6V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V6C21 5.72386 20.8881 5.47386 20.7071 5.29289M3.29289 5.29289L10.5858 12.5857C11.3668 13.3668 12.6332 13.3668 13.4142 12.5857L20.7071 5.29289" stroke="#4E1173" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                                            </div>
                                            <span className='userleftinfo'>Email</span>
                                        </div>
                                        <div>
                                            <span className="value">{NamePhoneEmail.email}</span>
                                        </div>
                                    </div>

                                    {/* {
                                        getCookie('isPremium') !== 'true' && (
                                            <div className="upgrade-button">

                                                <div> <span><Image src={premium} /></span> Upgrade Account</div>
                                                <div className="description">
                                                    Upgrade your account, you will have unlimited access and wider exposure
                                                </div>
                                                <button className={profile.upgradebutton} onClick={() => navigate('/selectplan')} >Upgrade Now</button>
                                            </div>
                                        )
                                    } */}
                                    {/* <div style={{marginTop : "50px"}}>

                            <PricingCard/>
                            </div> */}

                                    <div className="payment-button">
                                        Payment
                                    </div>
                                    <div style={{ marginTop: "20px", marginBottom: "20px", borderBottom: "1px solid #e0e0e0", width: "100%" }} >

                                        <div className="user-info-item-payment" onClick={() => navigateTo("/paymentmethod")}>
                                            <div className='leftsideinfo'  style={{
                                                display : "flex",
                                                alignItems : "center",
                                                justifyContent : "center",
                                                gap : "10px"
                                            }}>
                                                <Image className='userinfoicon' src={CreditCard} />
                                                <p className='userleftinfo'>
                                                Payment Method
                                                </p>
                                                {/* <span className='userleftinfo'>Payment Method</span> */}
                                            </div>
                                            <div>
                                                <span className="value"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='paymentforbox' style={{ marginBottom: "20px", borderBottom: "1px solid #e0e0e0", width: "100%" }} >

                                        <div className="user-info-item-payment" onClick={() => navigateTo("/billinghistory")}>
                                            <div className='leftsideinfo' 
                                            style={{
                                                display : "flex",
                                                alignItems : "center",
                                                justifyContent : "center",
                                                gap : "10px"
                                            }}>
                                                <Image className='userinfoicon' src={emailicon} />
                                                <p className='userleftinfo'> Billing History</p>
                                                {/* <span >Billing History</span> */}
                                            </div>
                                            <div>
                                                <span className="value"></span>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                getCookie('isPremium') === 'true' && (
                                    <div onClick={() => {
                                            showsubscriptionModal();
                                        
                                    }} style={{ marginBottom: "20px", border : "none", width: "100%" }} >

                                        <div className="user-info-item-payment" style={{border : "none"}} >
                                            <div className='leftsideinfo' style={{
                                                display : "flex",
                                                alignItems : "center",
                                                justifyContent : "center",
                                                gap : "10px",
                                                border : "none"
                                            }}>
                                                <Image  className='userinfoicon' src={pauseicon} />
                                                <p className='userleftinfo'>

                                               Disable Subscription
                                                </p>
                                                
                                            </div>
                                            <div>
                                                <span className="value"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                    <div className="legal-button">
                                        Legal
                                    </div>
                                </div>

                                <div className="user-info-container">
                                    <div className="last-user-info-item">
                                    <div>
                                            <Image className='userinfoicon' src={emailicon} />
                                        </div>
                                        <div className='lastleftsideinfo' onClick={ handleUnsubscribeEmail }>
                                            <span className='lastuserleftinfo'>Email Unsubscribe</span>
                                        </div>
                                        
                                    </div>

                                    <div className="last-user-info-item" onClick={GotoPrivacyPolicy}>
                                    <div>
                                            <Image className='userinfoicon' src={privacy} />
                                        </div>
                                        <div className='lastleftsideinfo'>
                                            <span className='lastuserleftinfo'>Privacy Policy</span>
                                        </div>
                                        
                                    </div>
                                    <div className="last-user-info-item" onClick={Gototermandconditions}>
                                    <div>
                                            <Image className='userinfoicon' src={service} />
                                        </div>
                                        <div className='lastleftsideinfo'>
                                            <span className='lastuserleftinfo'>Terms of Service</span>
                                        </div>
                                       
                                    </div>

                                    <div className="last-user-info-item" style={{ border: "none" }} onClick={handleShowLogout}>
                                    <div>
                                            <Image className='userinfoicon' src={logout} />
                                        </div>
                                        <div className='lastleftsideinfo' >
                                            <span className='lastuserleftinfo' >Logout</span>
                                        </div>
                                       
                                    </div>

                                    <div
  className="pause-button"
  onClick={() => {
    if (!Rejected) {
      handleShowPause();
    } else {
      setShowRejectedModal(true);
    }
  }}
>
  <Image
    style={{ marginRight: "6px" }}
    className="fas fa-pause-circle"
    src={pauseicon}
  />
  <span>Pause my account</span>
</div>

                                    <div className="pause-button"
                                     onClick={() => {
                                        if (!Rejected) {
                                            handleShowDeleteAccount();
                                        } else {
                                          setShowRejectedModal(true);
                                        }
                                      }}
                                   >
                                        <Image style={{ marginRight: "6px" }} className="fas fa-pause-circle" src={deleteicon} />
                                        <span>Delete my Account</span>
                                    </div>

                                    {/* <button className="delete-button" onClick={!Rejected ? handleShowDeleteAccount : null}>
                                        <span>Delete my Account</span>
                                        <Image className='userinfoicon' src={deleteicon} />
                                    </button> */}





                                </div>
                            </div>
                        </div>
                    </div>



                    {/* update the Name  */}

                    <Modal show={showUserName} centered>
                        <Modal.Header >
                            <Modal.Title>Update User Name</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Control
                                    type="text"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={handleFirstNameChange}
                                    className="form-control-name"
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={handleLastNameChange}
                                    className="form-control-name"
                                />
                            </Form>
                        </Modal.Body>
                        <Modal.Footer style={{
                            gap : "30px"
                        }}>
                            
                            <button className="global-cancel-button" onClick={handleCloseName}>
                                Cancel
                            </button>
                            <button  className="global-save-button" onClick={handleSaveFirstLastName}>
                                Save
                            </button>
                        </Modal.Footer>
                    </Modal>


                    {/* Update the email Address */}



                    <Modal show={showUserEmail} centered>
                        <Modal.Header >
                            <Modal.Title>Update Your Email</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit} className=''>
                                <Container className='signin-emailverify-content'>
                                    <div style={{ width: '100%', alignItems: 'center' }}>
                                        <Form.Group controlId="formCode" className='signin-emailverify-form-group'>
                                            <Form.Control
                                                className={`signin-emailverify-input ${errorMessageemail ? 'error' : ''}`}
                                                type="text"
                                                style={{ flex: 1 }}
                                                placeholder="Example@gmail.com"
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <div style={{
                                                marginTop : "5px"
                                            }}>

                                            {errorMessageemail && <Form.Text className="text-danger error-message">{errorMessageemail}</Form.Text>}
                                            </div>
                                        </Form.Group>
                                    </div>
                                </Container>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="d-flex justify-content-center" style={{ width: "100%", gap: "30px" }}>
                                <button className='global-cancel-button'
                                    onClick={handleCloseEmail}>
                                    Cancel
                                </button>
                                <button className="global-save-button" onClick={handleSubmit}>
                                    Save
                                </button>
                            </div>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showUserEmailotp} centered>
                        <Modal.Header >
                            <Modal.Title>Verify Code</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmitEmailotp} className=''>
                                <Container className='entercode-content' style={{ marginBottom: "100px" }}>
                                    <div>
                                        <Form.Group controlId="formCode" className='entercode-form-group'>
                                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                                <Form.Control
                                                    className={`entercode-input ${errorMessageotp ? 'error' : ''}`}
                                                    type="text"
                                                    ref={code1ref}
                                                    placeholder=""
                                                    value={code1}
                                                    onChange={(e) => handleCodeChange(e, setCode1, code2ref)}
                                                    onKeyDown={(e) => handleKeyDown(e, null)}
                                                    style={{ flex: 1 }}
                                                />
                                                <Form.Control
                                                    className={`entercode-input ${errorMessageotp ? 'error' : ''}`}
                                                    type="text"
                                                    ref={code2ref}
                                                    placeholder=""
                                                    value={code2}
                                                    onChange={(e) => handleCodeChange(e, setCode2, code3ref)}
                                                    onKeyDown={(e) => handleKeyDown(e, code1ref)}
                                                    style={{ flex: 1, marginLeft: '10px' }}
                                                />
                                                <Form.Control
                                                    className={`entercode-input ${errorMessageotp ? 'error' : ''}`}
                                                    type="text"
                                                    ref={code3ref}
                                                    placeholder=""
                                                    value={code3}
                                                    onChange={(e) => handleCodeChange(e, setCode3, code4ref)}
                                                    onKeyDown={(e) => handleKeyDown(e, code2ref)}
                                                    style={{ flex: 1, marginLeft: '10px' }}
                                                />
                                                <Form.Control
                                                    className={`entercode-input ${errorMessageotp ? 'error' : ''}`}
                                                    type="text"
                                                    ref={code4ref}
                                                    placeholder=""
                                                    value={code4}
                                                    onChange={(e) => handleCodeChange(e, setCode4, null)}
                                                    onKeyDown={(e) => handleKeyDown(e, code3ref)}
                                                    style={{ flex: 1, marginLeft: '10px' }}
                                                />
                                            </div>
                                            {errorMessageotp && <Form.Text className="text-danger error-message">{errorMessageotp}</Form.Text>}
                                        </Form.Group>
                                        <div className='resend-timer'>
                                            <a
                                                href='#'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (canResend) handleResendCode();
                                                }}
                                                className={!canResend ? 'disabled' : ''}
                                                style={{ pointerEvents: !canResend ? 'none' : 'auto', color: !canResend ? 'grey' : 'initial' }}
                                            >
                                                Resend code
                                            </a>
                                            <span>{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')} sec</span>
                                        </div>

                                    </div>
                                </Container>
                                <div className="d-flex justify-content-center" style={{ width: "100%", gap: "30px" }}>
                                    <button className='global-cancel-button' onClick={handleCloseEmailotp}>
                                        Cancel
                                    </button>
                                    <button className="global-save-button" onClick={handleSubmitEmailotp}>
                                        Save
                                    </button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>


                    <Modal show={showsuccessemail} onHide={handleClosesuccess} centered>
                        <Modal.Body className="success-modal-content">
                            <Image className="success-icon" src={Right} />
                            <div className="success-title">Success</div>
                            <div className="success-message">Email was changed successfully</div>
                            <Button className="btn-okay" onClick={handleClosesuccess}>
                                Okay
                            </Button>
                        </Modal.Body>
                    </Modal>


                    {/* update the phone number */}

                    <Modal show={showUserphone} centered>
                        <Modal.Header >
                            <Modal.Title>Update Your Number</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Container className=''>
                                <Form onSubmit={handleSubmit} className='verify-phone-form'>
                                    <Form.Group style={{ marginBottom: "100px" }} controlId="formPhoneNumber" className='verify-form-group'>

                                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <Dropdown>
                                                <div id="dropdown-basic" onClick={() => setshowModalcountry(true)} className='flag-box'
                                                    style={{
                                                        borderColor  : errorMessagephoneupdate ? "red" : "",
                                                    }}>
                                                    <Flag code={selectedCountry} style={{ width: '34px', height: '25px', marginRight: '10px' }} className='flag' />
                                                    <span>{selectedCountryInfo.dial_code}</span>
                                                </div>
                                            </Dropdown>
                                            <Form.Control
                                                className={`num-verify-input ${errorMessagephoneupdate ? 'error' : ''}`}
                                                type="text"
                                                placeholder="(xxx)xxx-xxx"
                                                value={formattedPhoneNumber}
                                                onChange={handlePhoneNumberChange}
                                                style={{ flex: 1, marginLeft: '10px' }}
                                            />
                                        </div>
                                        <div style={{
                                            marginTop : "1px",
                                            display : "flex"

                                        }}>

                                        {errorMessagephoneupdate && <Form.Text className="text-danger error-message">{errorMessagephoneupdate}</Form.Text>}
                                        </div>
                                    </Form.Group>
                                    <Container style={{ display: "flex", justifyContent: "center", alignItems: "center" , gap : "30px" }}>

                                        <button className="global-cancel-button" onClick={handleClosephone}>
                                            Cancel
                                        </button>
                                        <button  className="global-save-button" onClick={handleSubmitphone}>
                                            Save
                                        </button>
                                    </Container>
                                </Form>

                            </Container>
                        </Modal.Body>

                    </Modal>

                    <Modal show={showModalcountry} onHide={() => setshowModalcountry(false)}
                        centered
                        dialogClassName="custom-modal"
                    >
                        {/* <Modal.Header closeButton>

                </Modal.Header> */}

                        <Modal.Body style={{
                            maxHeight: "500px",
                            overflowY: "auto",
                            width: "100%",
                        }}>
                            <InputGroup className="mb-3" style={{
                                position: 'sticky',
                                top: '0',
                                width: '100%',
                            }}>
                                <FormControl
                                    placeholder="Search Country"
                                    aria-label="Search Country"
                                    aria-describedby="basic-addon2"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                            {filteredCountries.map((country) => (
                                <div key={country.code} className='flag-item' onClick={() => handleCountrySelect(country.code)}>
                                    <Flag code={country.code} style={{ width: '24px', height: '18px', marginRight: '10px' }} />
                                    {country.name} ({country.dial_code})
                                </div>
                            ))}
                        </Modal.Body>
                    </Modal>

                    <VerifyPhoneModal
                        showUserPhoneotp={showUserPhoneotp}
                        handleClosePhoneotp={handleClosePhoneotp}
                        handleShowsuccessphone={handleShowsuccessphone}
                        fetchData={fetchData}
                        setResendTimer={setResendTimer}
                        resendTimer={resendTimer}
                        modalPhoneNumber={modalPhoneNumber}
                        setModalPhoneNumber={setModalPhoneNumber}
                        errorMessagephone={errorMessagephone}
                        seterrorMessagephone={errorMessagephone}
                    />

                    <Modal show={showsuccessphone} onHide={handleClosesuccessphone} centered>
                        <Modal.Body className="success-modal-content">
                            <Image className="success-icon" src={Right} />
                            <div className="success-title">Done</div>
                            <div className="success-message">Phone number has been updated successfully</div>
                            <Button className="btn-okay" onClick={handleClosesuccessphone}>
                                Okay
                            </Button>
                        </Modal.Body>
                    </Modal>


                    {/* pause my account */}
                    <Modal show={showPause} onHide={handleClosePause} centered>
                        <Modal.Body className="pause-modal-content">

                            <div className="pause-modal-title">Pause your account?</div>
                            <div className="pause-modal-message">
                                Your profile will be hidden and other members will not be able to see or message you. You can reactivate your account anytime.
                            </div>
                            <div className="d-flex justify-content-center" 
                            style={{
                                gap : "30px"
                            }}>
                                <button  className="global-cancel-button" onClick={handleClosePause}>
                                    No
                                </button>
                                <button  className="global-save-button" onClick={handlePauseAccount}>
                                    Yes
                                </button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showPauseOption} onHide={handleClosePauseOption} centered>
                        <Modal.Body className="feedback-modal-content">
                            <div className="feedback-modal-title">
                                Sorry we didn’t have what you were looking for this time!
                            </div>
                            <div className="feedback-modal-subtitle">
                                We'd love to get your feedback so we can improve
                            </div>
                            <Form>
                                <div className="feedback-options">
                                    <Form.Check
                                        type="radio"
                                        label="I met somebody on myTamilDate!"
                                        name="feedback"
                                        id="feedback1"
                                        className="feedback-option"
                                        onChange={() => setSelectedOption('option1')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="I got too many messages from other members"
                                        name="feedback"
                                        id="feedback2"
                                        className="feedback-option"
                                        onChange={() => setSelectedOption('option2')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="I met somebody elsewhere"
                                        name="feedback"
                                        id="feedback3"
                                        className="feedback-option"
                                        onChange={() => setSelectedOption('option3')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="It's too expensive"
                                        name="feedback"
                                        id="feedback4"
                                        className="feedback-option"
                                        onChange={() => setSelectedOption('option4')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="The site is hard to use"
                                        name="feedback"
                                        id="feedback5"
                                        className="feedback-option"
                                        onChange={() => setSelectedOption('option5')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="There aren’t enough people in my area"
                                        name="feedback"
                                        id="feedback6"
                                        className="feedback-option"
                                        onChange={() => setSelectedOption('option6')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Others"
                                        name="feedback"
                                        id="feedback7"
                                        className="feedback-option"
                                        onChange={() => setSelectedOption('option7')}
                                    />
                                </div>
                                <div className="d-flex justify-content-center" style={{
                                   gap : "3px"
                                }}>
                                    <button  className="global-cancel-button" onClick={handleClosePauseOption}>
                                        Cancel
                                    </button>

                                    <button  style={{
                                    width : "200px"
                                }} className="global-save-button" onClick={PauseMyAccount}>
                                        Pause account
                                    </button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    {/* Unsubscribe email  */}

                    <Modal show={showUnsubscribeEmail} onHide={handleCloseUnsubscribeEmail} centered>
                        <Modal.Body className="pause-modal-content">
                            <div className="pause-modal-title">Cancel Auto-Renewal on your Subscription?</div>
                            <div className="pause-modal-message">
                                Your account will not auto-renew and your service will be interrupted on the expiry date. Keep auto-renew for a seamless experience.
                            </div>
                            <div className="d-flex justify-content-center" style={{
                                gap : "30px"
                            }}>
                                <button variant="outline-danger" className="global-cancel-button" onClick={handleCloseUnsubscribeEmail}>
                                    Cancel
                                </button>
                                <button className="global-save-button" onClick={handleUnsubscribeEmail}>
                                    Keep
                                </button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/* delete my account */}
                    <Modal show={showDeleteAccount} onHide={handleCloseDeleteAccount} centered>
                        <Modal.Body className="pause-modal-content">
                            <div style={{ display: "flex" }}>
                                <Image style={{ width: "24px", height: "24px", marginTop: "7px" }} className="fas fa-pause-circle" src={pauseicon} />
                                <div className="pause-modal-title">Pause your account instead</div>
                            </div>
                            <div className="pause-modal-message">
                                <p>Just need a break?</p>
                                <p> Pause your account and hide your profile, and come back anytime.</p>
                            </div>
                            <div className="d-flex justify-content-center" style={{
                                gap : "30px"
                            }}>
                                <button  className="global-cancel-button" onClick={handleCloseDeleteAccount}>
                                    Cancel
                                </button>
                                <button style={{
                                  fontWeight : "500",  padding: "12px 32px 12px 32px", fontSize : "16px", backgroundColor: "#F7ECFF", color: "black", width: "122px", border: "none", borderRadius: "24px", boxshadow: "0px 4px 10px 0px #00000029"
                                }} onClick={handleShowPauseModel}>
                                    Pause
                                </button>
                            </div>
                            <div style={{ marginTop: "20px" }}>
                                <button variant="primary" width="300px" className="global-save-button" onClick={handleDeleteAccount}>
                                    Delete
                                </button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showDeleteOption} onHide={handleCloseDeleteOption} centered>
                        <Modal.Body className="feedback-modal-content">
                            <div className="feedback-modal-title">
                                Sorry we didn’t have what you were looking for this time!
                            </div>
                            <div className="feedback-modal-subtitle">
                                We want to improve, give us feedback and you will have a chance to win $50 CDN Amazon gift card!
                            </div>
                            <Form>
                                <div className="feedback-options">
                                    {feedbackOptions.map((option, index) => (
                                        <Form.Check
                                            type="radio"
                                            label={option}
                                            name="feedback"
                                            id={`feedback${index + 1}`}
                                            className="feedback-option"
                                            key={index}
                                            onChange={() => {
                                                setSelectedDeleteOption(index + 1);
                                                setDeleteReason(option);
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="d-flex justify-content-center" style={{
                                    gap : "3px"
                                }}>
                                <button className="global-cancel-button" onClick={handleCloseFinalDelete}>
                                    Cancel
                                </button>
                                    
                                    <button style={{
                                        width : "250px"
                                    }}  className="global-next-btn" onClick={handleDeleteAccountOption}>
                                    Delete account
                                </button>
                                    
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    <Modal show={showFinalDelete} onHide={handleCloseFinalDelete} centered>
                        <Modal.Body className="pause-modal-content">
                            <div className="pause-modal-title">Delete your Account?</div>
                            <div className="pause-modal-message">
                                You cannot recover your account once deleted, are you sure you want to delete your account?
                            </div>
                            <div className="d-flex justify-content-center" style={{
                                    gap : "30px"
                                }}>
                            <button className="global-cancel-button" onClick={handleCloseFinalDelete}>
                                    Cancel
                                </button>
                                
                                <button  className="global-save-button" onClick={handleFinalDelete}>
                                    Delete
                                </button>
                                
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/* logout my Account */}


                    <Modal show={showFinalDetele} onHide={handleCloseFinalDetele} centered>

                        <Modal.Body className="pause-modal-content">

                            <div className="pause-modal-title">Delete your Account?</div>
                            <div className="pause-modal-message">
                                You cannot recover your account once deleted, are you sure you want to delete your account?
                            </div>
                            <div className="d-flex justify-content-center" style={{
                                gap : "30px"
                            }}>
                                <button className="global-cancel-button" onClick={handleCloseFinalDetele}>
                                    Cancel
                                </button>
                                <button  className="global-save-button" onClick={handleFinalDelete}>
                                    Delete
                                </button>
                            </div>
                        </Modal.Body>
                    </Modal>
                    <LogoutModal
                        showLogoutModal={showLogoutModal}
                        handleCloseLogout={handleCloseLogout}
                        handleLogout={handleLogout}
                    />

                        {/* Unsubscribe subscriptions */}

                        <Modal show={showsubscription} onHide={HidesubcriptionsModal} centered>
                        <Modal.Body className="pause-modal-content" style={{
                            padding : "0px"
                        }}>
                            {/* <div className="pause-modal-title">Subscription Cancel</div> */}
                            <div className="pause-modal-message">
                            Are you sure you want to cancel your premium access?
                            </div>
                            <div className="pause-modal-message" style={{
                                marginTop : "-20px",
                                marginBottom : "40px"
                            }}>
                            You'll lose all the extra perks!
                            </div>
                            <div className="d-flex justify-content-center" style={{
                                gap : "5px"
                            }}>
                                <button variant="outline-danger" className="global-cancel-button" onClick={cancelSubscription}>
                                    Cancel
                                </button>
                                <button className="global-save-button" style={{
                                    width : "197px"
                                }} onClick={HidesubcriptionsModal}>
                                Keep Premium
                                </button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <Modal show={SubscriptSuccess} onHide={HideSubscriptionSuccess} centered>
                        <Modal.Body className="pause-modal-content" style={{
                            padding : "0px"
                        }}>
                            <div className="pause-modal-title">Subscription Cancelled</div>
                          
                            <div className="pause-modal-message">

                          Your subscription has been successfully cancelled.
                            </div>
                            <div className="d-flex justify-content-center" style={{
                                gap : "5px"
                            }}>
                             
                                <button className="global-save-button" style={{
                                    width : "197px"
                                }} onClick={GoTOAccountsetting}>
                               Okay
                                </button>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </Sidebar>
    );
};


function RejectModal({ show, setShow }) {
    return (
        <Modal centered className="selfie-modal" show={show} onHide={() => setShow(false)}>
            <Modal.Body className='selfie-modal-body'>
                Your profile is currently not approved. Please update your profile to access this feature.

                <div>
                    <button type="submit" className='global-save-button' onClick={() => setShow(false)}>
                        Okay
                    </button>
                </div>

            </Modal.Body>
        </Modal>
    )
}