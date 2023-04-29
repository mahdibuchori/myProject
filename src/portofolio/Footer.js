import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export const Footer = () => {
  return (
    <footer className='footer'>
        <Container>
            <Row className="align-items-center">
                <Col size={12} sm={6}>
                </Col>
                <Col size={12} sm={6} className="text-center text-sm-end">
                    <p>Copyright 2022. PT Dagsap Endura Eatore</p>
                </Col>
            </Row>
        </Container>
    </footer>
  )
}
