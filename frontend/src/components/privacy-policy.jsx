import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import Container from 'react-bootstrap/Container';
import './privacy-policy.module.css';
import { NavBar } from './nav';
import { Footer } from './footer';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
export const PrivacyPolicy = () => {
    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
const navigate = useNavigate();

    return (
        <section>
            <style>
                {`
                 p, h1, h4, ul, li {
                 margin-top: 1em;
                 text-align: justify;
                }
                `}
            </style>
            <NavBar />
            <Container fluid className='policy-main' style={{
                marginInline: 'auto',
                maxWidth: '1200px',
            }}>
                <div className='tadhaeding' style={{ display: "flex", flexWrap : "wrap-reverse", alignItems: 'center', justifyContent: "center", marginBottom: "60px" }}>
    <p style={{
      
        textAlign: 'left',
        marginTop: "40px",
        fontFamily: 'Poppins, sans-serif',
        fontSize: '22px',
        fontWeight: '600',
        lineHeight: '24px',
        letterSpacing: '0.02em',
        textAlign: 'left',
        color : "#5E5E5E"

        
    }} onClick={()=> navigate("/")}> &lt;&lt; Home</p>
    <div style={{ flexGrow: 2, textAlign: 'center' }}>
        <p className='termandconditions' style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '40px',
            fontWeight: '600',
            lineHeight: '60px',
            letterSpacing: '0.05em',
            textAlign: 'center',
            color: "#3A3A3A",
            

            
        }}>Privacy Policy</p>
    </div>
