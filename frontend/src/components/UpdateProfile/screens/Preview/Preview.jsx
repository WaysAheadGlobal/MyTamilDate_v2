import React, { useEffect, useState } from 'react';
import prev from './Preview.module.css';
import { Carousel, Container } from 'react-bootstrap';
import profilepic from '../../../../assets/images/profilepic.png';
import Heightpre from '../../../../assets/images/Heightpre.png';

import educationpre from '../../../../assets/images/educationpre.png';
import Namaste from '../../../../assets/images/Namaste.png';
import languagepre from '../../../../assets/images/languagepre.png';
import Familypre from '../../../../assets/images/Familypre.png';


import { Image } from 'react-bootstrap';
import Sidebar from '../../../userflow/components/sidebar/sidebar';
import { useNavigate } from 'react-router-dom';
import Basics from '../../Components/mybasics/Basics';
import { API_URL } from '../../../../api';
import { useCookies } from '../../../../hooks/useCookies';
import ProfileDetailsPreview from './previewmain';

const Preview = () => {
  const [activeTab, setActiveTab] = useState('preview');
  const Navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(true);
  const [Profile, setProfileData] = useState({});
  const [language, setLanguage] = useState([]);
  const [quesAns, setQuestionAns] = useState([]);

  const { getCookie } = useCookies();
  const toggleInfoVisibility = () => {
    setShowInfo(!showInfo);
  };
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
            main: API_URL + "media/avatar/" + main.hash + "." + (main.extension === "png" ? "jpg" : main.extension),
            first: API_URL + "media/avatar/" + others[0].hash + "." + (others[0].extension === "png" ? "jpg" : others[0].extension),
            second: API_URL + "media/avatar/" + others[1].hash + "." + (others[1].extension === "png" ? "jpg" : others[1].extension),
          })

        }
        else {
          const others = data.filter(image => image.type === 2);
          const main = data.filter(image => image.type === 1)[0];
          console.log(others, main)
          setImages2({
            main: OldImageURL + "/" + id + "/avatar/" + main.hash + "-large" + "." + (main.extension === "png" ? "jpg" : main.extension),
            first: OldImageURL + "/" + id + "/photo/" + others[0].hash + "-large" + "." + (others[0].extension === "png" ? "jpg" : others[0].extension),
            second: OldImageURL + "/" + id + "/photo/" + others[1].hash + "-large" + "." + (others[1].extension === "png" ? "jpg" : others[1].extension),
          })
        }
      }
    } catch (error) {
      console.error('Error saving images:', error);
    }
  }


  const ProfileDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/customer/update/profileDetails`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getCookie('token')}`
          }
        }
      );
      const data = await response.json();

      if (response.ok) {
        setProfileData(data)
        console.log(data)
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const LanguageDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/customer/update/userlanguage`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getCookie('token')}`
          }
        }
      );
      const data = await response.json();

      if (response.ok) {
        setLanguage(data.selectedLanguages)
        console.log(data.selectedLanguages)
      }
    }
    catch (err) {
      console.log(err);
    }
  }
  const QuestionsAnswer = async () => {
    try {
      const response = await fetch(`${API_URL}/customer/update/questions`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getCookie('token')}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setQuestionAns(data);
        console.log(data);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();


    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };


  console.log(Profile.Personalities);
  const PersonalitiesArray = Profile.Personalities ? Profile.Personalities.split(',') : [];


  useEffect(() => {

    ProfileDetails();
    LanguageDetails();
    QuestionsAnswer();
    ImageURL();
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
        // padding: "2rem"
      }}>

        <div>
          <div className={prev.previewContainer} >

            {/* <div className={prev.carouselContainer}>
              <Carousel interval={3000} pause='hover' indicators={true} controls={false}>
                <Carousel.Item>
                  <Image src={images2.main} rounded className={prev.carouselImage} />
                </Carousel.Item>
                <Carousel.Item>
                  <Image src={images2.first} rounded className={prev.carouselImage} />
                </Carousel.Item>
                <Carousel.Item>
                  <Image src={images2.second} rounded className={prev.carouselImage} />
                </Carousel.Item>
              </Carousel>
            </div> */}

            <div>
              <div className={prev.editpreview}>
                <div
                  className={`${prev.tab} ${activeTab === 'edit' ? prev.active : ''}`}
                  onClick={() => Navigate("/updateprofile")}
                >
                  <p className={prev.editseditsection}>

                    Edit
                  </p>
                </div>
                <div
                  className={`${prev.tab} ${activeTab === 'preview' ? prev.active : ''}`}
                  onClick={() => Navigate("/preview")}
                >
                  <p className={prev.editseditsection}>

                    Preview
                  </p>
                </div>
              </div>
            </div>
       <div style={{marginTop : "10px"}}>

            <ProfileDetailsPreview/>
       </div>

            {/* <div className={prev.namelocation}>

              <p className={prev.name}>{Profile.Name} {Profile.Surname}</p>
              <p className={prev.location}>
                {Profile.Country}
              </p>
            </div> */}

            {/* <div style={{marginTop : "20px"}}>
            <p className={prev.name}>I get along best with people who</p>
            <p className={prev.location}>
            Can have a good laugh together and understand each other's humor
            </p>
           </div> */}

{/* 
            <div className={prev.basicsdetailscontainer}>

              <p className={prev.headingpre}>My Basics</p>
              <div className={prev.detailboxes} >
                <Basics icon={Heightpre} detail={Profile.Height} />
                <Basics icon={educationpre} detail={Profile.StudyField} />
                <Basics icon={Namaste} detail={Profile.Religion} />
                <Basics icon={languagepre} detail={language && language.length > 0 ? language.map((e, i) => (
                  <span key={i}>{e.name}</span>
                )) : "N/A"} />
                <Basics icon={Familypre} detail={Profile.WantChildren} />
              </div>
            </div> */}

{/* 
            <div className={prev.basicsdetailscontainer} >

              <p className={prev.headingpre}>About</p>
              {
                quesAns.length !== 0
                  ? quesAns.map((item, index) => (
                    <Container key={index} >
                      <p className={prev.name} style={{ marginTop: "15px", fontSize: "16px" }}>
                        {item.question}
                      </p>
                      <p className={prev.answerdetails}>
                        {item.answer}
                      </p>
                    </Container>
                  ))
                  : "Please Add Profile Answer"
              }
             
            </div> */}

            {/* <div className={prev.Personality}>
              <p className={prev.headingpre}>Personality</p>
              <div>

                <div style={{ margin: "auto" }}>


                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
                    {PersonalitiesArray.length > 0 ?
                      PersonalitiesArray.map((personality, index) => (
                        <div key={index} className={prev.Personalityactivist}>

                          <p className={prev.Personalitytext}>{personality}</p>
                        </div>
                      ))
                      : "No Personalities Added"
                    }

                  </div>
                </div>


              </div>
            </div> */}

            {/* <div className={prev.Personality}>
            <p className={prev.headingpre}>Interests</p>
            <div>

<div style={{margin : "auto" }}>


               <div style={{display : "flex", flexWrap : "wrap", gap : "10px", marginTop : "20px"}}>
              <div className={prev.Personalityactivist}>
                <p className={prev.Personalitytext}>Activist</p>
              </div>
              <div className={prev.Personalityactivist}>
                <p className={prev.Personalitytext}>Activist</p>
              </div>
              <div className={prev.Personalityactivist}>
                <p className={prev.Personalitytext}>Activist</p>
              </div>
              <div className={prev.Personalityactivist}>
                <p className={prev.Personalitytext}>Activist</p>
              </div>
              <div className={prev.Personalityactivist}>
                <p className={prev.Personalitytext}>Activist</p>
              </div>
              <div className={prev.Personalityactivist}>
                <p className={prev.Personalitytext}>Activist</p>
              </div>
              </div>
              </div>              
            </div>
            </div> */}

          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default Preview;
