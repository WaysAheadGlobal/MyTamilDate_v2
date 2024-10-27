import React, { useEffect, useState } from 'react';
import { Container, Image } from 'react-bootstrap';
import Sidebar from '../../userflow/components/sidebar/sidebar';
import profile from './updateprofile.module.css'; 
import ProgressCircle from '../../ProgressCircle';
import ProfileProgress from './ProfileCompletations/ProgressProfile';
import editicon from '../../../assets/images/editicon.png';
import questionmark from '../../../assets/images/questionmark.png';
import Edit from './Edit/Edit';
import Preview from './Preview/Preview';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../api';
import { useCookies } from '../../../hooks/useCookies';
const UpdateProfile = () => {
  const [activeTab, setActiveTab] = useState('edit');
  const[profileCompletion, setProfileCompletion] = useState(10)
  const[Profile, setProfileData] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const toggleInfoVisibility = () => {
    setShowInfo(!showInfo);
  };

  const{getCookie} = useCookies();
const Navigate = useNavigate();
  const completion = 40;
  const id = getCookie('userId')
  const OldImageURL = 'https://data.mytamildate.com/storage/public/uploads/user';
  const [images, setImages] = useState({
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
        else{
          const others = data.filter(image => image.type === 2);
          const main = data.filter(image => image.type === 1)[0];
          console.log(others, main)
          setImages2({
            main: OldImageURL +"/" + id + "/avatar/"+ main.hash + "-large" + "." + main.extension,
            first: OldImageURL +"/" + id + "/photo/"+ others[0].hash + "-large" + "." + main.extension,
            second: OldImageURL +"/" + id + "/photo/"+ others[1].hash  + "-large"+ "." + main.extension,
          })

          console.log({
            main: OldImageURL +"/" + id + "/avatar/"+ main.hash + "-large" + "." + main.extension,
            first: OldImageURL +"/" + id + "/photo/"+ others[0].hash + "-large" + "." + main.extension,
            second: OldImageURL +"/" + id + "/photo/"+ others[1].hash  + "-large"+ "." + main.extension,
          })
    
        }

      }
    } catch (error) {
      console.error('Error saving images:', error);
    }
  }

  const GetprofileCompletion = async()=>{
     try{
      const response = await fetch(`${API_URL}/customer/update/profileCompletion`,
        {
          method : 'GET',
          headers: {
            'Authorization': `Bearer ${getCookie('token')}`
        }
      }
    );
    const data = await response.json();

    if(response.ok){
      setProfileCompletion(data.completionPercentage);
      console.log(profileCompletion);
    }
     }
     catch(err){
      console.log(err);
     }
  }

  const ProfileDetails = async()=>{
    try{
     const response = await fetch(`${API_URL}/customer/update/profileDetails`,
       {
         method : 'GET',
         headers: {
           'Authorization': `Bearer ${getCookie('token')}`
       }
     }
   );
   const data = await response.json();

   if(response.ok){
    setProfileData(data)
    console.log(data)
   }
    }
    catch(err){
     console.log(err);
    }
 }

  useEffect(() => {
    ImageURL();
    GetprofileCompletion();
    ProfileDetails();
  }, []);
  
  return (
    <Sidebar>
      <div style={{
        flex: "1",
        marginInline: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        overflowY: "auto",
        // padding : "2rem",
        padding : "16px",
        height: "calc(100vh - 64px)",
        width : "100%"
      }}>
        <div >
          
        <div style={{
          display : "flex",
          alignItems : "center",
          justifyContent : "center",
          gap : "10px"
        }} >
        <div>

          <p className={profile.componentname}>My Profile</p>
        </div>
        <Image
          onClick={toggleInfoVisibility}
          style={{ cursor: 'pointer' }}
          width="24px"
          height="24px"
          src={questionmark}
        />
        <Container className={`${profile.whyInfo} ${showInfo ? profile.show : profile.hide}`} >
          <p>
            Please note that changes to your photos and written prompts will be reviewed by our admin team before going live. This process may take up to 48 hours, but you can continue using your account without any interruptions while we review & approve your updates.
          </p>
        </Container>
      </div>
          <div className=" row d-flex justify-content-center">
            {/* <div className="d-flex flex-column align-items-center">
              <p style={{ fontSize: '18px', color: "#515151" }}>{Profile.Name}</p>
              <p style={{ fontSize: '16px', color: "#6C6C6C" }}>  {profileCompletion}% complete</p>
            </div> */}

            <div className={profile.editpreview}>
              <div
                className={`${profile.tab} ${activeTab === 'edit' ? profile.active : ''}`}
                onClick={() => setActiveTab('edit')}
              >
              <p className={profile.editseditsection}>

                Edit
              </p>
              </div>
              <div
                className={`${profile.tab} ${activeTab === 'preview' ? profile.active : ''}`}
                onClick={() => Navigate("/preview")}
              >
                <p  className={profile.editseditsection}>

                Preview
                </p>
              </div>
            </div>

            <div>
             <Edit/>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default UpdateProfile;
