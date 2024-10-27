import React, { useEffect, useState } from 'react';
import { div, Image, Modal, Nav } from 'react-bootstrap';
import edit from './edit.module.css';
import questionmark from '../../../../assets/images/questionmark.png';
import editicontwo from '../../../../assets/images/editicontwo.png';
import update from '../../../../assets/images/update.png';
import age from '../../../../assets/images/age.png';
import gender from '../../../../assets/images/gender.png';
import locationedit from '../../../../assets/images/locationedit.png';
import relisionedit from '../../../../assets/images/relisionedit.png';
import educationedit from '../../../../assets/images/educationedit.png';
import carear from '../../../../assets/images/carear.png';
import editlogo from "../../../../assets/images/editlogo.png";
import height from '../../../../assets/images/height.png';
import language from '../../../../assets/images/language.png';
import intersts from '../../../../assets/images/intersts.png';
import kids from '../../../../assets/images/kids.png';
import familplantwo from '../../../../assets/images/familplantwo.png';
import smoking from '../../../../assets/images/smoking.png';
import drinktwo from '../../../../assets/images/drinktwo.png';
import prefarance from '../../../../assets/images/prefarance.png';
import helpandsupport from '../../../../assets/images/helpandsupport.png';
import setting from '../../../../assets/images/setting.png';

import editcard from '../../Components/card/editcard';
import Carddetails from '../../Components/card/editcard';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../api';
import { useCookies } from '../../../../hooks/useCookies';
import EditPicture from '../PictureEdit/pictureedit';

const personalityArray = [
    'Activist', 'Affectionate', 'Foodie',
    'Creative', 'Fashionable', 'Playful',
    'Animal Lover', 'Confident', 'Charming'
  ];



const Edit = () => {
  const Navigate = useNavigate();
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const[Profile, setProfileData] = useState({});
  const[language, setLanguage] = useState([]);
  const[quesAns, setQuestionAns] = useState([]);
  const[expandsall,setexpandall] = useState(false);
  const [pathname, setPathname] = useState([]);
    const [Rejected, setRejected] = useState(false);
  const{getCookie} = useCookies();
  const toggleInfoVisibility = () => {
    setShowInfo(!showInfo);
  };

  function navigateTo(path) {
    if (Rejected) {
        setShowRejectedModal(true);
    } else {
        Navigate(path);
    }
}

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
        if (result.approval === "REJECTED") {
            setRejected(true);
        }
    })()
}, [pathname])



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

 const LanguageDetails = async()=>{
  try{
   const response = await fetch(`${API_URL}/customer/update/userlanguage`,
     {
       method : 'GET',
       headers: {
         'Authorization': `Bearer ${getCookie('token')}`
     }
   }
 );
 const data = await response.json();

 if(response.ok){
  setLanguage(data.selectedLanguages)
  console.log(data.selectedLanguages)
 }
  }
  catch(err){
   console.log(err);
  }
}
const QuestionsAnswer = async()=>{
  try{
   const response = await fetch(`${API_URL}/customer/update/questions`,
     {
       method : 'GET',
       headers: {
         'Authorization': `Bearer ${getCookie('token')}`
     }
   }
 );

 const data = await response.json();

 if(response.ok){
  setQuestionAns(data);
  console.log(data);
 }
  }
  catch(err){
   console.log(err);
  }
}

