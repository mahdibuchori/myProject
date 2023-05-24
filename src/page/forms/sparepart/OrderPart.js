import React, { useState, useEffect } from 'react'
import './dataSparepart.css';
import Swal from "sweetalert2";
import { API_AUTH } from '../../../apis/apisData';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import { Breadcrumb, Button, Card, Col, Container, Form, Stack } from 'react-bootstrap';

export const OrderPart = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const userData = useAuthStore(selectUser);

    const [kode, setKode] = useState('');
    const [tglOrder, setTglOrder] = useState('');
    const [statusItem, setStatusItem] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [orderQty, setOrderQty] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    useEffect(() =>{
        const xsd = Math.random().toString(36).slice(-4);
        let tipeItem  = location.state.tipe_barng;
        let idCode = "";
        switch (tipeItem) {
            case 'Baut & Mur':
                idCode = "BM";
            break;
            case 'Bearing':
                idCode = "BE";
            break;
            case 'Ekspedisi':
                idCode = "EK";
            break;
            case 'Elektrik':
                idCode = "EL";
            break;
            case 'Mekanikal':
                idCode = "MK";
            break;
            case 'Non Inventory':
                idCode = "NI";
            break;
            case 'Seal & Ring':
                idCode = "SR";
            break;
            case 'Utility':
                idCode = "UT";
            break;
            case 'V Belt':
                idCode = "VB";
            break;
            
            default:
                idCode = "UN";
        }
        const date = new Date();
        let mm = parseInt(date.getMonth()) + 1;
        let yy = date.getFullYear();
        let dd = date.getDate();
        let hari = String(dd).padStart(2,'0');
        let bulan = String(mm).padStart(2, '0');
        let tahun = String(yy).substring(2);
        
        setKode(`${idCode}-${xsd.toUpperCase()}-${bulan}${tahun}`);
        setTglOrder(`${hari}/${bulan}/${yy}`);
        setOrderQty();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    useEffect(() => {
        setIsLoading(true);
        console.log(location.state.data)
        if(location.state === null) {
            backhome(`/main/${userData.user_divisi}/Sparepart`);
            Swal.fire('Info','Harap kembali ke halaman permintaan data tidak lengkap', 'info');
        }
        else{
            cekData();
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cekData =async () =>{
        setStatusItem("PENGAJUAN");
        console.log(kode)
        setIsLoading(false)
    }

    const handleSubmit =async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        }
        else if(!kode){
            Swal.fire('Info','Harap refresh page','warning')
        }
        else{
            setIsLoading(true)
            saveData();
            
        }
    }

    const saveData = async () =>{
        try {
            const data = [{
                id_item : location.state.data.id_item,
                id_order : kode,
                nama_item : location.state.data.nama_item,
                unit : location.state.data.unit,
                stok : location.state.data.stok,
                qty_order : orderQty,
                tgl_permintaan : tglOrder,
                keterangan : keterangan,
                status_item : statusItem,
                tipe_barng : location.state.data.tipe_barng,	
                pemohon : userData.user_name,
                plan : userData.user_plan
            }]; 
            console.log(data)
            const next = await API_AUTH.post(`/orderPart`, {
                id_item : location.state.data.id_item,
                id_order : kode,
                nama_item : location.state.data.nama_item,
                unit : location.state.data.unit,
                stok : location.state.data.stok,
                qty_order : orderQty,
                tgl_permintaan : tglOrder,
                keterangan : keterangan,
                status_item : statusItem,
                tipe_barng : location.state.data.tipe_barng,	
                pemohon : userData.user_name,
                plan : userData.user_plan
            });
            
            Swal.fire(`${next.data.success}`, backhome(`/main/${userData.user_divisi}/Sparepart`), 'success');
            setIsLoading(false);
        } catch (error) {
            console.log(error)
            Swal.fire('Info',error.response.data.message,'warning');
            setIsLoading(false)
        }
    }

    const backhome = (e) =>{
        navigate(e);
    }
    return (
        <>
        <div className='dataspare'>
            <div>
                <Stack direction="horizontal" gap={3}>
                    <div className="bg-light ">
                        <Breadcrumb>
                            <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}/Sparepart`)}>Table Spare Part</Breadcrumb.Item>
                            <Breadcrumb.Item active>Order Part</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="bg-light border ms-auto"></div>
                    <div className="vr" />
                    <div className="bg-light border">
                        <Button variant="primary"  style={{marginRight: 10}} onClick={() => backhome(`/main/${userData.user_divisi}/Sparepart`)}><i class="bi bi-backspace"></i> Kembali</Button>
                    </div>
                </Stack>
            </div>
            <div className='dataspare-item-top'>
                <h5>Create Order Part</h5>
            </div>
            <Container>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-4 mb-1">
                            <Card className='mb-2'>
                                <Card.Body>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Id Order</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={kode}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Tanggal Order</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={tglOrder}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className='mb-2'>
                                <Card.Body>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Nama</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={userData.user_name}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Jabatan</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={userData.user_status}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-8 mb-1">
                            <Card className="mb-2">
                                <Card.Body>
                                    <div className="row p-2">
                                        <div className='col-lg-6'>
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Tipe Item</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    disabled
                                                    value={location.state.data.tipe_barng}

                                                />
                                                <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className='col-lg-6'>
                                            <Form.Group as={Col} controlId="validationCustom02">
                                                <Form.Label>Status</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    disabled
                                                    value={statusItem}
                                                    className='btn btn-danger mb-3'
                                                />
                                                <Form.Control.Feedback type="invalid">Harap Input Nama karyawan</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <Form.Group as={Col} controlId="formGridArea">
                                            <Form.Label>Nama Item</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                aria-label="With textarea" 
                                                disabled
                                                value={location.state.data.nama_item}
                                            />
                                        </Form.Group>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                            <Card className="mb-2">
                                <div className="row p-2">
                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Stock Item</Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                disabled
                                                value={location.state.data.stok}

                                            />
                                            <Form.Control.Feedback type="invalid">Harap Stok Item</Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom02">
                                            <Form.Label>Qty Order</Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                value={orderQty}
                                                onChange={(e) => {
                                                    console.log(e.target.value)
                                                    setOrderQty(e.target.value)
                                                }}
                                            />
                                            <Form.Control.Feedback type="invalid">Harap Input Qty Order</Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-4'>
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Satuan</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    disabled
                                                    value={location.state.data.unit}

                                                />
                                                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                                            </Form.Group>
                                    </div>
                                </div>
                            </Card>
                            <Card className="mb-2">
                                <Card.Body>
                                    <div class="row">
                                            <div class="col-lg-12">
                                                <Form.Group as={Col} controlId="formGridArea">
                                                <Form.Label>Keterangan</Form.Label>
                                                <Form.Control 
                                                    as="textarea" 
                                                    aria-label="With textarea" 
                                                    value={keterangan}
                                                    onChange={(e) => {
                                                        setKeterangan(e.target.value)
                                                    }}
                                                />
                                            </Form.Group>
                                            </div>
                                        </div>
                                </Card.Body>
                            </Card>
                            <div style={{display: 'flex', justifyContent:'flex-end', width: '100'}}>
                                <Button type="submit">Submit form</Button>
                            </div> 
                        </div>
                    </div>
                </Form>
            </Container>
        </div>

        
        {isLoading ? <LoadingPage/> : ""}
        </>
    )
}
