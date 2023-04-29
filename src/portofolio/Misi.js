import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export const Misi = () => {
  return (
    <section className="banner" id="misi">
        <Container>
          <Row className="aligh-items-center">
            <Col xs={12} md={6} xl={7}>
              <img src= 'https://img.freepik.com/free-vector/concentration-focus-business-goal-target-business-goal-solution-concept_1150-52732.jpg?w=1060&t=st=1648709829~exp=1648710429~hmac=655901fac4c1e5211d61b2d1fd14d9cf1b12cacae1d8415acafbe80296484bd9'
              alt='misi img' 
              className='imgFil'
            />
            </Col>
            <Col xs={12} md={6} xl={5}>
                <h1><u><span className='wrap'>Misi</span></u></h1>
                <br/>
                <p>Kepedulian dan komitmen yang tinggi terhadap pelanggan dengan memberikan pelayanan responsif untuk memenuhi kebutuhan pelanggan. Mengembangkan sumber daya manusia berkreatifitas tinggi dengan ide-ide inovatif untuk menghasilkan produk yang bermutu tinggi.</p>
                <p>Kepedulian dan komitmen yang tinggi terhadap pelanggan dengan memberikan pelayanan responsif untuk memenuhi kebutuhan pelanggan. Mengembangkan sumber daya manusia berkreatifitas tinggi dengan ide-ide inovatif untuk menghasilkan produk yang bermutu tinggi.</p>
                
            </Col>
          </Row>
        </Container>
    </section>
  )
}
