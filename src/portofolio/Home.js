import React, { useEffect } from 'react';
import {useState} from 'react';
import { Col, Container, Row, Carousel } from 'react-bootstrap';
import Nagget from '../assets/img/ngt.png';
import Smoked from '../assets/img/smkd.png';
import SosBak from '../assets/img/ssb.png';
import SosMer from '../assets/img/ssm.png';

export const Home = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [setIndex] = useState(1);
  const toRotate = [ "GOOD FOOD GOOD TASTE" ];
  const period = 2000;
  
  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);
  
    return () => { clearInterval(ticker) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])
  
  const tick = () => {
      
      let i = loopNum % toRotate.length;
      let fullText = toRotate[i];
      let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);
  
      setText(updatedText);
  
      if (isDeleting) {
        setDelta(prevDelta => prevDelta / 2);
      }
  
      if (!isDeleting && updatedText === fullText) {
        setIsDeleting(true);
        setIndex(prevIndex => prevIndex - 1);
        setDelta(period);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setIndex(1);
        setDelta(500);
      } else {
        setIndex(prevIndex => prevIndex + 1);
      }
  }
  
  return (
    <section className="banner" id="home">
        <Container>
          <Row className="aligh-items-center">
            <Col xs={12} md={6} xl={7}>
              <Carousel>
                <Carousel.Item interval={1000}>
                  <img
                    className="d-block w-100"
                    src={SosBak}
                    alt="First slide"
                  />
                </Carousel.Item>
                <Carousel.Item interval={500}>
                  <img
                    className="d-block w-100"
                    src={Smoked}
                    alt="Second slide"
                  />
                </Carousel.Item>
                <Carousel.Item interval={500}>
                  <img
                    className="d-block w-100"
                    src={SosMer}
                    alt="Third slide"
                  />
                </Carousel.Item>
                <Carousel.Item interval={500}>
                  <img
                    className="d-block w-100"
                    src={Nagget}
                    alt="Four slide"
                  />
                </Carousel.Item>
              </Carousel>
            </Col>
            <Col xs={12} md={6} xl={5}>
                <h1 className='testCoba'><u><span className='wrap'>{text}</span></u></h1>
                <br/>
                <p>Produk kami terbuat dari bahan-bahan yang aman dan Halal.</p>
                <p>Mengandung bahan-bahan :</p>
                <p>Daging sapi, Daging Ayam, Soya Protein, Gandum, Whey, Peanut dan lain-lain. Diproses dengan kualitas dan mutu terjamin</p>
                
            </Col>
          </Row>
        </Container>
    </section>
  )
}
