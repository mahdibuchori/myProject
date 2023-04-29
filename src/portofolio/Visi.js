import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export const Visi = () => {
  return (
    <section className="banner" id="visi">
        <Container>
          <Row className="aligh-items-center">
            <Col xs={12} md={6} xl={5}>
                <h1><u><span className='wrap'>Visi</span></u></h1>
                <br/>
                <p>Perusahaan mempunyai visi membangun dan menciptakan produk berkualitas dengan metode kreatif dan inovatif yang mengikuti perkembangan industri makanan siap saji dan teknologi, melalui proses produksi dan distribusi yang handal dengan memberikan solusi yang terbaik.</p>
                <p>Visi kami adalah menjamin agar para pelanggan benar- benar merupakan aset bagi perusahaan, yang memberikan nilai strategis bagi perusahaan.</p>
                
            </Col>
            <Col xs={12} md={6} xl={7}>
              <img 
              src= 'https://img.freepik.com/free-vector/team-leader-teamwork-concept_74855-6671.jpg?w=900&t=st=1648709764~exp=1648710364~hmac=dfe5eb2b8434ad7f9d830fc646f750e63bf1ee599cef4f24adf1e70485bc0785' 
              alt='visi img'
              className='imgFil'
              />
            </Col>
            
          </Row>
        </Container>
    </section>
  )
}
