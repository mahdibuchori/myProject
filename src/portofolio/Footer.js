import React, {useEffect, useState} from 'react';
import { Col, Container, Row } from 'react-bootstrap';


export const Footer = () => {
  const [date, setDate] = useState('');

  useEffect(() => {
    const waktu = new Date();
    let year = waktu.getFullYear();
    setDate(year)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <footer className='footer'>
        <Container>
            <Row className="align-items-center">
                <Col size={12} sm={6}>
                </Col>
                <Col size={12} sm={6} className="text-center text-sm-end">
                    <p>Copyright {date}. PT Dagsap Endura Eatore</p>
                </Col>
            </Row>
        </Container>
    </footer>
  )
}
