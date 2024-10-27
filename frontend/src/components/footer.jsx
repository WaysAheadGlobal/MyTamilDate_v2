import 'bootstrap/dist/css/bootstrap.min.css';
import './footer.css';


import logo from "../assets/images/MTDlogo.png";
import lin from "../assets/images/lin.png";
import youtube from "../assets/images/youtube.png";
import tiktok from "../assets/images/tiktok.png";
import gram from "../assets/images/gram.png";
import logo2 from "../assets/images/logo2.png";
import { Link } from 'react-router-dom';
import { Container, Image, Form, Button } from 'react-bootstrap';




export const Footer = () => {


    return (
        <div>
            <div className='footer-main'>
                <div className="foot-content">
                    <div className="foot-logo-txt">
                        <Image src={logo2} className='foot-logo'></Image>
                        <p style={{
                            textAlign: 'left',
                        }}>myTamilDate (MTD) is a leading dating community for the global Tamil diaspora. Join today to find your special someone!</p>

                    </div>




                    <div className='flinks'>
                        {/* <span className="link-heading">Links</span> */}

                        <a href="/SuccessPage" className='linkf'>Success Stories </a>
                        <a href="https://tamilculture.com/user/mytamildatecom" className='linkf'> Blogs</a>
                        <a href="/aboutus" className='linkf'> About Us</a>
                        <a href="/GetInTouch" className='linkf'> Contact Us</a>



                    </div>
                    <div className='flinks'>

                        {/* <span className="link-heading">Links</span> */}

                        <a href="/FaqPage" className='linkf'> FAQs</a>
                        <a target="_blank" href="/Tnc" className='linkf'> Terms & Conditions </a>
                        <a href="/PrivacyPolicy" className='linkf'> Privacy Policy</a>


                    </div>

                    <div className='flinks'>
                        <span className="link-heading">Connect with us!</span>

                        <div className='social '>
                            <a href="http://www.youtube.com/@mytamildate1279" className='linkf'>
                                <Image className="socio" src={youtube}></Image>
                            </a>
                            <a href="https://www.instagram.com/mytamildate/" className='linkf'>
                                <Image className="socio" src={gram}></Image>
                            </a>
                            <a href="https://www.tiktok.com/@mytamildate?lang=en" className='linkf'>
                                <Image className="socio" src={tiktok}></Image>
                            </a>
                        </div>



                    </div>
                </div>
                <div className="copyrights">
                    <div className="copy-content">
                        <span className="copy-text">© 2024 myTamilDate | All Rights Reserved</span>



                    </div>

                </div>
            </div>
        </div>
    );
}