const calculateAge = (birthday) => {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // If the current month is before the birth month, or it's the birth month but the current day is before the birth day, subtract one year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const expandall = ()=>{
  setexpandall(!expandsall)
  // if(expandall){
  //   setexpandall(false)
  // }
  // setexpandall(true)
}
console.log(Profile.Personalities);
const PersonalitiesArray = Profile.Personalities ? Profile.Personalities.split(',') : [];


  useEffect(() => {
   
    ProfileDetails();
    LanguageDetails();
    QuestionsAnswer();
  }, []);

  return (
    <div style={{
      marginTop : "10px"
    }}>

      <EditPicture/>
      <div className={edit.aboutme}>
      <RejectModal show={showRejectedModal} setShow={setShowRejectedModal} />
        <div className='d-flex align-items-center'>
          <p>About me</p>
          <Image
            onClick={toggleInfoVisibility}
            style={{ marginLeft: '15px', cursor: 'pointer' }}
            width="24px"
            height="24px"
            src={questionmark}
          />
          <div className={`${edit.whyInfo} ${showInfo ? edit.show : edit.hide}`}>
            <p>
            Please note that changes to your photos and written prompts will be reviewed by our admin team before going live. This process may take up to 48 hours, but you can continue using your account without any interruptions while we review & approve your updates.
            </p>
          </div>
        </div>
        <div>
          <Image style={{ cursor: 'pointer' }}  onClick={ ()=> Navigate("/updateanswer")} src={editicontwo} />
        </div>
      </div>

        <div>
        {
   
   quesAns.map((item, index) => (
        <div key={index} className={edit.aboutdetails}>
            <p className={edit.aboutquestion}>
                {item.question}
            </p>
            <p className={edit.aboutanswer}>
                {item.answer}
            </p>
        </div>
    )) 
  }

      </div>

      <div className={edit.aboutme}>
        <div className='d-flex align-items-center'>
          <p>Personality</p>
        </div>
        <div>
          <Image style={{ cursor: 'pointer' }}  onClick={()=> Navigate("/personalityupdate")} src={editicontwo} />
        </div>
      </div>
      <div className={edit.personalityarray}>
      {PersonalitiesArray.length > 0 ? 
        PersonalitiesArray.map((personality, index) => (
          <div key={index} className={edit.tag}>
            {personality}
          </div>
        )) 
        : "No Personalities Added"
      }
    </div>

   {/* <button className={edit.upgradebutton}>Update <span><Image src={update}/></span> </button> */}

   <div>
   <div className='edittext-logo'>
                                <p className='textofedit'>Tap on each section to edit</p>
                                <div>
                                    <Image className='editlogo' src={editlogo} />
                                </div>
                            </div>
    <Link to = "/updateage">
   <Carddetails 
  icon={age} 
  title="Age" 
  detail={Profile.Birthday ? calculateAge(Profile.Birthday) : "N/A"} 
/>
</Link>
<Link to="/updategender">
  <Carddetails 
  icon={gender} 
  title="Gender" 
  detail={Profile.Gender === "Other" ? "Non-Binary" : (Profile.Gender || "N/A")} 
/>

</Link>
<Link to = "/wantgender">
  <Carddetails icon={gender }title="Interested in" detail={Profile.PreferredGender === "Other" ? "All" : (Profile.PreferredGender || "N/A")}  />
</Link>
  <Link to="/updatelocations">
  <Carddetails icon={locationedit }title="Location" detail={Profile.Country ? Profile.Country : "N/A" }  />
  </Link>
  <Link to = "/updatereligion">
  <Carddetails icon={relisionedit } title="Religion" detail={Profile.Religion ? Profile.Religion : "N/A"} />
  </Link>
  
  
   </div>

   <div>
    {
      
      !expandsall &&
   <button className={edit.upgradebutton} onClick={expandall}>Expand All <span style={{marginLeft : "10px"}}>
   {
    expandsall ?  <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5 6L6.5 1L1.5 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg> : <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L6 6L11 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

   }
  
  
    </span> </button>


}
   </div>
{
 expandsall ? 


   <div>
    <Link to = "/updateeducations">
  <Carddetails icon={educationedit }title="Education" detail={Profile.StudyField ? Profile.StudyField : "N/A"} />
  </Link>
    <Link to="/updatejob">
   <Carddetails icon={carear }title="Career" detail={Profile.JobTitle
 ? Profile.JobTitle
 : "N/A"} />
    </Link>
   <Link to = "/updateheight">
  <Carddetails icon={height }title="Height" detail={Profile.Height ? Profile.Height : "N/A"} />
   </Link>

   <Link to="/updatelanguage">

  <Carddetails 
  icon={intersts} 
  title="Language"
  detail={language?.map(e=> e.name).join(", ")??"N/A"}
/>
</Link>

   
  <Link to = "/updatekids">
  <Carddetails icon={kids }title="What about kids" detail={Profile.HaveChildren ? Profile.HaveChildren : "N/A"} />
  </Link>
  <Link to = "/updatefamilyplan">
  <Carddetails icon={familplantwo }title="Family plans" detail={Profile.WantChildren ? Profile.WantChildren : "N/A"} />
  </Link>
  <Link to = "/updatesmoke">
  <Carddetails icon={smoking }title="Do you smoke?" detail={Profile.Smoker ? Profile.Smoker : "N/A"}/>
  </Link>
  <Link to = "/updatedrink">
  <Carddetails icon={drinktwo }title="Do you drink" detail={Profile.Drinker ? Profile.Drinker : "N/A"} />
  </Link>

   </div>
:  ""
}

   <div>
    <div style={{display : "flex", marginTop : "20px", justifyContent : "space-between",gap : "5px" }}>
    <div className={edit.button} onClick={()=> navigateTo("/user/preferences")}>
        <img src={prefarance} alt="Preferences Icon" />
        Preferences
      </div>
      
      <div className={edit.button} width="150px" onClick={()=> Navigate("/helpsupport")}>
        <img src={helpandsupport} alt="Help Icon" />
        Help & Support
      </div>
    </div>
   <div className={edit.buttondiv}>
      <div className={edit.buttonlarge} onClick={()=> Navigate("/accoutsetting")}>
        <img src={setting} alt="Settings Icon" />
        Account settings
      </div>
    </div>
   </div>
    </div>
  );
};

export default Edit;


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