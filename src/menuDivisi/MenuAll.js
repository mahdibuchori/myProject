import React, { useState, useEffect } from 'react';
import './divisistyle.css';
import { Card, Col, Row } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import useAuthStore, { selectAuthReady, selectUser } from '../store/authLogin';

export const MenuAll = () => {
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

            <Link to={"/main/"+divisi+"/BOM"} className='link'>
                <Col>
                <Card className="text-center">
                    <span className='icon'><i className="bi bi-file-earmark-text"></i></span>
                    <Card.Body>
                    <Card.Text>Data BOM</Card.Text>
                    </Card.Body>
                </Card>
                </Col>
            </Link>

            <Link to={"Karyawan"} className='link'>
                <Col>
                <Card className="text-center">
                    <span className='icon'><i className="bi bi-person-circle"></i></span>
                    <Card.Body>
                    <Card.Text>Data Karyawan</Card.Text>
                    </Card.Body>
                </Card>
                </Col>
            </Link>

            <Link to={"/main/"+divisi+"/Sparepart"} className='link'>
                <Col>
                <Card className="text-center">
                <span className='icon'><i className="bi bi-tools"></i></span>
                <Card.Body>
                    <Card.Text>Data Spare Part</Card.Text>
                </Card.Body>
                </Card>
                </Col>
            </Link>

            <Link to={"/main/"+divisi+"/STOKGUDANG"} className='link'>
                <Col>
                <Card className="text-center">
                <span className='icon'><i className="bi bi-inboxes"></i></span>
                <Card.Body>
                    <Card.Text>Data Stock</Card.Text>
                </Card.Body>
                </Card>
                </Col>
            </Link>

            <Link to="" className='link'>
                <Col>
                <Card className="text-center">
                    <span className='icon'><i className="bi bi-card-list"></i></span>
                    <Card.Body>
                    <Card.Text>Kartu Stock</Card.Text>
                    </Card.Body>
                </Card>
                </Col>
            </Link>

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

            <Link to={"/main/"+divisi+"/OKP"} className='link'>
                <Col>
                    <Card className="text-center">
                        <span className='icon'><i class="bi bi-file-earmark-ruled"></i></span>
                        <Card.Body>
                        <Card.Text>OKP</Card.Text>
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
          
            <Link to={"/main/"+divisi+"/Permintaan"} className='link'>
                <Col>
                <Card className="text-center">
                    <span className='icon'><i className="bi bi-box-seam"></i></span>
                    <Card.Body>
                    <Card.Text>Permintaan Barang</Card.Text>
                    </Card.Body>
                </Card>
                </Col>
            </Link>
    
            <Link to="" className='link'>
                <Col>
                <Card className="text-center">
                    <span className='icon'><i className="bi bi-recycle"></i></span>
                    <Card.Body>
                    <Card.Text>Pindah Barang</Card.Text>
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
                    <span className='icon'><i className="bi bi-arrow-return-left"></i></span>
                    <Card.Body>
                    <Card.Text>Retur Produksi</Card.Text>
                    </Card.Body>
                </Card>
                </Col>
            </Link>
    
            <Link to={"/main/"+divisi+"/Tallysheet"} className='link'>
                <Col>
                <Card className="text-center">
                    <span className='icon'><i className="bi bi-clipboard-check"></i></span>
                    <Card.Body>
                    <Card.Text>Tally Sheet</Card.Text>
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