</div>
                {/* <span>Last revised on Feb. 4th, 2021.</span> */}
                <p>TC Global Inc. (“MTD”, "we", "us", "our" or the “Company”) is a corporation formed pursuant to the Business Corporations Act R.S.O. 1990, CHAPTER B.16 in Ontario, Canada. Further to our terms of use (https://mytamildate.com/TermsConditions) (the “Terms”), this Privacy Policy sets out how we collect, store and use personal information and cookies. Unless otherwise indicated, any capitalized terms in this Privacy Policy have the same meaning attributed to them in our Terms.</p>

                <p>By agreeing to our Terms or by using the MTD Platform, you consent to the collection and use of personal information in accordance with this Privacy Policy, which may update from time to time.</p>
                <p>If you believe that we have not adhered to this Privacy Policy or have any questions related to our privacy practices, please contact us at hello@mytamildate.com.</p>
                <h4>PART I: COLLECTION OF PERSONAL INFORMATION</h4>
                <p>The Personal Information of Other Individuals</p>
                <p>To the extent you provide us with, or upload data that includes the personal information of another individual, you represent and warrant that you have that individual’s consent to provide us with their information to use in accordance with this Privacy Policy and our Terms. If you do not have their consent, you agree not to upload or provide us with any such personal information.</p>
                <p>Your Personal Information</p>
                <p>

                    To establish an account with us and to use the MTD Platform, we will collect the following personal information:</p>
                <ul>
                    <li>First and last name:</li>
                    <li>Date of birth:</li>
                    <li>
                        Email address:</li>
                    <li>A username or nickname:</li>
                    <li>Phone number:</li>
                    <li>Your gender:</li>
                    <li>
                        City or town of residence</li>
                    <li>Profile and other photos (where you elect to upload them):</li>
                    <li>Internet Protocol (“IP”) address which may be associated with your location:</li>
                    <li>
                        Website statistics and analytics data regarding your use of the MTD Platform:</li>
                    <li>

                        Other types of raw data relating to how you interact with the MTD Platform, for example, your browser information and session duration:</li>
                    <li>Any other personal information you upload to the MTD Platform or otherwise voluntarily provide to us, including in your correspondence with us, profile set up, comments or messages on the MTD Platform.</li>
                </ul>

                <p>
                    Once you have registered an account, you will be given the option of creating a pseudonymous profile (i.e. a profile with just a username and personal description). You will be asked for some personal but non-identifying information to complete your profile. For example, you may be asked whether you have dependents, your height, race, religion, whether you smoke, etc. This information is not linked, in any way, to your personally identifiable information for other members to view publicly on the MTD Platform. However, if you elect to use your real name, or provide us with or otherwise upload or use a photograph or video on the MTD Platform, the information associated with your account will or may become personally identifiable information.
                </p>
                <p>

                    We also allow users to create an account via third party account login providers such as Facebook. If you elect to establish your account via a third party provider, you permit us to collect and use the personal information such third party sends us to establish and maintain your account. This may include your name, profile photo and other account information.</p>
                <h4>Payment Processing</h4>

                <p>If you become a paying member of the MTD Platform, we also collect credit card and payment information from you via a third-party payment processor. As of the last date this Privacy Policy was updated, we use PayPal Canada Co. and its subsidiaries or affiliates, with their privacy statement available at https://www.paypal.com/ca/webapps/mpp/ua/privacy-full?locale.x=en_CA#PayPal.</p>
                <p>Although we may display their forms on the MTD Platform (or webpages linked to the MTD Platform), when you provide your payment details, you are providing them to the applicable payment processor. You acknowledge that our third-party payment processors may have their own agreements which apply to you. While we will not have access to your entire credit card number, we will be able to bill your credit card and may have access to certain card and payment details such as the name on your card, billing address and card expiration date. If you have questions regarding our payment processor, please contact us.</p>

                <p>We may also use Stripe, Inc. to process certain credit and debit card payments from you along with their related and affiliated entities. Their privacy policy is available at https://stripe.com/en-ca/privacy.</p>


                <h4>PART II: THE USE OF PERSONAL INFORMATION</h4>

                <p>We do not sell personally identifying information, such as your name and contact information, to third-parties. However, we may use, store and share your personal information to:</p>
                <ul>
                    <li>Facilitate the ordinary operation of the MTD Platform, including establishing your account and connecting you with other users;</li>
                    <li>To send you SMS text messages to verify your account;</li>
                    <li>Verify your contact information and phone number;</li>
                    <li>Bill and collect money owed to us;</li>
                    <li>Provide user support and improve the MTD Platform;</li>
                    <li>Communicate with you about your account or services we offer;</li>
                    <li>Send you updates and notices of promotions (offered by us and third-party advertisers) and mailbox status reports. However, the MTD Platform provides you with the opportunity to opt-in and out of receiving different types of communications from us. You may modify your notice settings at any time by selecting "Preferences" from the member homepage;</li>
                    <li>Customize the layout of our the MTD Platform or the user experience for each individual member;</li>
                    <li>Contact you, at any time, to advise you of any updates that may impact you, such as the status of the MTD Platform, updates to our fees, the Terms or this Privacy Policy;</li>
                    <li>To block you from the MTD Platform if we have suspended or terminated your account. This includes blocking your IP address;</li>
                    <li>Pursue available legal remedies to us and to prosecute or defend a court, arbitration, or similar proceeding;</li>
                    <li>To meet legal requirements or seek legal advice from a lawyer in connection with your use of the MTD Platform;</li>
                    <li>To enforce compliance with our Terms and applicable laws, rules, and regulations.</li>
                </ul>


                <h4>Use of Personal Information for Criminal Background Checks</h4>

                <p>Notwithstanding the fact we do not, as a matter of course, conduct criminal background checks, you agree that we are permitted to use your personal information to conduct criminal background and any other similar or related searches (such as searches against public sex offender databases), should we deem it advisable to do so in certain circumstances and to confirm your compliance with our Terms.</p>

                <h4>Your Profile Picture and Other Images</h4>

                <p>Where you elect to upload a profile photo, it will be displayed publicly to other users.</p>
                <p>Although the MTD Platform may use various technologies to try to protect your pictures from being copied or captured by unauthorized third parties, please keep in mind that we cannot ensure complete protection or that other users or third parties will not download, copy or use your photos for alternative purposes. This includes the possibility that third party search engines, such as Google, may index and display your photos as part of Google Image search results.</p>
                <p>When we use your images on or in connection with the MTD Platform or our marketing materials, we may include our logo or other marks as a watermark on the image. The watermark is intended to serve as notice to third parties not to copy or use the images off of the MTD Platform. The presence of our watermark does not in any way imply copyright or other proprietary rights in and to the image by us and is merely provided to discourage the unauthorized use of the image. For details on content ownership and licensing, please see our Terms.</p>

                <h4>Your Account Messages and Communications with other Members</h4>

                <p>Our members communicate with each other through instant messages and onsite mail. We do not, as a general rule, moderate or monitor members' private communications. However, we reserve the right to do so if we reasonably suspect you, or another member who you have interacted with, have breached or intend to breach our Terms, including for example the provisions in our Terms under the heading “Acceptable Use of the MTD Platform”. For example, we may review communications between members if we reasonably suspect a user is under the age of 18, using the MTD Platform to harass someone or in a manner that is otherwise unlawful.</p>
                <p>Member submissions that appear on any public area of the MTD Platform may be moderated and, if necessary, we reserve the right to edit, delete, remove or not use any communication on a public area of the MTD Platform.</p>

                <h4>Use of Biographical and Similar Information</h4>

                <p>Biographical and similar information such as your age, race, gender, preferences, smoker/non-smoker, city or town or residence etc. are used to:</p>
                <ul>
                    <li>Personalize your experience;</li>
                    <li>Allow other members to find your profile through a search;</li>
                    <li>Compose your personal profile (which is associated with a pseudonymous account/user identity); and</li>
                    <li>Deliver targeted advertising and promotional offers to you from us and from external advertisers or partners.</li>
                </ul>

                <p>Additionally, we may use such information to identify other members of the MTD Platform that fit your search criteria or preferences and to contact you with the profiles of those members or to provide other members with your profile.</p>
                <p>We may use some of the non-personally identifying information we collect, in connection with your profile, for our own research purposes and with consultants and third party service providers or partners. We may also aggregate your information for general data analytics purposes to produce and share reports about the MTD Platform. For example, reports on where our users are based, how many users are male or female, how many are smokers or non-smokers etc. The reports will not include your username or name or be linked specifically to your account.</p>
                <p>You may elect to participate in community polls. The results of these polls are tracked by gender only and do not reveal any personal identifiable information linked to you.</p>

                <h4>PART III: THE DISCLOSURE OF PERSONAL INFORMATION</h4>

                <h4>Sharing Personal Information and Content if Required by Law</h4>

                <p>We may share personal information and any content collected, uploaded or provided to us if required by law, such as in response to a subpoena, court order or other legal process in any jurisdiction. If we are required by law to make any disclosure of your personal information or content, we may, but are not obligated to, provide you with written notice of such disclosure, if permitted by law.</p>

                <h4>Sharing Personal Information to Cooperate with Investigations and Law Enforcement</h4>

                <p>Absent a court order, subpoena or other legal requirement to disclose personal information or content in our possession or control, you agree that we may also share personal information and content you upload or which is associated with your account to cooperate with law enforcement authorities in the investigation of any criminal matter if we reasonably believe doing so is necessary or beneficial in protecting your safety, or the safety of any third-party.</p>

                <h4>Sharing Personal Information with Third-Party Providers</h4>

                <p>Our suppliers, partners, independent contractors (collectively “Third-Party Providers”) and/or employees, may have access to, or be shared personal information to use in connection with one or more of the purposes for which the information was collected.</p>
                <p>Our Third-Party Providers may have access to personal information in providing services to us, or providing you with access to the MTD Platform. We may use a variety of Third-Party Providers in order to host the MTD Platform, including for example, hosting servers which store personal information.</p>
                <p>As of the last revision date of this Privacy Policy, among others, we use the following Third-Party Providers who may have access to, or store your personal information, by virtue of our use of their services:</p>
                <ul>
                    <li>Our web hosting provider is DigitalOcean, LLC and their affiliates. For more information on their privacy practices please see <a href="https://www.digitalocean.com/legal/privacy-policy/">https://www.digitalocean.com/legal/privacy-policy/</a>.</li>
                    <li>Our online messaging technology provider is Pusher Ltd., company registered in England and Wales and their affiliated entities. For more information on their privacy practices please see <a href="https://pusher.com/legal/data-protection">https://pusher.com/legal/data-protection</a>.</li>
                    <li>Our bulk email provider is Twilio Inc., and their affiliated and related entities, who operate SendGrid. For more information on their privacy practices please see <a href="https://www.twilio.com/legal/privacy">https://www.twilio.com/legal/privacy</a>.</li>
                </ul>

                <p>We also use the following Third-Party Providers for data analytics in connection with your use of the MTD Platform, including:</p>
                <ul>
                    <li>Google LLC together with their affiliated entities worldwide, in order to use Google Analytics. For details, visit <a href="https://analytics.google.com/analytics/web/">https://analytics.google.com/analytics/web/</a>.</li>
                    <li>Facebook Pixel, offered by Facebook, Inc. and their affiliated and related entities, which provides us with analytics and insights regarding your use of our website. If you are a Facebook user, Facebook Pixel helps us target advertising to you via Facebook, Inc.’s platforms (Facebook and Instagram) based on the various pages you visit on our website. For more information about Facebook Pixel, see <a href="https://www.facebook.com/business/learn/facebook-ads-pixel">https://www.facebook.com/business/learn/facebook-ads-pixel</a>;</li>
                    <li>Hotjar Limited, a private limited liability company registered under the Laws of Malta in order to use their web analytics tools. Their privacy policy is available online at <a href="https://www.hotjar.com/legal/policies/privacy/">https://www.hotjar.com/legal/policies/privacy/</a>.</li>
                    <li>RAN Agency LLC, doing business as Ampry to use their on-site engagement tools. Their privacy policy is available online at <a href="https://app.ampry.com/landing/privacy">https://app.ampry.com/landing/privacy</a>.</li>
                </ul>

                <p>We may update the above list of Third-Party Providers from time-to-time as the MTD Platform continues to evolve. Third-Party Providers may have their own agreements and privacy policies on the collection and use of personal information which either we or you provide them.</p>

                <h4>Your Personal Information May Not Be Stored in Canada</h4>

                <p>As we may have servers, Third-Party Providers, employees and other parties we share your personal information with in locations both inside and outside of Canada, your personal information may become subject to foreign laws and foreign legal proceedings.</p>

                <h4>European General Data Protection Regulation</h4>

                <p>Our privacy practices intend to meet the requirements of the General Data Protection Regulation of the European Union (“GDPR”). As a company that may process the personal information of persons who reside in or who are citizens of the European Union (a “European person”), we have implemented technical and organizational measures to meet the GDPR’s requirements and protect the personal information of European persons. Our technical measures to protect personal information take into account current technology available and the costs of implementing that technology in addition to the nature, scope, context and purposes of the personal information collected and processed. If you have any questions about our technical and organizational measures to meet the GDPR requirements, please contact us.</p>
                <p>If you provide us with personal information from European persons, you represent and warrant to us that your personal information collection and storage procedures comply, at all times, with the GDPR. To the extent you provide us with, or, have our Website process any personal information of a European person, you further represent that you have obtained informed consent to transfer their information, internationally, to us. If such consent is subsequently revoked, you agree to inform us immediately. Provided we are a company registered and operating in Canada, you agree and acknowledge that your personal information will be accessed by us in Canada, although it may be stored with Third Party Providers in locations both in and outside of Canada.</p>

                <h4>Sharing Personal Information if Our Business, Website or Service is Acquired</h4>

                <p>We may share personal information with our successors (if our business or the MTD Platform are acquired by another legal entity) or any assignee of our assets relating to the MTD Platform. Disclosure in such circumstances is governed by the Personal Information Protection and Electronic Documents Act, SC 2000, c 5 in Canada.</p>

                <h4>Disclaimer and Warning About Sharing Personal Information Online</h4>

                <p>No method of transmission of data over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
                <p>YOU ACKNOWLEDGE THAT WHEN SHARING PERSONAL INFORMATION ONLINE, THERE IS ALWAYS A RISK OF DATA BREACHES, INCLUDING DATA BREACHES IN WHICH THIRD PARTIES UNLAWFULLY ACCESS OUR SYSTEMS, OR THE SYSTEMS OF OUR THIRD-PARTY PROVIDERS, WHICH STORE PERSONAL INFORMATION.</p>
                <p>WHILE WE TAKE MEASURES TO PROTECT PERSONAL INFORMATION, YOU AGREE THAT, TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL WE, OUR AFFILIATES, OFFICERS, DIRECTORS, SHAREHOLDERS, EMPLOYEES, CONTRACTORS, AGENTS, THIRD-PARTY PROVIDERS OR LICENSORS BE LIABLE, HOWSOEVER CAUSED, INCLUDING BY WAY OF NEGLIGENCE, FOR THE LOSS OR THEFT OF YOUR PERSONAL INFORMATION OR ANY DAMAGES CAUSED AS A RESULT THEREOF, SO LONG AS WE WERE NOT DIRECTLY AND GROSSLY NEGLIGENT IN THE PROTECTION OF SAID INFORMATION.</p>

                <h4>Retention of Your Personal Information</h4>

                <p>We keep your personal information for as long as it is required for the purpose for which it was collected. There is no single retention period applicable to the various types of personal information collected. The messages and your correspondence you send to other users will be kept in their accounts for them to see and access so long as they remain members on the MTD Platform.</p>

                <h4>PART IV: Our Use of Cookies</h4>

                <p>By using the MTD Platform, you consent to our use of cookies. This cookies policy explains what cookies are, how we use them and how Third-Party Providers may also use cookies on, or in connection with the MTD Platform.</p>

                <h4>What are Cookies?</h4>

                <p>Cookies are small text files sent to and automatically downloaded by your web browser (assuming you have cookies enabled) when you visit our Website. A cookie file is stored in your web browser and allows our Website and Third-Party Providers we use to recognize you, track your activity across our and other websites and is usually used in conjunction with logging your internet protocol (“IP”) address.</p>
                <p>Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your computer (in your browser files) or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.</p>

                <h4>Can you block the use of Cookies?</h4>

                <p>Most web browsers allow you to disable the use of cookies. However, our Website or certain components of our Website may not operate properly, and you may not be able to access and use our Website if you disable cookies.</p>

                <h4>Can you delete Cookies once downloaded?</h4>

                <p>Most web browsers also permit you to delete cookies. This is typically done via your web browser’s settings, which vary depending on which web browser you use. For details on managing cookies settings using:</p>
                <ul>
                    <li>Chrome - <a href="https://support.google.com/accounts/answer/32050">https://support.google.com/accounts/answer/32050</a>.</li>
                    <li>Firefox - <a href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored">https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored</a>.</li>
                    <li>Safari - <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac">https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac</a>.</li>
                    <li>For any other web browser, please visit your web browser's official web pages.</li>
                </ul>

                <h4>How we use Cookies</h4>

                <p>We may use third-party advertising companies to serve ads on our behalf. These companies may employ cookies and action tags (also known as single pixel gifs or web beacons) to measure advertising effectiveness. Any information that these third parties collect via cookies and action tags is completely anonymous.</p>
                <p>However, our use of cookies is primarily to analyze how you use the MTD Platform. For instance, which pages you visit most often. This helps us better understand your user experience and other statistic which we may use to provide a better user experience in future updates. For example, cookies are used in connection with our use of Google LLC’s Google Analytics. For more information on Google Analytics and how cookies are used by Google Analytics, see Google LLC’s information page at <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage">https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage</a>.</p>
                <p>We, or Third-Party Providers we use to enable cookies, may also use cookies on our Website to:</p>
                <ul>
                    <li>Remember choices you have made on the Website, such as your language of preference or region;</li>
                    <li>Translate text;</li>
                    <li>Remember your username; or</li>
                    <li>Target advertising or to customize advertising across various websites (not just our own) and make such advertisements more relevant to you.</li>
                </ul>























                {/* <Container className='policy-checkbox-box'>
                    <input 
                        type="checkbox" 
                        id="agree" 
                        name="agree" 
                        onChange={handleCheckboxChange}
                        checked={isChecked}
                    />
                    <label htmlFor="agree">I accept the Terms and Conditions</label>
                </Container>



<Container  className='policy-btn-box' ><Button className='policy-btn' disabled={!isChecked}>OK</Button></Container> */}
            </Container>

            <Footer />
        </section>
    );
}