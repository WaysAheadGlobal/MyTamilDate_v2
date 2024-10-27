import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Image, Modal, Row } from 'react-bootstrap';

import Cropper from 'react-easy-crop';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../api';
import logo from "../assets/images/MTDlogo.png";
import logo2 from "../assets/images/logo2.png";
import addplus from "../assets/images/add-plus.png";
import backarrow from "../assets/images/backarrow.jpg";
import dont from "../assets/images/do.png";
import doo from "../assets/images/dont.png";
import pic from "../assets/images/pic.png";
import responsivebg from "../assets/images/responsive-bg.png";
import { useCookies } from '../hooks/useCookies';
import './take-selfie1.css';
import { useAlert } from '../Context/AlertModalContext';
import ImageCrop from './cropimage/ImageCrop';

export const Selfie = () => {

    const navigate = useNavigate();
    const imageCropRef = useRef(null);
    const childRef = useRef(); 
    const [selectedImages, setSelectedImages] = useState({ main: null, first: null, second: null });
    const [selectedImagesurl, setSelectedImagesurl] = useState({ main: null, first: null, second: null });
    const [showModal, setShowModal] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [currentImageKey, setCurrentImageKey] = useState(null);
    const [showDosDontsModal, setShowDosDontsModal] = useState(false);
    const { getCookie } = useCookies();
    const [loading, setLoading] = useState(false);
    const [showDuplicateNameModal, setShowDuplicateNameModal] = useState(false);
    const [originalFileName, setOriginalFileName] = useState("");
    const alert = useAlert();
    console.log(selectedImages);
    const fileInputRefMain = useRef(null);
    const fileInputRefFirst = useRef(null);
    const fileInputRefSecond = useRef(null);

    const [images, setImages] = useState({
        main: null,
        first: null,
        second: null,
    });

    const checkForDuplicateNames = (file, imageKey) => {
        const fileName = file.name;
        const existingFileNames = Object.keys(selectedImages)
            .filter(key => key !== imageKey && selectedImages[key] !== null)
            .map(key => selectedImages[key]?.name);

        return existingFileNames.includes(fileName);
    };


    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${API_URL}/customer/users/media`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${getCookie('token')}`,
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    const others = data.filter(image => image.type === 32);
                    const main = data.filter(image => image.type === 31)[0];
                    setImages({
                        main: API_URL + "media/avatar/" + main.hash + "." + main.extension,
                        first: API_URL + "media/avatar/" + others[0].hash + "." + others[0].extension,
                        second: API_URL + "media/avatar/" + others[1].hash + "." + others[1].extension,
                    })

                    console.log({
                        main: API_URL + "media/avatar/" + main.hash + "." + main.extension,
                        first: API_URL + "media/avatar/" + others[0].hash + "." + others[0].extension,
                        second: API_URL + "media/avatar/" + others[1].hash + "." + others[1].extension,
                    })
                }
            } catch (error) {
                console.error('Error saving images:', error);
            }
        })()
    }, [])

    const handleFileChange = (event, imageKey) => {
        const file = event.target.files[0];
        if (file) {
            if (checkForDuplicateNames(file, imageKey)) {
                setShowDuplicateNameModal(true);
                console.log("duplicate photo");
                // alert.setModal({
                //     show: true,
                //     message: "Please add a photo you haven't already used",
                //     title: "Duplicate Photo",
                // })
                return;
            }

            setOriginalFileName(file.name);

            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result);
            };
            reader.readAsDataURL(file);

            setCurrentImageKey(imageKey);
            setShowCropModal(true);
        }
    };


    const handleClick = (imageKey) => {
        if (imageKey === 'main') {
            fileInputRefMain.current.click();
        } else if (imageKey === 'first') {
            fileInputRefFirst.current.click();
        } else if (imageKey === 'second') {
            fileInputRefSecond.current.click();
        }
    };

    const handleNextClick = async () => {
        if (images.main && images.first && images.second) {
            navigate("/located");
            return;
        }

        if (!selectedImages.main || !selectedImages.first || !selectedImages.second) {
            setShowModal(true);
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('main', selectedImages.main);
        formData.append('first', selectedImages.first);
        formData.append('second', selectedImages.second);

        try {
            const response = await fetch(`${API_URL}/customer/users/media`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${getCookie('token')}`,
                }
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/located");
            }
        } catch (error) {
            console.error('Error saving images:', error);
        } finally {
            setLoading(false);
        }
    };

    const onCropComplete = (croppedAreaPixels) => {
        console.log(croppedAreaPixels)
        setCroppedAreaPixels(croppedAreaPixels);
    }

    const handleCropSave = (croppedAreaPixels) => {
        /* console.log('Attempting to save cropped image:', imageToCrop, croppedAreaPixels); */
        console.log(croppedAreaPixels)
        // Ensure croppedAreaPixels is not null before proceeding
        if (!croppedAreaPixels) {
            throw new Error('No cropped area to save');
        }

                console.log(new File([croppedAreaPixels], originalFileName, { type: 'image/jpeg' }));

                setSelectedImages({
                    ...selectedImages,
                    [currentImageKey]: new File([croppedAreaPixels], originalFileName, { type: 'image/jpeg' })
                })
                setSelectedImagesurl({
                    ...selectedImagesurl,
                    [currentImageKey]: croppedAreaPixels
                })

                setShowCropModal(false);

                console.log('Cropped image saved successfully');
          
    };

    const handleCropCancel = () => {
        setShowCropModal(false);
        setImageToCrop(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
    };

  

    const handleDosDontsClick = () => {
        // Here you can set initial dos and don'ts if needed
        setShowDosDontsModal(true);
    };

    const handleDosDontsClose = () => {
        setShowDosDontsModal(false);
    };
    useEffect(() => {
        // Automatically show the dos and don'ts modal when the component mounts
        setShowDosDontsModal(true);
    }, []);

    console.log(
        Object.values(selectedImages).some(image => !image),
        Object.values(images).some(image => !image),
        (
            Object.values(selectedImages).some(image => !image)
            && Object.values(images).some(image => !image)
        )
    )

    return (
        <div className='selfie-container'>
            <div className='selfie-bg'>
                <Image className='responsive-bg' src={responsivebg}></Image>
            </div>
            <Container className='selfie-main'>
                <Container className='logo-progressbar6'>
                    <Container className='logo-arrow6'>
                        <Image src={backarrow} className='backarrow' onClick={() => window.history.back()} />
                        <Image src={logo2} alt="Logo" className='logo' style={{ backgroundColor: 'transparent' }} />
                    </Container>
                    <div className='track-btn6'>
                        <div></div>
                    </div>
                </Container>
                <Container className='selfie-text'>
                    <Image className='selfie-icon' src={pic}></Image>
                    <p className='pic-heading'>Add your photos</p>
                </Container>
                <Container>
                <p className='pic-text' style={{
    fontSize: "16px"
}}>
    Use pics of yourself which clearly show your face, your hobbies & more! Check out more <a href='#' onClick={handleDosDontsClick} style={{ textDecoration: 'underline' }}>tips here</a>.<br />
</p>

                </Container>
                <Container className='selfie-adding'>
                    <Row className='selfie-row' onClick={() => handleClick('main')}>
                        <Col md={12} className='selfie-box1' style={{
                            height: "24dvh"
                        }}>
                            {!(selectedImages.main || images.main) && (
                                <>
                                    <Image className='selfie-icon' src={addplus}></Image>
                                    <span>Add your main photo</span>
                                </>
                            )}
                            {(selectedImages.main || images.main) && <Image src={selectedImages.main ? URL.createObjectURL(selectedImages.main) : images.main} className="user-picture1" style={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'contain',
                            }} alt="Selected" fluid />}
                            <input
                                type="file"
                                ref={fileInputRefMain}
                                onChange={(e) => handleFileChange(e, 'main')}
                                style={{ display: 'none' }}
                            />
                        </Col>
                    </Row>
                    <Row className='selfie-row2'>
                        <Col md={6} className='selfie-box2' style={{
                            height: "20dvh"
                        }} onClick={() => handleClick('first')}>
                            {!(selectedImages.first || images.first) && (
                                <>
                                    <Image className='selfie-icon' src={addplus} style={{ marginTop: '5px', objectFit: "contain", objectPosition: "center" }}></Image>
                                    <span>Add photo</span>
                                </>
                            )}
                            {(selectedImages.first || images.first) && <Image src={selectedImages.first ? URL.createObjectURL(selectedImages.first) : images.first} className="user-picture2" style={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'contain',
                            }} alt="Selected" fluid />}
                            <input
                                type="file"
                                ref={fileInputRefFirst}
                                onChange={(e) => handleFileChange(e, 'first')}
                                style={{ display: 'none' }}
                            />
                        </Col>
                        <Col md={6} className='selfie-box2' style={{
                            height: "20dvh"
                        }} onClick={() => handleClick('second')}>
                            {!(selectedImages.second || images.second) && (
                                <>
                                    <Image className='selfie-icon' src={addplus} style={{ marginTop: '5px' }}></Image>
                                    <span>Add photo</span>
                                </>
                            )}
                            {(selectedImages.second || images.second) && <Image src={selectedImages.second ? URL.createObjectURL(selectedImages.second): images.second} className="user-picture2" style={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'contain',
                            }} alt="Selected" fluid />}

                            <input
                                type="file"
                                ref={fileInputRefSecond}
                                onChange={(e) => handleFileChange(e, 'second')}
                                style={{ display: 'none' }}
                            />

                        </Col>
                    </Row>
                </Container>
                <button type="submit" className='global-next-bottom-fix-btn' onClick={handleNextClick} >
                    Next
                    {
                        loading && <div className="spinner-border spinner-border-sm" style={{
                            marginLeft: '10px',
                        }} role="status">
                        </div>
                    }
                </button>
                {/* <Button
                    variant="primary"
                    type="button"
                    className='selfie-next-btn'
                    onClick={handleNextClick}
                    style={{
                         background: "linear-gradient(180deg, #FC8C66 -4.17%, #F76A7B 110.42%)",
color : "#fff"

                     
                    }}
                >
                    Next
                    {
                        loading && <div className="spinner-border spinner-border-sm" style={{
                            marginLeft: '10px',
                        }} role="status">
                        </div>
                    }
                </Button> */}
                <Modal centered className="selfie-modal" show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Body className='selfie-modal-body'>
                        Add 3 real pics to help people get to know you! Fake images will be rejected.
                        {/* <Button variant="secondary" className='selfie-modal-btn' onClick={() => setShowModal(false)}>
                            Close
                        </Button> */}
                        <button  className='global-save-button'  onClick={() => setShowModal(false)}>
                        Okay
                            </button>
                    </Modal.Body>
                </Modal>

                <Modal centered className="crop-modal" show={showCropModal} onHide={handleCropCancel}>
                    <Modal.Header>
                        <Modal.Title>Crop your photo</Modal.Title>

                    </Modal.Header>
                    <Modal.Body className='crop-modal-body'>
                    
                        <ImageCrop url = {imageToCrop} onCropComplete={onCropComplete} ref={childRef} handleCropSave={handleCropSave}/>
                    </Modal.Body>
                    <Modal.Footer className='crop-modal-footer'>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "20px"
                        }}>
                            <button variant="secondary" style={{ width: "160px" }} className='global-cancel-button' onClick={handleCropCancel}>
                                Cancel
                            </button>
            <button variant="secondary" style={{ width: "160px" }} className='global-save-button' onClick={() => {
            childRef.current.handleSubmit();
            childRef.current.handleSubmit();
            handleCropSave();
        }}>
            Add Photo
        </button>

                        </div>
                    </Modal.Footer>
                </Modal>

                <Modal centered className="dos-donts-modal" show={showDosDontsModal} onHide={handleDosDontsClose}>
                    <Modal.Header className='do-donts-head' closeButton>

                    </Modal.Header>
                    <Modal.Body className='dos-donts-modal-body'>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                <h5>Do’s</h5>
                                <Image style={{ marginBottom: '-20px', zIndex: '10' }} src={doo}></Image>
                                <ul className='dos'>
                                    <li><p><span>Light it up</span>: Use good lighting, natural light is best. Avoid shadows.</p></li>
                                    <li><p><span>Keep it real</span>: Use authentic pics of yourself which clearly show your face.</p></li>
                                    <li><p><span>Show off your personality</span>: Love traveling? Have a special hobby? Don't hesitate to show it off through your pics.</p></li>
                                </ul>
                            </div>
                            <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                <h5>Don’t</h5>
                                <Image style={{ marginBottom: '-20px', zIndex: '10' }} src={dont}></Image>
                                <ul className='dos'>
                                    <li><p><span>Hide your face</span>: Ensure your face is clearly visible. Avoid sunglasses or hats that hide your face.</p></li>
                                    <li><p><span>Fake it</span> Avoid heavy filters or overly edited photos. Stay authentic to how you look in real life. You're fabulous as you are!</p></li>
                                    <li><p><span>Add too many pics with others</span>: Group photos can be confusing as members might not know who you are. Solo pics are ideal!</p></li>
                                </ul>
                            </div>
                        </div>
                    </Modal.Body>
                    {/* <Modal.Footer>
                        <Button variant="secondary" onClick={handleDosDontsClose}>
                            Close
                        </Button>
                    </Modal.Footer> */}
                </Modal>
                <Modal centered className="selfie-modal" show={showDuplicateNameModal} onHide={() => setShowDuplicateNameModal(false)}>
                    <Modal.Body className='selfie-modal-body'>
                        Please add a photo you haven’t already used
                        {/* <Button variant="secondary" className='duplicate-name-modal-btn' onClick={() => setShowDuplicateNameModal(false)}>
                            Close
                        </Button> */}
                        <div style={{marginTop : "65px"}}>
                        <button  type="submit" className='global-save-button'  onClick={() => setShowDuplicateNameModal(false)}>
                        Okay
                            </button>
                        </div>

                    </Modal.Body>
                </Modal>

            </Container>
        </div>
    );
};




