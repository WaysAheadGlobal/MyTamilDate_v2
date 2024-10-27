import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import Container from 'react-bootstrap/Container';
import './faq-pg.css';
import { NavBar } from './nav';
import { Footer } from './footer';

export const FaqPage = () => {
    const faqs = [
        {
            question: "I haven't received my activation e-mail, what's going on?",
            answer: `
                Sometimes our e-mails might incorrectly get placed in your junk folder. Have a look there and be sure to add us to your safe list. If you still don't see our e-mail, give us a shout at support@mytamildate.com and we'll be happy to look into it.

                In case you still did not receive your activation email, follow these steps:
                1. Click the login button on the top-right of the site.
                2. Enter the email and password which you had provided during the signup process.
                3. You will then get a message that you have not activated your account and there will be a button to re-send the activation email. You need to click on this button.
                4. An email will be sent to you. You need to check your spam/junk folder as well. It should be there, then click on the link. This will then activate your account.

                If you're having trouble, please first try the following:
                1. The site is best optimized for Chrome, Safari and Firefox.
                2. Clear your cache.
                3. Try using the latest version of your browser.
            `
        },
        {
          question: "I've signed up as a paid member but my profile is still classified under the 'free plan' so I can't enjoy the benefits of being a paid member. What can I do?",
          answer: "Clearing the cache in your browser, closing your browser and then re-opening it usually does the trick. If you are still having issues, please email support@mytamildate.com with your username and email."
      },
      {
          question: "There are so many dating sites out there, why create another one?",
          answer: "There are others, but none like us! Dating is about finding someone who has similar hobbies and interests but cultural background, religion and language also factor in. If you've decided that you want to date someone Tamil online, you're most likely to have success here vs. anywhere else."
      },
      {
          question: "Do I have to pay to use this site?",
          answer: "We want to make sure you get top-notch service and features, which continue to improve. To do this, we offer some affordable paid membership plans which help us maintain the site."
      },
      {
          question: "Once I'm a member, do all members have access to my profile?",
          answer: "No. Only people who match your preferences will have access. For example, if you're a female looking to meet males, you can only view our male members—you cannot view other female members."
      },
      {
          question: "How do I make sure I meet someone special?",
          answer: `
              There's no perfect formula or guarantee, but here are some tips from people who have had success with online dating:
              1. Be yourself. Things like representing your true self in your profile, uploading an up-to-date picture of yourself and highlighting things that are important to you really help with online dating.
              2. Be open-minded. You might be surprised at how well you could connect with someone who's not your usual 'type'. You might want to give someone different a chance!
              3. Be patient. Love takes time—and we think it's worth the wait. You might not meet that perfect someone on your first date, but don't be too hard on yourself. Meet people, have fun and be open to possibilities!
          `
      },
      {
          question: "Do I have to be Tamil to use this site?",
          answer: "Nope. myTamilDate.com makes it easy to meet Tamil singles. If you're looking to meet some awesome Tamil singles, this is the place to be!"
      },
      {
          question: "Is it safe to date online?",
          answer: "Online dating can be a cheaper (Going out to meet singles in major cities can be super pricey!), convenient, and more effective way to meet singles. That said, you should still exercise caution as you would with offline dating."
      }
        // Other FAQs...
    ];

    const [answersVisible, setAnswersVisible] = useState(new Array(faqs.length).fill(false));

    const toggleAnswer = (index) => {
        setAnswersVisible(prevState => {
            const newState = new Array(faqs.length).fill(false);
            newState[index] = !prevState[index];
            return newState;
        });
    };

    const renderAnswer = (answer) => {
        const lines = answer.trim().split('\n').map(line => line.trim());
        const elements = [];
        let inList = false;
        let listItems = [];

        lines.forEach((line, index) => {
            if (line.match(/^\d+\./)) {
                if (!inList) {
                    inList = true;
                }
                listItems.push(<li key={index}>{line.substring(line.indexOf('.') + 1).trim()}</li>);
            } else {
                if (inList) {
                    elements.push(<ol key={elements.length}>{listItems}</ol>);
                    listItems = [];
                    inList = false;
                }
                elements.push(<p key={elements.length}>{line}</p>);
            }
        });

        if (inList) {
            elements.push(<ol key={elements.length}>{listItems}</ol>);
        }

        return elements;
    };

    return (
        <>
            <NavBar />
            <Container fluid className='main-faq'>
                <div className="faq-container">
                    <div className='faq-title'>
                        <div className='faq-title-text'>Frequently Asked Questions</div>
                    </div>
                    {faqs.map((faq, index) => (
                        <div className="faq-content" onClick={() => toggleAnswer(index)} key={index}>
                            <div className={`faq-question ${answersVisible[index] ? 'answer-visible' : ''}`}>
                                <div className="question-text">
                                    {faq.question}
                                </div>
                                <button className="toggle-button" >
                                    <IoIosArrowDown />
                                </button>
                            </div>
                            {answersVisible[index] && (
                                <div className={`answer-text ${answersVisible[index] ? 'answer-visible' : ''}`}>
                                    {renderAnswer(faq.answer)}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className='faq-last-lines'>
                        <p>To cancel the subscription please contact the support team.</p>
                        <span>Have more questions for us?<br /> Feel Free To Reach Out To Us At <a style={{ fontFamily: '"Inter"', fontSize: '20px', fontWeight: '500', lineHeight: '34px', textAlign: 'left', color: '#F76A7B' }}>info@myTamilDate.com</a></span>
                    </div>
                </div>
            </Container>
            <Footer />
        </>
    );
};
