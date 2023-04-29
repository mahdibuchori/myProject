import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Endura from '../assets/img/endur.png';
import Yona from '../assets/img/yona.png';
import Pedan from '../assets/img/pedan.png';
import Hemato from '../assets/img/hemato.png'

export const Brand = () => {
  return (
    <section className="banner" id="barnd">
        <Container>
          <div style={{textAlign: 'center'}}>
            <h2>MEREK / BRAND</h2>
            <h3>Produk Kami</h3>
            <p>Merek/brand produk kami sudah sangat dikenal oleh masyarakat umum, baik level premium maupun level menengah dan bawah</p>
            <br />
            </div>  
          <Row xs={1} md={4} className="g-4">
            <Col>
              <div class="shadow-sm p-3 mb-5 bg-body rounded">
                <img src={Endura} alt='Endura'/>
              </div>
            </Col>

            <Col>
              <div class="shadow-sm p-3 mb-5 bg-body rounded">
                <img src={Yona} alt='Yona'/>
              </div>
            </Col>

            <Col>
              <div class="shadow-sm p-3 mb-5 bg-body rounded">
                <img src={Pedan} alt='Pedan'/>
              </div>
            </Col>

            <Col>
              <div class="shadow-sm p-3 mb-5 bg-body rounded">
                <img src={Hemato} alt='Hemato'/>
              </div>
            </Col>
            
          </Row>
        </Container>
    </section>
  )
}
