import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Image } from 'react-bootstrap';
import crousleone from '../../../../assets/images/crousleone.jpg';
import crousletwo from '../../../../assets/images/crousletwo.jpg';
import crouslethree from '../../../../assets/images/crouslethree.jpg';
import styles from './carousel.module.css';

const CarouselComponent = () => {
  return (
    <div className={styles.bigcontainer}>
    <div className={styles.carouselContainer} style={{
      marginInline: "auto",
      marginBlock: "1rem",
    }}>
      <Carousel interval={3000} pause="hover" indicators={true} controls={false}>
        <Carousel.Item>
      

          
          <Image src={crousleone}  className={styles.carouselImage} />
          <Carousel.Caption className={styles.carouselCaption}>
            <h5>Premium Membership Benefits</h5>
            <ul>
              <li>Send & receive unlimited messages</li>
              <li>See who liked you</li>
            </ul>
          </Carousel.Caption>
        
        </Carousel.Item>
        <Carousel.Item>
          <Image src={crousletwo}  className={styles.carouselImage} />
          <Carousel.Caption className={styles.carouselCaption}>
            <h5>Premium Membership Benefits</h5>
            <ul>
              <li>Send & receive special requests to members you haven’t matched with and stand out</li>
              <li>Undo matches you’ve passed on if you change your mind</li>
            </ul>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <Image src={crouslethree} className={styles.carouselImage} />
          <Carousel.Caption className={styles.carouselCaption}>
            <h5>Premium Membership Benefits</h5>
            <ul>
              <li>Access all premium filters to help you zone in on the exact matches you’re looking for</li>
            </ul>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
    </div>
  );
};

export default CarouselComponent;
