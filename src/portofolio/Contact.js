import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

export const Contact = () => {
  return (
    <section className="banner" id="contact" style={{backgroundColor: "#77ACF1"}}>
      <Container>
        <Row xs={1} md={3} className="g-8">
          <Col>
            <h3>OFFICE</h3>
            <br />
            <p>
              Perkantoran Grand Wijaya Center Jl. Wijaya 2 Blok F - 83B Kebayoran Baru Jakarta 12160
            </p>
          </Col>
          <Col>
            
          </Col>
          <Col>
            <h3>FACTORY</h3>
            <br />
            <p>
              Jl. Cahaya Raya Kav. H-3 Kawasan Industri Sentul. Bogor 16810 Indonesia
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
