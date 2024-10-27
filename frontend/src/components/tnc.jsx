import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import Container from 'react-bootstrap/Container';
import './tnc.module.css';
import { NavBar } from './nav';
import { Footer } from './footer';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
export const Tnc = () => {
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
            <Container fluid className='tnc-main' style={{
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
            color: "#3A3A3A"

            
        }}>Terms and Conditions</p>
    </div>
</div>

                {/* <span>Last revised on Feb. 4th, 2021.</span> */}
                <p>Welcome to myTamilDate! We’re thrilled you’ve joined and look forward to helping you find your special someone.</p>
                <p>TC Global Inc. (“MTD”, "we", "us", "our" or the “Company”) is a corporation formed pursuant to the Business Corporations Act R.S.O. 1990, CHAPTER B.16 in Ontario, Canada. In consideration for permitting your access to our online dating website, applications and online services and other good and valuable consideration, you agree as follows:</p>
                <p>These terms and conditions ("Terms") form a legally binding agreement which govern your access to and use of our website and online platform hosted at<a href="https://mytamildate.com/"> https://mytamildate.com/ </a>, collectively referred to in these Terms as the “MTD Platform”.</p>
                <p>These Terms have provisions which limit our liability and impose obligations on you, the user (“you” or your”). You must review these Terms carefully before using the MTD Platform.</p>
                <p>By using MTD Platform, you represent and warrant that (1) you have attained the legal age that is statutorily required under the laws of the country in which you reside to form a binding contract with us; (2) you have read and understand these Terms and agree to personally be bound by them; and (3) you consent to your personal data being collected, stored, processed or transferred in the manner provided for in these Terms and as per our Privacy Policy. Our Privacy Policy is available online for your review at https://mytamildate.com/Privacy and is incorporated by reference in these Terms.</p>

                <p>If you do not agree to be bound by these Terms or our Privacy Policy, you are not authorized to access or use the MTD Platform.</p>
                <h4>Amendments</h4>

                <p>As the MTD Platform continues to evolve, we may, at any time, revise these Terms and our policies by updating this page or the page hosting the relevant policy. The date of the last version of these Terms is posted above. As you are bound by these Terms each time you use the MTD Platform, you are responsible for periodically reviewing the amendments to these Terms and you are deemed to have accepted and agreed to such amendments by accessing and using the MTD Platform after such amendments have been posted. If you do not agree with the amendments, you shall immediately stop accessing the MTD Platform and terminate your account, subject to the terms provided for herein. We may also undertake to send you an email or display notice of any changes to the Terms or policies in your account.</p>
                <h4>Establishing an Account</h4>
                <p>
                    To use the MTD Platform you will be required to register an account (“Account”) and provide certain personal information as referenced in our Privacy Policy. We may also allow you to create an account via third party providers such as Facebook and others. If you elect to establish your account via a third party provider, you agree to permit us to collect the personal information such third party sends us to establish and maintain your account.</p>
                <p>Regardless of whether you pay for your Account or not, you agree that access to your Account constitutes good and valuable consideration in exchange for agreeing to these Terms, our Privacy Policy and all other documents and policies incorporated by reference.</p>
                <p>
                    While we may reject the creation of your Account for any reason, upon our approval to establish your Account, we grant you a non-transferable, non-exclusive license to access the MTD Platform in accordance with these Terms. However, we reserve the right to revoke that license and your access to the MTD Platform without justification or cause, at any time. We make no representations or warranties as to the ongoing availability of the MTD Platform, or your access to it.</p>
                <p>

                    In registering an Account, you agree to (1) provide true, accurate, current, and complete information about yourself as prompted by the MTD Platform registration form (the “Registration Data”); and (2) maintain and promptly update the Registration Data to keep it true, accurate, current, and complete. If you provide any information, including Registration Data, that is untrue, inaccurate, not current or incomplete, or MTD has reasonable grounds to suspect that such information is untrue, inaccurate, not current or incomplete, MTD has the right to suspend or terminate your Account and refuse any and all current or future use of the MTD Platform (or any portion thereof). We reserve the right to remove or reclaim any usernames at any time and for any reason, including but not limited to, claims by a third party that a username violates the third party’s rights. You agree not to create an Account or use the MTD Platform if you have been previously removed from the MTD Platform by us.</p>

                <h4>Account Types</h4>
                <p>

                    We offer both “Free Member” and Premium Member” accounts. Upon establishing your account, and subject to our account approval process, you will become a "Free Member". Free Members do not have access to all of the features associated with Premium Member accounts. For more details on the benefits of a Premium Member account, visit our website. Premium Members are required to pay a fee to access the additional account features.</p>
                <h4>Fees</h4>
                <p>Our fees for Premium Member accounts are displayed on the MTD Platform. By agreeing to these Terms, if you elect to establish a Premium Member account, you agree to pay all fees associated with or arising from your account, as referenced on the MTD Platform. Our fees are subject to change at any time. If you are an existing Premium Member, we will provide you with a minimum of seven (7) days’ notice of any such changes (via email and/or within your account) prior to your automatic renewal. You may elect to not renew your account after such changes have been communicated to you in accordance with the termination provisions of this agreement.</p>
                <p>You agree to pay any and all sales taxes, whether Canadian or foreign, applicable to this agreement or arising in any way from your account and access to and use of the MTD Platform.</p>
                <p>

                    Additional payment and renewal terms, including terms related to your account, may be specified on the MTD Platform. Those terms, as amended from time to time, are incorporated by reference and form part of this agreement.</p>


                <h4>Automatic Renewals</h4>


                <p>In order to provide continuous service, we automatically renew all paid Premium Member Accounts. Automatic renewals will be processes on or after the date your Premium Member subscription expires, at (1) the renewal rate and same duration specified to you at the time you purchased your Premium Member subscription; or (2) if our fees have changed, as communicated to you by email and/or within your account.</p>
                <p>We communicate renewal periods to you on the MTD Platform at the time you purchase your Premium Member account. Renewal periods are also displayed in the settings page of your account. By accepting these Terms, you agree that if you are a Premium Member, your account will automatically renew, as set out above, and your payment method will be billed accordingly.
                </p>
                <p>If you do not wish your Premium Member account to renew automatically, please follow the directions set out in your account. You agree that your payment method will be automatically billed unless you cancel your Premium Member account 24 hours before the automatic renewal date.</p>


                <h4>
                    Payment
                </h4>
                <p>
                    We facilitate payment on the MTD Platform using PayPal Canada Co. and their related entities (collectively “PayPal”). For more information on PayPal’s terms of service for Canadian users, <a href='https://www.paypal.com/ca/webapps/mpp/ua/useragreement-full'> visit https://www.paypal.com/ca/webapps/mpp/ua/useragreement-full</a>

                </p>
                <p>
                    To facilitate credit card payments, we may also use Stripe, Inc., Stripe Payments Canada, Ltd. and their related entities (collectively “Stripe”). For more information on Stripe’s terms of service, their Stripe Services Agreement and privacy policy,<a href='https://stripe.com/en-ca/ssa'>visit https://stripe.com/en-ca/ssa</a>  and <a href='https://stripe.com/en-ca/privacy'> visit https://stripe.com/en-ca/privacy.</a>
                </p>
                <h4>
                    Cancellation
                </h4>
                <p>

                    Whether you hold a Free Member or Premium Member account, you may cancel your account at any time. To cancel your Premium Member account and downgrade to a Free Member account, click the "cancel plan" button on your account page
                </p>
                <p>

                    Cancellation will be effective as of the next billing date as long as notice is given at least 24 hours prior to the end of the applicable period. If your usage of the MTD Platform is terminated, whether by us because of a breach of these Terms or by you or us for any other reason, any unused Premium Member account subscription time is automatically and immediately forfeited by you.
                </p>


                <h4>Refunds</h4>
                <p>The purchase of a Premium Member account subscription and any payment for the automatic renewals thereof are non-refundable.</p>
                <p>However, if you believe we charged you in error, contrary to these Terms, you must contact us within thirty (30) days of such charge and in our discretion, we may refund the payment.</p>

                <h4>Pricing Changes</h4>
                <p>You agree that we reserve the right to change our pricing at any time in our sole discretion. We will provide you with at least seven (7) days’ notice, either in your account or via email, of any such changes prior to your next billing cycle. We also reserve the right to change the method of payment which is acceptable to us, in our sole discretion.</p>

                <h4>Account Not Transferrable</h4>
                <p>Access to your Account is not transferrable and is only intended for you, the individual who established the account. As a result, you are not permitted to change the name associated with your account, if applicable.</p>

                <h4>Account Security</h4>
                <p>Upon setting up an account, you will be required to create a username and password. You are responsible for safeguarding the password you use to access the MTD Platform and you agree not to disclose your password to any third-party.</p>
                <p>You agree to use a unique password for your account which you do not use for any other online service. As we may send account activation notices, password reset notices and links to your email account and/or mobile phone number registered on the MTD Platform (1) you are responsible for ensuring that your email address and phone number provided to us are accurate; and (2) you represent and warrant to us, and agree that you will ensure, you are the sole person, at all times, with access to the email account registered in connection with your account.</p>
                <p>You agree you are responsible for any activity on your account and all correspondence provided to us from any email address or phone number used to register your account, whether or not you authorized that activity or correspondence. You agree that we are, in respect of any instructions or actions taken by a person using your account, entitled to assume that the person is you; the person whose name and/or personal information is registered or associated with the account.</p>
                <p>You must immediately notify us of any unauthorized use of your account.</p>
                <p>You must inform us of any changes to your contact details and other information provided to us, including, but not limited to, your email address and telephone number.</p>
                <p>While we and our third party software and technology providers take certain security measures in relation to the MTD Platform, you acknowledge that the technical processing and transmission of the MTD Platform and related data and information, including your own account data and information, is at risk of being hacked or stolen by third parties and will involve transmissions over various networks and devices, including networks and devices not owned or controlled by us. We rely on a number of third parties to make the MTD Platform available, including data and web hosting providers. You accept all such risks in using the MTD Platform and you agree and acknowledge that in using online platforms, there is always a risk of unauthorized access to and use of your information, including your personal information.</p>

                <h4>Acceptable Use of the MTD Platform</h4>
                <p>In using the MTD Platform, you agree, and you represent and warrant to us and all other users of the Platform, that you:</p>
                <ol>
                    <li>Will not post any e-mail addresses, personal website address or profile pages you may have on a third party website, or other contact information, anywhere on the MTD Platform or in any other communications you may have with other users. You may, at your discretion, exchange such information after you have unlocked the premium messaging feature;</li>
                    <li>Will not post pictures which do not accurately represent your true self;</li>
                    <li>Will not use the MTD Platform in a way that has any unlawful or fraudulent purpose or effect;</li>
                    <li>Will comply with all applicable laws, rules and regulations;</li>
                    <li>Will not use or disclose personally identifiable information belonging to others except (1) with their consent; and (2) in accordance with applicable privacy laws, rules and regulations;</li>
                    <li>Will not post or submit any photographs of another person without that person’s permission;</li>
                    <li>Will not upload, copy, distribute, share or otherwise use or generate data or content that is unlawful, obscene, defamatory, libelous, harmful, hateful, harassing, racist, bullying, sexual in nature, contains nudity, is threatening, racially or ethnically offensive or abusive, that would violate a third party’s rights (including their intellectual property rights), constitute or encourage a criminal offense or give rise to civil liability or damages;</li>
                    <li>Will not do anything that encourages, threatens or incites violence;</li>
                    <li>Will not register or hold an account on the MTD Platform if you have been convicted of sexual assault, stalking, sexual harassment or any crime that is sexual in nature;</li>
                    <li>Will not use the MTD Platform to stalk anyone;</li>
                    <li>Will not upload, transmit, disseminate, post, share, store, use any content, data or information, perform any services or do anything that infringes on, or contributes to any infringement of, any intellectual property rights; including copyright, trademark, patent or trade secret rights, whether of ours or any third party;</li>
                    <li>Will not spam, solicit money from or defraud other users;</li>
                    <li>Will not disclose your password or transfer your account to any third party, or allow any third party to access your account;</li>
                    <li>Will not impersonate any person or entity, or post any images of another person without his or her permission;</li>
                    <li>Will not upload, copy, distribute, share, create or otherwise use content, code or information that contains or embodies software viruses or any other malicious computer code that is designed to interrupt, undermine, destroy or limit the functionality of any computer software, hardware or communications equipment, or that is designed to perform functions on any software, hardware or equipment without the owner's express consent.</li>
                    <li>Will not mirror or frame the MTD Platform or any content thereon, place pop-up windows over its pages, or otherwise affect the display of its pages;</li>
                    <li>Will not use any trade name, trademark, or brand name of ours in metatags, keywords and/or hidden text;</li>
                    <li>Will not use any portion of MTD Platform or the content thereon in any manner that may give a false or misleading impression, attribution or statement as to us, the owner or any other third party;</li>
                    <li>Will not alter, remove or obscure any copyright notice, digital watermarks, proprietary legends or any other notice included on or produced in connection with the MTD Platform or our marketing materials;</li>
                    <li>Will not use any software bot or data scraping techniques that accesses the MTD Platform to scrape or pull data for any purpose, whether such data was displayed publicly or not;</li>
                    <li>Will not collect, harvest or store any personally identifiable information, including user account information, from us;</li>
                    <li>Will not translate, reverse engineer, decompile, disassemble, modify or create derivative works based on the MTD Platform and its underlying software code;</li>
                    <li>Will not undertake any action or omission that causes us or other users damage or loss;</li>
                    <li>Will not circumvent, disable, violate or otherwise interfere with any security related feature of the MTD Platform.</li>
                </ol>
                <p>We have adopted and implemented an internal policy that provides for the review and removal of prohibited content (and users who post prohibited content) from the MTD Platform which have been reported to us. If you believe that one or our users has uploaded or used prohibited content, please contact us at hello@myTamilDate.com.</p>
                <p>We may, but have no obligation to, remove you and other users from the MTD Platform if we determine, in our sole discretion, that you or they have, or reasonably appear to have, violated these Terms, whether the violation occurred on or off of the platform.</p>

                <h4>LICENSE & OWNERSHIP</h4>
                <h4>Proprietary Rights</h4>
                <p>The MTD Platform contains open source and public domain content, licenced content as well as proprietary content owned by us and by third parties. You are not permitted to copy, use or distribute any content (including but not limited to text, software code, images, designs, the look and feel of the MTD Platform, trade dress, trademarks, copyrighted works, illustrations, artwork, graphics, videos and audio) on the MTD Platform without the express consent of the owner.</p>
                <p>All rights, title and interest in and to the MTD Platform are and will remain the exclusive property of TC Global Inc. and our licensors.</p>
                <p>The MTD Platform and all content thereon are protected by copyright, trademark and other laws of Canada, the United States and foreign countries. You agree not to reproduce, modify or prepare derivative works, distribute, sell, transfer, publicly display, publicly perform, transmit, or otherwise use the MTD Platform or any content thereon, without our express written consent.</p>
                <p>You are not permitted to use any trademark or trade name of TC Global Inc., including our “myTamilDate” name or logo, without our express permission.</p>
                <p>We reserve all other rights not expressly granted in these Terms. Except as expressly provided herein, nothing on the MTD Platform will be construed as conferring any license to our and/or the applicable owner’s intellectual property rights, whether by estoppel, implication or otherwise. Notwithstanding anything herein to the contrary, we may revoke any of the foregoing rights and/or your access to MTD Platform, or any part thereof, at any time without prior notice and without liability to you or any third party.</p>

                <h4>Your Content</h4>
                <p>The MTD Platform permits you and other users the ability to upload and post content ("User Content"). While you own your User Content, you hereby grant us a non-exclusive, transferable, sub-licensable (including all moral rights), royalty-free, worldwide, perpetual license to use any of your User Content that you post or upload to the MTD Platform for any commercial and/or business purpose whatsoever, including but not limited to, facilitating the ordinary use of the platform.</p>
                <p>You represent and warrant that you own or have the necessary rights, consents and/or permissions to use and authorize us to use all such User Content as contemplated above.</p>
                <p>We do not pre-screen all User Content uploaded or posted to the MTD Platform by you or other users. However, we may remove your User Content in our sole and absolute discretion.</p>
                <p>You agree that you, not us, are responsible for all of your User Content that you make available on or in connection with the MTD Platform.</p>

                <h4>Copyright Notice</h4>
                <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on the MTD Platform, please notify us at hello@mytamildate.com. While we take no responsibility for any user who breaches your copyright or other intellectual property rights, we may, in our sole discretion and without liability, undertake to attempt to contact the infringer on your behalf and/or cancel the infringer's account.</p>

                <h4>Feedback</h4>
                <p>We do not consider proposals or ideas, including without limitation, ideas for new products, technologies, promotions, product names, product feedback and product improvements you provide us (“Feedback”) to be confidential information. If you send any Feedback to us, you acknowledge and agree that we shall not be under any obligation of confidentiality with respect to the Feedback. You agree that we may use, and nothing in these Terms limits or restricts our right to independently use, develop, evaluate, or market products or services, which incorporate your Feedback.</p>
                <p>You represent and warrant that you have all rights necessary to submit the Feedback. You hereby grant us a fully paid, royalty-free, perpetual, irrevocable, worldwide, non-exclusive, and fully sublicensable right and license to use, reproduce, perform, display, distribute, adapt, modify, re-format, create derivative works of, and otherwise commercially or non-commercially exploit in any manner, any and all Feedback, and to sublicense the foregoing rights, in connection with the operation and maintenance of the MTD Platform.</p>

                <h4>Your Responsibility for Your Actions</h4>
                <p>You are solely responsible for your interactions with other users of the MTD Platform and any other parties with whom you interact; provided, however, that we reserve the right, but have no obligation, to intercede in such disputes. Notwithstanding any other provision of these Terms, you agree that we will not be responsible for any liability incurred as a result of such interactions.</p>

                <h4>Acceptance of Risk and Disclaimers</h4>
                <p>The MTD Platform merely connects you with other users. You accept all risks associated with using the MTD Platform, including those arising from interacting with other users.</p>
                <p>We do not guarantee a successful match or compatibility with any other user of the MTD Platform.</p>
                <p>Our MTD Platform is provided "as is" without warranty of any kind, including but not limited to, all implied warranties and conditions of merchantability and fitness for a particular purpose. We hereby disclaim all warranties and conditions of any kind, whether express, implied or statutory.</p>
                <p>Without limiting any other section of these Terms, you agree that we shall not be responsible for any damages you suffer arising from the acts or omissions, including the negligent acts or omissions, of other users on the MTD Platform, our independent contractors, payment processors or third-party service providers.</p>
                <p>You agree that, while we strive to have the MTD Platform error free and uninterrupted, we do not guarantee the absence of errors or interruptions. You agree that we shall not be held liable for any damage such errors or interruptions may cause. We make no representations and grant no warranties as to the uptime of the MTD Platform.</p>
                <p>We may also perform scheduled maintenance which will result in the MTD Platform being unavailable for certain periods of time.</p>
                <p>While users are required to comply with these Terms, including the acceptable use terms listed above, we make no representations and grant no warranties that other users, who operate independently on the MTD Platform, have in fact or will in fact, comply with all such terms.</p>
                <p>In the ordinary course, we do not conduct criminal background checks or verify the identity of other users. Simply by virtue of another user being listed on our platform does not constitute our endorsement of that user.</p>
                <p>Notwithstanding the fact we do not, as a matter of course, conduct criminal background checks (and have no obligation to do so), you agree that we are permitted to use your personal information to conduct criminal background and any other similar or related searches (such as searches against public sex offender databases), should we deem it advisable to do so in certain circumstances.</p>
                <p>While other users of the MTD Platform provide information to us about themselves, we do not independently verify that information or take measures to confirm the identity of other users in all cases and as such, do not make any representation or warranty that any of the information provided about another user is true or accurate.</p>
                <p>You acknowledge and agree that we have no control over and do not guarantee the truth or accuracy of any user content.</p>
                <p>You agree that we shall not be obligated to and we accept no liability or responsibility for resolving or managing disputes which may arise between you and any other user. If you have a dispute with another user, it is your responsibility to take your own legal action against such user.</p>
                <p>You agree and acknowledge that there are potential risks, including but not limited to the risk of physical and emotional harm or distress, personal injury, theft of personal property and even death when you connect or interact with someone you meet through the MTD Platform. You assume all risks associated with interacting with other persons whom you meet, or, come in contact with as a result of using the MTD Platform, whether in person, online or offline, via telephone, text message or any other form of communication.</p>
                <p>You understand that the technical processing and transmission of the MTD Platform, and the data thereon, including your personal information and User Content may be transferred over and onto various networks and devices owned by us and third-party providers. While we and our service providers take measures to protect against such events, you agree and acknowledge that when providing personal or sensitive information online, there is always a risk of such information being hacked or stolen. You accept all risks arising therefrom.</p>

                <h4>Limitation of Our Liability</h4>
                <p>Aside from claims for direct amounts owing to you as a result of overpayments made to us or refunds we may owe you, you agree that, to the fullest extent permitted by law, in no event will we, our officers, directors, shareholders or employees, be liable to you for any direct, indirect, special, incidental, punitive, exemplary or consequential damages, howsoever caused, including by negligence or otherwise, regardless of legal theory and whether or not we have been warned of the possibility of such damages and whether those damages were foreseeable or not.</p>
                <p>If you are dissatisfied with the MTD Platform, or do not agree with any part of these Terms, or have any other dispute or claim with or against us, our officers, directors, shareholders or employees, then your sole and exclusive remedy is to discontinue accessing and using the MTD Platform.</p>
                <p>In addition to your agreement to not hold the above entities and persons liable for any damages, in the event a court or arbitrator of competent jurisdiction declines to uphold said clause, you agree that in no circumstances shall the aggregate liability for any and all claims relating to or in any way arising from the use of the MTD Platform, or in any way related to these Terms, be more than CAD $25.00.</p>
                <p>You agree and acknowledge that we would not enter into this agreement or grant access to the MTD Platform without these restrictions and limitations on our liability.</p>

                <h4>Indemnification</h4>
                <p>You agree to indemnify us, our employees, shareholders, directors and officers, and to defend and hold each of them harmless, from any and all claims and liabilities (including reasonable legal fees) which may arise from (i) your violation of these Terms or any policy incorporated by reference; (ii) your violation of any third-party right; (iii) any breach of a representation or warranty made by you to us, either in these Terms, privacy policy or otherwise; and (iv) any claim for damages suffered by another user of our service which you caused or contributed to.</p>

                <h4>Linked Sites</h4>
                <p>Whether or not we are affiliated with websites or third-party vendors that may be linked to the MTD Platform, you agree that we are not responsible for their content. Internet links found on the MTD Platform, whether posted by us or a third party, are not an endorsement and we do not represent or warrant the accuracy or truth of the contents, or endorse the products, services or information found on said websites. You access those links and corresponding websites at your own risk.</p>

                <h4>Law of the Contract (Governing Law) and Jurisdiction</h4>
                <p>These Terms, all documents incorporated by reference and your relationship with us shall be governed by, construed and enforced in accordance with the laws of the Province of Ontario, Canada (and any Canadian federal laws applicable therein), as it is applied to agreements entered into and to be performed entirely within such province.</p>
                <p>You hereby agree to irrevocably and unconditionally submit to the exclusive jurisdiction of the courts and tribunals of Ontario, Canada (including the Federal courts and tribunals as applicable therein) to settle any disputes arising out of or in any way related to these Terms, all documents incorporated by reference and your relationship with us.</p>

                <h4>Severability</h4>
                <p>If any provision of these Terms are found to be unlawful, void, or for any reason unenforceable, then that provision shall be deemed severable from this agreement and shall not affect the validity and enforceability of any remaining provisions.</p>

                <h4>No Construction Against Drafter</h4>
                <p>If an ambiguity or question of intent arises with respect to any provision of these Terms, the Terms shall be construed as if drafted jointly by the parties and no presumption or burden of proof will arise favouring or disfavouring either party by virtue of authorship of any of the provisions of these Terms.</p>

                <h4>Waiver of Class Proceedings and Trial By Jury</h4>
                <p>To the extent permitted by law, you hereby waive your right to participate in any class action lawsuits against us, our contractors, employees, shareholders, successors, assigns and directors. To the extent permitted by law, you further waive any right to a trial by jury, should such a right exist, in relation to any legal dispute connected to or in any way arising out of these Terms.</p>

                <h4>Incorporation by Reference</h4>
                <p>All policies referred to in these Terms or anywhere on the MTD Platform are hereby incorporated by reference, including but not limited to our Privacy Policy.</p>

                <h4>Termination</h4>
                <p>Though we would much rather you stay, you can stop using the MTD Platform at any time. Please contact us to learn more about terminating your account. Notwithstanding your decision to delete your account or no longer use the MTD Platform, you agree to pay all fees and taxes as set out in these Terms and as posted on our website and the MTD Platform.</p>
                <p>We also reserve the right to suspend your account or access to the TC Global at any time, with or without reason or cause, and with or without notice.</p>
                <p>The cancellation, suspension or termination of access to the MTD Platform shall not terminate this agreement. In particular, and without limiting the generality of the foregoing, any provision concerning the limitation of our liability, your indemnification obligations, intellectual property (including licenses to your User Content) settling disputes (including the jurisdiction and choice of law) shall remain binding.</p>

                <h4>Assignment of this Agreement</h4>
                <p>These Terms shall enure to the benefit of and is binding upon the parties and their respective successors and permitted assigns. You agree that we may assign this agreement to any successor or assignee, whether pursuant to the purchase of the MTD Platform (or any portion thereof) by a third party, the transfer of control of TC Global Inc. or otherwise.</p>

                <h4>Right to Seek Injunction</h4>
                <p>Violation of these Terms may cause us irreparable harm and, therefore, you agree that we will be entitled to seek extraordinary relief including, but not limited to, temporary restraining orders, preliminary injunctions and permanent injunctions without the necessity of posting a bond or other security, in addition to and without prejudice to any other rights or remedies that we may have for a breach of these Terms.</p>

                <h4>Waiver</h4>
                <p>Our failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.</p>

                <h4>New Features</h4>
                <p>Any new features that augment or enhance the current MTD Platform, including the release of new versions, new products or services, tools and resources, shall be subject to these Terms.</p>

                <h4>Disclosure and Other Communication</h4>
                <p>We reserve the right to send electronic mail to you, for the purpose of informing you of changes or additions to the MTD Platform, these Terms or our policies.</p>
                <p>We reserve the right to use (including to aggregate with other data) and disclose, for commercial purposes, information about your usage of the MTD Platform, your general biographical information, demographics and account data in forms that do not reveal your personal identity. See our Privacy Policy for details.</p>

                <p>If you have any questions, please do not hesitate to contact us at hello@myTamilDate.com.</p>














                {/* <Container className='tnc-checkbox-box'>
                    <input 
                        type="checkbox" 
                        id="agree" 
                        name="agree" 
                        onChange={handleCheckboxChange}
                        checked={isChecked}
                    />
                    <label htmlFor="agree">I accept the Terms and Conditions</label>
                </Container>



<Container  className='tnc-btn-box' ><Button className='tnc-btn' disabled={!isChecked}>OK</Button></Container> */}
            </Container>

            <Footer />
        </section>
    );
};