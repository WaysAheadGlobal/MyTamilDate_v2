import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import styles from './helpandsupport.module.css'; // Import the custom CSS as a module
import Sidebar from '../../../userflow/components/sidebar/sidebar';
import './helpsupport.css';
import backarrow from "../../../../assets/images/backarrow.jpg";
import { Image } from 'react-bootstrap';
import HelpSupportDetail from './itemdetails';

const HelpSupport = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleBack = () => {
        setSelectedItem(null);
    };

    const items = [
        {
            title: 'About myTamilDate',
            content: `
                What is myTamilDate?<br/><br/>
    <strong>myTamilDate.com</strong> has been the most trusted dating community for single Tamils around the world for close to a decade! We're the premiere dating platform for diaspora Tamils and have the largest membership base in Canada, USA, UK & more.<br/><br/>
    <strong>Proven Success:</strong> We've been helping single Tamils meet, date and marry for years. On their own terms & their own timelines.<br/><br/>
    <strong>Meaningful Connections:</strong> No mindless swiping! View a person's profile in detail before making a decision to match or not.<br/><br/>
    <strong>Trust & Authenticity:</strong> We manually verify every profile in addition to requiring phone verification.<br/><br/>
    <strong>Flexible Platform:</strong> We're built for mobile first and enhanced for desktop too! The best part? You don't have to download yet another app.<br/><br/>
    <strong>Safety & Protection:</strong> We have a track record for creating a safe and trusted community, including your experience on the platform & the protection of your personal data.<br/><br/>
    <strong>Personalized Service:</strong> We care about your dating life like a good friend would! Need help with your profile? Need messaging tips & date ideas? We've got you covered!<br/><br/>
            `,
        },
        {
            title: ' How myTamilDate different from other dating services?',
            content: `
                We're the only dating community catering specifically to Tamil singles in a relevant & meaningful way. We're inclusive, anti-casteist, anti-colourism and empower you to take control of your love life, when and how it suits you!
<br/><br/>
Dating helps you meet a life partner who shares similar values and interests - cultural background, religion and language also play a big role. If you've decided that you want to meet someone Tamil, you're most likely to have success here vs. anywhere else.

            `,
        },
        {
            title: 'Have people found love on myTamilDate?',
            content: `
                Absolutely! Countless Tamil singles have met, dated and married their soulmates through myTamilDate and continue to do so all the time. Here are some of their stories.
            `,
        },
        {
            title: 'Do I have to be Tamil to use myTamilDate?',
            content: `
                This is an inclusive community and everyone is welcome! myTamilDate.com makes it easy to meet Tamil singles specifically, since mainstream dating apps put everyone into a general Asian/Indian bucket. If you're looking to meet some awesome Tamil singles, this is the place to be!
            `,
        },
        {
            title: 'Is myTamilDate available in my country?',
            content: `
                You can access myTamilDate.com from anywhere in the world. Your country's local rules and laws around internet use and access will apply.
            `,
        },
        {
            title: 'How can I quickly access myTamilDate from my phone like I do with other apps?',
            content: `
                Android: How to add to Home Screen
<br/><br/>
Visit mytamildate.com in your browser.
<br/><br/>
In the browser bar, tap on the "home" icon with a plus (+) icon inside it.
<br/><br/>
A banner should appear on your device. Click on "Add to Home screen".
<br/><br/>
If you choose not to add it to your Home screen at this point, you can do so later using the Add to Home screen icon in the main Chrome menu.
<br/><br/>
Regardless of which browser you are using, when you choose to add the app to your Home screen, you'll see it appear along with a short title, in the same way that regular apps like Instagram do.
<br/><br/>
Tapping this icon will now launch the app fullscreen and give you the best user experience
<br/><br/>
<br/><br/>

Note: If your device does not block pop-ups, then you may be prompted by a pop-up banner instead asking you to "Add to Home screen". You must be in regular browsing mode and not private/incognito.

<br/><br/>
<br/><br/>
iOS: How to add to Home Screen
<br/><br/>
Visit mytamildate.com in your browser.
<br/><br/>
Within Safari, press the Share icon and then “Add to Home Screen.”
<br/><br/>
Tapping this icon will now launch the app fullscreen and give you the best user experience
            `,
        },
        {
            title: 'Share your success story.',
            content: `
                We love hearing about your success! Many couples have met and married through myTamilDate and some of them have taken advantage of the free photo/video shoot we offer myTamilDate couples. Are you interested? Please complete this form and we'll be in touch!
            `,
        },
        {
            title: 'How come I cannot message someone?',
            content: `
                Messaging is one of myTamilDate's Premium Membership benefits.
<br/><br/>
If you're already a premium member, there are a few reasons why you might not be able to message someone: you don't have a mutual match which opens up messaging or they've blocked you if you've already matched.
            `,
        },
        {
            title: 'How do I view who liked me?',
            content: `
                You can see who tapped heart (liked) your profile by clicking on the message icon at the bottom of your screen and clicking on the ‘Likes' tab. Seeing who liked you is available to Premium Members only. Upgrade your account now to unlock this feature.
            `,
        },
        {
            title: 'Why did one of my matches disappear?',
            content: `
                There could be various reasons for this: 1) The user might have paused or deleted their account Or 2) They have chosen to unmatch with you Or 3) They have blocked your profile
            `,
        },
        {
            title: 'How can I quickly access myTamilDate from my phone like I do with other apps?',
            content: `
                Android: How to add to Home Screen
<br/><br/>
Visit mytamildate.com in your browser.
<br/><br/>
In the browser bar, tap on the "home" icon with a plus (+) icon inside it.
<br/><br/>
A banner should appear on your device. Click on "Add to Home screen".
<br/><br/>
If you choose not to add it to your Home screen at this point, you can do so later using the Add to Home screen icon in the main Chrome menu.
<br/><br/>
Regardless of which browser you are using, when you choose to add the app to your Home screen, you'll see it appear along with a short title, in the same way that regular apps like Instagram do.
<br/><br/>
Tapping this icon will now launch the app fullscreen and give you the best user experience
<br/><br/>
<br/><br/>

Note: If your device does not block pop-ups, then you may be prompted by a pop-up banner instead asking you to "Add to Home screen". You must be in regular browsing mode and not private/incognito.
<br/><br/>

<br/><br/>
iOS: How to add to Home Screen
<br/><br/>
Visit mytamildate.com in your browser.
<br/><br/>
Within Safari, press the Share icon and then “Add to Home Screen.”
<br/><br/>
Tapping this icon will now launch the app fullscreen and give you the best user experience
            `,
        },
        {
            title: 'There are not enough people in my area.',
            content: `
                Our goal is to have a broad base of members from key countries with large Tamil communities and new members join daily, but in the meantime, we recommend giving someone from another location a chance. It has worked for others! Here's the story of a couple from Paris and Toronto who met on myTamilDate and got engaged.
            `,
        },
        {
            title: 'How do I edit my profile?',
            content: `
                Click on your profile icon at the bottom right hand of your screen on mobile (top left on desktop) > from here you can edit your prompts and other details
            `,
        },
        {
            title: 'I want to delete my account.',
            content: `
                You're in full control of your account! There are 2 ways you can handle this:
<br/><br/>
Just need a break from dating but have plans to come back? Pause your account. This will ensure that all of your details are saved, but your profile will be hidden and will not be visible to others until you unpause your account.
<br/><br/>
You have no plans to ever use your myTamilDate account in the future? Delete your account permanently. This will wipe out all of your details and you will no longer be able to recover your profile details or messages. If you choose to come back, you will need to register for a brand new account.
            `,
        },
        {
            title: 'What do I get with a Premium Membership?',
            content: `
                By becoming a Premium Member you will increase your chances of meeting that special someone dramatically. The following features are only available to myTamilDate's Premium Members:
<br/><br/>
Send & receive unlimited messages
<br/><br/>
See who liked you
<br/><br/>
Send & receive special requests to members you haven't matched with and stand out
<br/><br/>
Access all premium filters to help you zone in on the exact matches you're looking for
<br/><br/>
Undo matches you've passed on if you change your mind
            `,
        },
        {
            title: 'How can I upgrade my membership?',
            content: `
                There are various call-outs within myTamilDate to help make it easy for you to upgrade. One of those sections is your own profile page which you can access by clicking on your icon at the bottom right of your screen. You can also upgrade from this link.
            `,
        },
        {
            title: 'How can I pay for my Premium Membership?',
            content: `
              myTamilDate's platform uses Stripe's secure and globally trusted payment system to process all subscriptions. All major credit cards are accepted for payments.
            `,
        },
        {
            title: 'Can I give someone a premium membership to myTamilDate as a gift?',
            content: `
              For sure! Giving someone the gift of love is a thoughtful and unique gift! You can buy a myTamilDate gift certificate at www.tcmrkt.com.
            `,
        },
        {
            title: 'How can I cancel my Premium Membership subscription?',
            content: `
              Click on your profile icon at the bottom right hand of your screen on mobile (top left on desktop) > scroll to the bottom > select ‘Account Settings' > select ‘Membership' and follow the instructions found under ‘Cancel Membership'
            `,
        },
        {
            title: 'I canceled my membership, but was charged again anyway.',
            content: `
              Sometimes tech products can get buggy and are difficult to anticipate, but we'll always fix any errors that we're responsible for. Please submit a request here.
            `,
        },
        {
            title: 'I do like a refund.',
            content: `
              We like commitment and have a strict no refund policy, which we advise you of at the time of your Premium Membership subscription. We'll consider exceptions on a case by case basis. Please submit a request here.
            `,
        },
        {
            title: 'Contact us',
            content: `
              Have a question about myTamilDate? Contact us at <a href='hello@mytamildate.com' > hello@mytamildate.com</a> 
            `,
        },
        {
            title: 'Report Technical Issue',
            content: `
              Have any technical issues? Please fill in the following form:
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSeVNfwZVuDK0pnJHdd1Im4VZbasfCQFwZ5x4Sw0QrgAbLf0RQ/viewform?pli=1" target="_blank" rel="noopener noreferrer">
              Technical Issues Form
            </a>
            `,
        },
       


    ];

    if (selectedItem !== null) {
        return (
            <HelpSupportDetail
                title={items[selectedItem].title}
                content={items[selectedItem].content}
                onBack={handleBack}
            />
        );
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
                width: "-webkit-fill-available",
                padding: "2rem"
            }}>
                <div className={styles.helpSupportSection}>
                    <div className={styles.logoarrow}>
                        <Image src={backarrow} className={styles.backarrow} onClick={() => window.history.back()} alt="Back Arrow" />
                        <div className={styles.helpSupportTitle}>Help & Support</div>
                    </div>
                    <div className="accordion accordion-flush" id="accordionHelpSupport">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingOne">
                                <button style={{ width: "100%", borderRadius: "36px" }} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                    About myTamilDate
                                </button>
                            </h2>
                            <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionHelpSupport">
                                <div className="accordion-body">
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(0)}>What is myTamilDate?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(1)}>How's myTamilDate different from other dating services?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>

                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(2)}>Have people found love on myTamilDate?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(3)}>Do I have to be Tamil to use myTamilDate?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(4)}>Is myTamilDate available in my country?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingTwo">
                                <button style={{ width: "100%", borderRadius: "36px" }} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                    Getting Started
                                </button>
                            </h2>
                            <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionHelpSupport">
                                <div className="accordion-body">
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(5)}>How can I quickly access myTamilDate from my phone like I do with other apps?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingThree">
                                <button style={{ width: "100%", borderRadius: "36px" }} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                    Matching and Messaging
                                </button>
                            </h2>
                            <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionHelpSupport">
                                <div className="accordion-body" >
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(6)} >Share your success story.
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent}onClick={() => setSelectedItem(7)} >How come I can't message someone?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(8)}>How do I view who liked me?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(9)}>Why did one of my matches disappear?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingFour">
                                <button style={{ width: "100%", borderRadius: "36px" }} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                                    Browsing
                                </button>
                            </h2>
                            <div id="flush-collapseFour" className="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionHelpSupport">
                                <div className="accordion-body">
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(10)}>I keep seeing people I've x'd.
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(11)}>There aren't enough people in my area.
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingFive">
                                <button style={{ width: "100%", borderRadius: "36px" }} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseFive">
                                    Profile and Account Settings
                                </button>
                            </h2>
                            <div id="flush-collapseFive" className="accordion-collapse collapse" aria-labelledby="flush-headingFive" data-bs-parent="#accordionHelpSupport">
                                <div className="accordion-body">
                                    <div className={styles.accordionItemContent}  onClick={() => setSelectedItem(12)}>How do I edit my profile?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent}  onClick={() => setSelectedItem(13)}>I want to delete my account.
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingSix">
                                <button style={{ width: "100%", borderRadius: "36px" }} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseSix" aria-expanded="false" aria-controls="flush-collapseSix">
                                    Premium Memberships
                                </button>
                            </h2>
                            <div id="flush-collapseSix" className="accordion-collapse collapse" aria-labelledby="flush-headingSix" data-bs-parent="#accordionHelpSupport">
                                <div className="accordion-body">
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(14)}>What do I get with a Premium Membership?  <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(15)}>How can I upgrade my membership?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(16)}>How can I pay for my Premium Membership?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(17)}>Can I give someone a premium membership to myTamilDate as a gift?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(18)}>How can I cancel my Premium Membership subscription?
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(19)}>I canceled my membership, but was charged again anyway.
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(20)}>I'd like a refund.
                                    <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="flush-headingSeven">
                                <button style={{ width: "100%", borderRadius: "36px" }} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseSeven" aria-expanded="false" aria-controls="flush-collapseSeven">
                                    Get in touch
                                </button>
                            </h2>
                            <div id="flush-collapseSeven" className="accordion-collapse collapse" aria-labelledby="flush-headingSeven" data-bs-parent="#accordionHelpSupport">
                                <div className="accordion-body">
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(21)}>Contact us
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                    <div className={styles.accordionItemContent} onClick={() => setSelectedItem(22)}>Report Technical Issue
                                        <span style={{ display: "flex", justifyContent: "flex-end" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.33398 14.1654L12.5007 9.9987L8.33398 5.83203" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}

export default HelpSupport;
