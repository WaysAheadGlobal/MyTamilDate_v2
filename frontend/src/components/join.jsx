import 'bootstrap/dist/css/bootstrap.min.css';
import './join.css';
import { useNavigate } from 'react-router-dom';


export const Join = () => {
 const navigate = useNavigate();

    return (
        <div class="future-hero">
            <div className='future-header-text'>
                <div className='future-hero-text'>
                    <span className='future-first-line'>Meet Tamil singles from Canada, US, UK & more! ❤️</span>
                    {/* <span className='future-sec-line'>Meet Tamil singles from Canada, US, UK & more! ❤️
                         <br />We're responsible for countless marriages & relationships.</span> */}
                    <button varient="primary" className='future-get-started' onClick={()=> navigate("/signup")}>Join Today</button>
                </div>
            </div>

            {/* <div class="future-shade"></div> */}
        </div>
    );
}
