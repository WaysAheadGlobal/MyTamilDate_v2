import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Image, Modal } from 'react-bootstrap';
import { Button, Col, Row } from 'react-bootstrap';
import picture from './pictureedit.module.css';
import questionmark from '../../../../assets/images/questionmark.png';
import Sidebar from '../../../userflow/components/sidebar/sidebar';
import profilepic from '../../../../assets/images/profilepic.png';
import deleteicon from '../../../../assets/images/deleteicon.png'
import editlogo from '../../../../assets/images/editicon2.png'
import { API_URL } from '../../../../api';
import { useCookies } from '../../../../hooks/useCookies';
import { useNavigate } from 'react-router-dom';
import backarrow from "../../../../assets/images/backarrow.jpg";
import editicon from '../../../../assets/images/editicon.png';
import Cropper from 'react-easy-crop';
import ImageCrop from '../../../cropimage/ImageCrop';


const EditPicture = () => {

  const { getCookie } = useCookies();
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  
  const [selectedImages, setSelectedImages] = useState({ main: null, first: null, second: null });
  const [selectedImagesurl, setSelectedImagesurl] = useState({ main: null, first: null, second: null });
  const [showModal, setShowModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [currentImageKey, setCurrentImageKey] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaid, setMediaId] = useState(null);
  const [type, setType] = useState(32);
  const childRef = useRef();
  const approvalstatus = getCookie('approval');
  const fileInputRefMain = useRef(null);
  const fileInputRefFirst = useRef(null);
  const fileInputRefSecond = useRef(null);
  const toggleInfoVisibility = () => {
    setShowInfo(!showInfo);
  };

  const gridType = 'primary'

  const id = getCookie('userId')
  console.log(id);
  const OldImageURL = 'https://data.mytamildate.com/storage/public/uploads/user';
  const [imagesupdate, setimagesupdate] = useState({
    main: null,
    first: null,
    second: null,
  });

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
      setData(data);

      if (response.ok) {
        if (data[0].type === 31 || data[1].type === 31 || data[2].type === 31) {
          const others = data.filter(image => image.type === 32);
          const main = data.filter(image => image.type === 31)[0];

          setImages2({
            main: API_URL + "media/avatar/" + main.hash + "." + (main.extension === "png" ? "jpg" : main.extension),
            first: API_URL + "media/avatar/" + others[0].hash + "." + (others[0].extension === "png" ? "jpg" : others[0].extension),
            second: API_URL + "media/avatar/" + others[1].hash + "." + (others[1].extension === "png" ? "jpg" : others[1].extension),
          })
        }
        else {
          const others = data.filter(image => image.type === 2);
          const main = data.filter(image => image.type === 1)[0];
    
          setImages2({
            main: OldImageURL + "/" + id + "/avatar/" + main.hash + "-large" + "." + (main.extension === "png" ? "jpg" : main.extension),
            first: OldImageURL + "/" + id + "/photo/" + others[0].hash + "-large" + "." +(others[0].extension === "png" ? "jpg" : main.extension),
            second: OldImageURL + "/" + id + "/photo/" + others[1].hash + "-large" + "." + (others[1].extension === "png" ? "jpg" : main.extension),
          })
        }

      }
    } catch (error) {
      console.error('Error saving images:', error);
    }
  }

  const UpdatedMedia = async () => {
    try {
      const response = await fetch(`${API_URL}customer/update/updated-media`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`
        }
      });

      const data = await response.json();
      // setData(data);
      console.log("update medaidata", data);

      if (response.ok) {
        const validImages = data.filter(image => image.hash && image.extension && (image.type === 31 || image.type === 32 || image.type === 1 || image.type === 2));

        if (validImages.length > 0) {
          const mainType31 = validImages.find(image => image.type === 31);
          const mainType32 = validImages.find(image => image.type === 32);
          const othersType32 = validImages.filter(image => image.type === 32);
          const mainType1 = validImages.find(image => image.type === 1);
          const mainType2 = validImages.find(image => image.type === 2);
          const othersType2 = validImages.filter(image => image.type === 2);

          if (mainType31 || mainType32) {
            setimagesupdate({
              main: mainType31 ? API_URL + "media/avatar/" + mainType31.hash + "." +  (mainType31.extension === "png" ? "jpg" : mainType31.extension) : null,
              first: othersType32[0] ? API_URL + "media/avatar/" + othersType32[0].hash + "." +  (othersType32[0].extension === "png" ? "jpg" : othersType32[0].extension) : null,
              second: othersType32[1] ? API_URL + "media/avatar/" + othersType32[1].hash + "." +  (othersType32[1].extension === "png" ? "jpg" : othersType32[1].extension) : null
            });
         
          } else if (mainType1 || mainType2) {
            setimagesupdate({
              main: mainType1 ? OldImageURL + "/" + id + "/avatar/" + mainType1.hash + "-large" + "." + (mainType1.extension === "png" ? "jpg" : mainType1.extension) : null,
              first: othersType2[0] ? OldImageURL + "/" + id + "/photo/" + othersType2[0].hash + "-large" + "." + (othersType2[0].extension === "png" ? "jpg" : othersType2[0].extension) : null,
              second: othersType2[1] ? OldImageURL + "/" + id + "/photo/" + othersType2[1].hash + "-large" + "." + (othersType2[1].extension === "png" ? "jpg" : othersType2[1].extension) : null
            });
          }
        }
      }
    } catch (error) {
      console.error('Error saving images:', error);
    }
  };

  const handleFileChange = (event, imageKey) => {
    const file = event.target.files[0];
    if (file) {
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
    let mediaId = null;
    if (imageKey === 'main') {
      console.log(data);
      mediaId = data.find(image => image.type === 1 || image.type === 31)?.id;
      fileInputRefMain.current.click();
      setType(31)
      console.log("31 id",mediaId);
    } else if (imageKey === 'first') {
      mediaId = data.find(image => image.type === 32 || image.type === 2)?.id;
      fileInputRefFirst.current.click();
      setType(32)
      console.log("32 id",mediaId);
      console.log(mediaId);
    } else if (imageKey === 'second') {
      console.log(data);
      mediaId = data.filter(image => image.type === 32 || image.type === 2 )[1]?.id;
      fileInputRefSecond.current.click();
      setType(32)
      console.log("322 id",mediaId);
      console.log(mediaId);
    }
    console.log(mediaId);
    setMediaId(mediaId);
  };


  const handleNextClick = async () => {
    setLoading(true);
    const formData = new FormData();
    console.log(selectedImages);
    if (selectedImages.main !== null) {

      formData.append('main', selectedImages.main);
    }
    else if (selectedImages.first != null) {

      formData.append('first', selectedImages.first);
    }
    else {

      formData.append('second', selectedImages.second);
    }

    if (mediaid) {
      formData.append('media_id', mediaid);
    }

    console.log("mediaid",mediaid);

    if (type) {
      formData.append('type', type);
    }
    try {
      const response = await fetch(`${API_URL}/customer/update/mediaupdate`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        }
      });

      const data = await response.json();
      setSelectedImages({ main: null, first: null, second: null })
      console.log(data);
    } catch (error) {
      console.error('Error saving images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextClickRejectedPending = async () => {
    console.log("called")
    if (!selectedImages.main && !selectedImages.first && !selectedImages.second) {
      setShowModal(true);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    console.log(selectedImages);
    if (selectedImages.main) {
      formData.append('main', selectedImages.main);
    }
    if (selectedImages.first) {
      formData.append('first', selectedImages.first);
    }
    if (selectedImages.second) {
      formData.append('second', selectedImages.second);
    }

    if (mediaid) {
      formData.append('media_id', mediaid);

    }

    if (type) {
      formData.append('type', type);
    }

    try {
      const response = await fetch(`${API_URL}/customer/users/mediaupdate`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error saving images:', errorData.message || response.statusText);
        return;
      }

      const data = await response.json();
      console.log(data);
      setSelectedImages({ main: null, first: null, second: null })
      ImageURL();
    } catch (error) {
      console.error('Error saving images:', error);
    } finally {
      setLoading(false);
    }
  };

  const onCropComplete = (croppedAreaPixels) => {
    console.log(croppedAreaPixels)

  }


  const handleCropSave = (croppedAreaPixels) => {
    /* console.log('Attempting to save cropped image:', imageToCrop, croppedAreaPixels); */
    console.log(croppedAreaPixels, "heelooo")
    // Ensure croppedAreaPixels is not null before proceeding
    if (!croppedAreaPixels) {
      throw new Error('No cropped area to save');
    }

    console.log(new File([croppedAreaPixels], originalFileName, { type: 'image/jpeg' }));

    setSelectedImages({
      ...selectedImages,
      [currentImageKey]: new File([croppedAreaPixels], originalFileName, { type: 'image/jpeg' })
    })


    setShowCropModal(false);
    console.log(URL.createObjectURL(selectedImages.main))
    console.log(URL.createObjectURL(selectedImages.first))
    console.log(URL.createObjectURL(selectedImages.second))

    console.log('Cropped image saved successfully');

  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageToCrop(null);
  };

  const handleDeleteImages = async () => {
    if (imagesupdate.main || imagesupdate.first || imagesupdate.second) {
      try {
        const response = await fetch(`${API_URL}customer/update/delete-media`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getCookie('token')}`
          }
        });

        if (response.ok) {
          console.log('Images deleted successfully');

          setimagesupdate({ main: null, first: null, second: null });
          navigate("/updateprofile")
        } else {
          console.error('Error deleting images');
        }
      } catch (error) {
        console.error('Error deleting images:', error);
      }
    }
    else {
      navigate("/updateprofile")
    }

  };

  const getGridItemStyle = (imagesupdate) => {
    const { main, first, second } = imagesupdate;
  
    // Determine window width
    const isMobile = window.innerWidth < 768;
  
    // Initialize style object
    const style = {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',         // Ensure the container itself uses flexbox
      alignItems: 'center',    // Vertically center content
      justifyContent: 'center',// Horizontally center content
    };
  
    // If there is only one image available, center it and add a left margin of 30px
    if ((main && !first && !second) || (!main && first && !second) || (!main && !first && second)) {
      return {
        ...style,
        width: isMobile ? '53%' : '40%', // Adjust width based on screen size
        height: isMobile ? '138%' : '140%',                  // Make sure the container takes the full height
        marginLeft: '30px',  
        left : isMobile ? '17%' : '26%',             // Add a left margin of 30px
      };
    }
  
    // If there are two images available, set width and height appropriately
    if ((main && first && !second) || (main && !first && second) || (!main && first && second)) {
      return {
        ...style,
        width: '90%',
        height: '130%',
        left : isMobile ? '10%' : '6%',
      };
    }
  
    // If all three images are available, set the container to auto width
    if (main && first && second) {
      return {
        
      };
    }
  
    // Default styling
    return style;
  };
  
  

  const DeleteButtonHeight = (imagesupdate)=>{
    const { main, first, second } = imagesupdate;
  
    // If there is only one image available, set height to 270px
    if ((main && !first && !second) || (!main && first && !second) || (!main && !first && second)) {
      return '120px';
    }
  
    // If there are two images available, set height to 220px
    if ((main && first && !second) || (main && !first && second) || (!main && first && second)) {
      return '90px';
    }
  
    // If all three images are available, set height to 200px
    if (main && first && second) {
      return '30px';
    }
  
    // Default height
    return 'auto';
  
  }

  useEffect(() => {
    ImageURL();
    UpdatedMedia();
    if (selectedImages && approvalstatus == "APPROVED") {
      handleNextClick();

    }
    if (selectedImages && approvalstatus !== "APPROVED") {
      handleNextClickRejectedPending();
    }

  }, [selectedImages]);

  return (



    <div>


      {/* <div className={picture.container}>
        <div>

          <p className={picture.componentname}>Your Profile</p>
        </div>
        <Image
          onClick={toggleInfoVisibility}
          style={{ cursor: 'pointer' }}
          width="24px"
          height="24px"
          src={questionmark}
        />
        <Container className={`${picture.whyInfo} ${showInfo ? picture.show : picture.hide}`}>
          <p>
            Please note that changes to your photos and written prompts will be reviewed by our admin team before going live. This process may take up to 48 hours, but you can continue using your account without any interruptions while we review & approve your updates.
          </p>
        </Container>
      </div> */}


    

      <div className={`${picture.gridContainer} ${picture[gridType]}`} >  {/* Dynamically apply gridType */}
        {/* Main Image */}
        <div className={picture.gridItem} style={{ backgroundImage: `url(${images2.main})` }}>
          <div className={picture.icons}>
            <span className={picture.iconLeft}>
              <Image src="" />
            </span>
            <span className={picture.iconRight}>
              <Image src={editicon} onClick={() => handleClick('main')} />
              <input
                type="file"
                ref={fileInputRefMain}
                onChange={(e) => handleFileChange(e, 'main')}
                style={{ display: 'none' }}
              />
            </span>
          </div>
          <div>
            {/* <p className={picture.pictype}>Main</p> */}
          </div>
        </div>

        {/* First Additional Image */}
        <div className={picture.gridItem} style={{ backgroundImage: `url(${images2.first})` }}>
          <div className={picture.icons}>
            <span className={picture.iconLeft}>
              <Image src="" />
            </span>
            <span className={picture.iconRight}>
              <Image src={editicon} onClick={() => handleClick('first')} />
              <input
                type="file"
                ref={fileInputRefFirst}
                onChange={(e) => handleFileChange(e, 'first')}
                style={{ display: 'none' }}
              />
            </span>
          </div>
        </div>

        {/* Second Additional Image */}
        <div className={picture.gridItem} style={{ backgroundImage: `url(${images2.second})` }}>
          <div className={picture.icons}>
            <span className={picture.iconLeft}>
              <Image src="" />
            </span>
            <span className={picture.iconRight}>
              <Image src={editicon} onClick={() => handleClick('second')} />
              <input
                type="file"
                ref={fileInputRefSecond}
                onChange={(e) => handleFileChange(e, 'second')}
                style={{ display: 'none' }}
              />
            </span>
          </div>
        </div>
      </div>



      <div >
        {
          imagesupdate.main || imagesupdate.first || imagesupdate.second ? (
            <div className={picture.underreview} style={{ marginTop: "40px", color: "#4E1173", fontSize: "16px", fontWeight: "600", textalign: "justify", marginBottom: "20px", padding: "25px", textAlign: "center" }}>
              <p>
                Thanks for updating your image! It's now under review by myTamilDate. You'll receive an update within 24 hours. We appreciate your patience!
              </p>
            </div>
          ) : ""
        }

        <div>

        </div>
        {imagesupdate.main || imagesupdate.first || imagesupdate.second ? (
        <div className={`${picture.gridContainer} ${picture[gridType]}`} >

          {imagesupdate.main && (
            <div className={picture.gridItem} style={{
               backgroundImage: `url(${imagesupdate.main})`,
               ...getGridItemStyle(imagesupdate),
               }}
            
            >
              {/* <Image   src={imagesupdate.main} /> */}
              <div className={picture.icons}>
                <span className={picture.iconLeft}>
                  <Image src="" />
                </span>
                <span className={picture.iconRight}>
                  <Image src="" onClick={() => handleClick('main')} />
                  <input
                    type="file"
                    ref={fileInputRefMain}
                    onChange={(e) => handleFileChange(e, 'main')}
                    style={{ display: 'none' }}
                  />
                </span>
              </div>
              {/* <div>
                <p className={picture.pictype}>Main</p>
              </div> */}
            </div>
          )}



          {imagesupdate.first && (
            <div className={picture.gridItem} style={{ 
              backgroundImage: `url(${imagesupdate.first})`,
              ...getGridItemStyle(imagesupdate),

              }}>

              <div className={picture.icons}>
                <span className={picture.iconLeft}>
                  <Image src="" />
                </span>
                <span className={picture.iconRight}>
                  <Image src="" />
                  <input
                    type="file"
                    ref={fileInputRefFirst}
                    onChange={(e) => handleFileChange(e, 'first')}
                    style={{ display: 'none' }}
                  />
                </span>
              </div>
            </div>
          )}

          {imagesupdate.second && (
            <div className={picture.gridItem} style={{
              ...getGridItemStyle(imagesupdate),
               backgroundImage: `url(${imagesupdate.second})`,
               }}>

              <div className={picture.icons}>
                <span className={picture.iconLeft}>
                  <Image src="" />
                </span>
                <span className={picture.iconRight}>
                  <Image src="" />
                  <input
                    type="file"
                    ref={fileInputRefSecond}
                    onChange={(e) => handleFileChange(e, 'second')}
                    style={{ display: 'none' }}
                  />
                </span>
              </div>
            </div>
          )}

        </div>
          ) : null}
      </div>
      <div>
  {imagesupdate.main || imagesupdate.first || imagesupdate.second ? (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        marginTop: DeleteButtonHeight(imagesupdate), 
        width: "100%",
        gap: "30px",
      }}
    >
      <button
        className="global-cancel-button"
        onClick={handleDeleteImages}
      >
        Delete
      </button>

      {/* Uncomment this button if needed */}
      {/* 
      <button 
        type="submit" 
        className="global-save-button" 
        onClick={() => navigate('/updateprofile')}
      >
        Save
      </button> 
      */}
    </div>
  ) : null}
</div>





      <Modal centered className="crop-modal" show={showCropModal} onHide={handleCropCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Crop your photo</Modal.Title>
        </Modal.Header>
        <Modal.Body className='crop-modal-body'>

          <ImageCrop url={imageToCrop} onCropComplete={onCropComplete} ref={childRef} handleCropSave={handleCropSave} />

        </Modal.Body>
        <Modal.Footer className='crop-modal-footer'>
          <button variant="secondary" className='crop-cancel-btn' onClick={handleCropCancel}>
            Cancel
          </button>
          <button variant="secondary" className='crop-save-btn' onClick={() => {
            childRef.current.handleSubmit();


          }}>
            Save
          </button>
        </Modal.Footer>
      </Modal>

    </div>


  );
};

export default EditPicture;
