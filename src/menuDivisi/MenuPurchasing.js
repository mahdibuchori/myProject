import React, { useState, useEffect } from 'react';
import './divisistyle.css';
import { Card, Col, Row } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import useAuthStore, { selectAuthReady, selectUser } from '../store/authLogin';

export const MenuPurchasing = () => {
    const [divisi, setDivisi] = useState('');

    const authReady = useAuthStore(selectAuthReady);
    const userData = useAuthStore(selectUser);

    useEffect(() => {
        if (!authReady) return;
        setDivisi(userData.user_divisi);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[authReady]);
    return (
        <div className='divisi'>
            <div className='divisiWidgets'>
                <Row xs={1} md={4} className="g-4">

                <Link to={"/main/"+divisi+"/EksternalProvider"} className='link'>
                    <Col>
                        <Card className="text-center">
                            <span className='icon'><i class="bi bi-briefcase"></i></span>
                            <Card.Body>
                            <Card.Text>Eksternal Provider</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Link>
        
                <Link to={"/main/"+divisi+"/Pengadaan"} className='link'>
                    <Col>
                    <Card className="text-center">
                        <span className='icon'><i class="bi bi-cart2"></i></span>
                        <Card.Body>
                        <Card.Text>Pengadaan Barang</Card.Text>
                        </Card.Body>
                    </Card>
                    </Col>
                </Link>
              
                <Link to="" className='link'>
                    <Col>
                    <Card className="text-center">
                        <span className='icon'><i className="bi bi-box-seam"></i></span>
                        <Card.Body>
                        <Card.Text>Permintaan Barang</Card.Text>
                        </Card.Body>
                    </Card>
                    </Col>
                </Link>
    
                <Link to={"/main/"+divisi+"/Purchasing"} className='link'>
                    <Col>
                    <Card className="text-center">
                        <span className='icon'><i className="bi bi-shop"></i></span>
                        <Card.Body>
                        <Card.Text>Purchasing Order</Card.Text>
                        </Card.Body>
                    </Card>
                    </Col>
                </Link>
        
                <Link to="" className='link'>
                    <Col>
                    <Card className="text-center">
                        <span className='icon'><i className="bi bi-truck"></i></span>
                        <Card.Body>
                        <Card.Text>Terima Barang</Card.Text>
                        </Card.Body>
                    </Card>
                    </Col>
                </Link>
    
                </Row>
            </div>
        </div>
    )
}
