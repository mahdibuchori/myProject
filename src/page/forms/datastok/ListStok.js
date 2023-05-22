import React, { useState, useEffect } from 'react';
import './datastok.css';
import Swal from "sweetalert2";
// import id from 'date-fns/locale/id';
// import Select from'../../../component/Select';
// import { formatInTimeZone } from 'date-fns-tz';
import { useNavigate, useLocation } from 'react-router-dom';
// import { API_AUTH } from '../../../apis/apisData';
import { NumericFormat } from 'react-number-format';
import { Accordion, Breadcrumb, Card, Col, Container, Form, InputGroup, } from 'react-bootstrap';

import {LoadingPage} from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
// import { FileKartu, FileSatuan, FileTipe } from '../../../datafile/FileSelect';
// import useMaterialStore, { selectFetchMaterial } from '../../../store/listBarang';

export const ListStok = () => {const navigate = useNavigate();
    const location = useLocation();
    const userData = useAuthStore(selectUser);
    
    const [isLoading, setIsLoading] = useState(false);
    // const [ validated, setValidated ] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        if(location.state === null) {
            backhome(`/main/${userData.user_divisi}/STOKGUDANG`);
            Swal.fire('Info','Harap kembali ke halaman permintaan data tidak lengkap', 'info')
        }
        else{
            cekData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    /* const [form, setForm] = useState({
        cekTipe: null,
        cekSatuan: null,
        cekProvider: null,
        cekKartuStock: null
    });

    const onValidate = (value, name) => {
    setError((prev) => ({
        ...prev,
        [name]: { ...prev[name], errorMsg: value },
    }));
    };
 */
    /* const [error, setError] = useState({
        cekTipe: {
            isReq: true,
            errorMsg: '',
            onValidateFunc: onValidate,
        },
        cekSatuan: {
            isReq: true,
            errorMsg: '',
            onValidateFunc: onValidate,
        },
    }); */
    
    /* const onHandleChange = useCallback((value, name) => {
    setForm((prev) => ({
        ...prev,
        [name]: value,
    }));
    }, []);

    const validateForm = () => {
    let isInvalid = false;
    
    Object.keys(error).forEach((x) => {
        const errObj = error[x];
        if (errObj.errorMsg) {
        isInvalid = true;
        } else if (errObj.isReq && !form[x]) {
        isInvalid = true;
        onValidate(true, x);
        }
    });
    return !isInvalid;
    }; */

    const cekData = () =>{
        /* const pengad_cepat = "5";
        const pengad_lama = "4";
        let avg = ((parseFloat(pengad_cepat) + parseFloat(pengad_lama)) / 2).toFixed(3);
        let nilai = avg * 1;
        let qd = (1.28 * 1 * Math.sqrt(21)).toFixed(3);
        console.log(String(nilai));
        console.log(String(qd * 1));
        console.log(location.state.data.pengad_lama)

        let str = 'Yona Nugget Ayam Reg 500 Gr '
		let outStr = str.trim();
        console.log(str.length)
        console.log(outStr.length) */
        setIsLoading(false)
    }

    /* const handleSubmit = (event) => {
        const cekForm = event.currentTarget;
        const submitForm = cekForm.checkValidity()
        event.preventDefault();
        const isValid = validateForm();
        if (!isValid) {
            console.error('Invalid Form!');
            return false;
        }
        if (!submitForm) {
            event.stopPropagation();
        }
        setValidated(true);
        
        if(isValid && submitForm ){
            saveData()
        
        };
    } */

    const backhome = (e) =>{
        navigate(e)
    } 
  return (
    <>
    <div className='datastok'>
        <div className='datastok-item-top'>
            <div>
            <Breadcrumb>
            <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
            <Breadcrumb.Item onClick={() => backhome(`/main/${userData.user_divisi}/STOKGUDANG`)}>Stok Gudang</Breadcrumb.Item>
            <Breadcrumb.Item active>List</Breadcrumb.Item>
            </Breadcrumb>
            </div>
        </div>
        <Container>
            <Form>
            {/*  noValidate validated={validated} onSubmit={handleSubmit} */}
            <div className="d-flex justify-content-between align-items-lg-center py-2 flex-column flex-lg-row">
                <h2 className="h5 mb-2 mb-lg-0">List Data Item</h2>
            </div>
            <div className="row">
                <div className='col-lg-4'>
                    <Card className='mb-4'>
                        <Card.Body>
                        <div className="row">
                            <h4 style={{fontSize : "18px", color : "#0c63e4"}}>List Item</h4>

                            <div className='col-lg-12'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label style={{fontSize : "13px"}}>Deskripsi Item</Form.Label>
                                
                                    <InputGroup>
                                        <Form.Control 
                                            as="textarea" 
                                            aria-label="With textarea" 
                                            rows={1}
                                            value = {location.state.data.item}
                                            disabled
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </div>

                            <div className='col-lg-12'>
                                <Form.Group as={Col} controlId="validationCustom02">
                                    <Form.Label  style={{fontSize : "13px"}}>Saldo Awal</Form.Label>
                                    <InputGroup>
                                        <NumericFormat 
                                            customInput={Form.Control}
                                            thousandSeparator={true}
                                            value={location.state.data.saldo_awal}
                                            disabled
                                        />
                                        <InputGroup.Text id="basic-addon2">{location.state.data.unit.toUpperCase()}</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </div>

                            <div className='col-lg-12'>
                                <Form.Group as={Col} controlId="validationCustom02">
                                    <Form.Label  style={{fontSize : "13px"}}>Saldo Akhir</Form.Label>
                                    <InputGroup>
                                        <NumericFormat 
                                            customInput={Form.Control}
                                            thousandSeparator={true}
                                            value={location.state.data.saldo_akhir}
                                            disabled
                                        />
                                        <InputGroup.Text id="basic-addon2">{location.state.data.unit.toUpperCase()}</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </div>

                            <div className='col-lg-12'>
                                <Form.Group as={Col} controlId="validationCustom02">
                                    <Form.Label  style={{fontSize : "13px"}}>Terima Barang</Form.Label>
                                    <InputGroup>
                                        <NumericFormat 
                                            customInput={Form.Control}
                                            thousandSeparator={true}
                                            value={location.state.data.terim_bar}
                                            disabled
                                        />
                                        <InputGroup.Text id="basic-addon2">{location.state.data.unit.toUpperCase()}</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </div>

                            <div className='col-lg-12'>
                                <Form.Group as={Col} controlId="validationCustom02">
                                    <Form.Label  style={{fontSize : "13px"}}>Return Produksi</Form.Label>
                                    <InputGroup>
                                        <NumericFormat 
                                            customInput={Form.Control}
                                            thousandSeparator={true}
                                            value={location.state.data.ret_prod}
                                            disabled
                                        />
                                        <InputGroup.Text id="basic-addon2">{location.state.data.unit.toUpperCase()}</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </div>

                            <div className='col-lg-12'>
                                <Form.Group as={Col} controlId="validationCustom02">
                                    <Form.Label  style={{fontSize : "13px"}}>Permintaan Produksi</Form.Label>
                                    <InputGroup>
                                        <NumericFormat 
                                            customInput={Form.Control}
                                            thousandSeparator={true}
                                            value={location.state.data.perm_prod}
                                            disabled
                                        />
                                        <InputGroup.Text id="basic-addon2">{location.state.data.unit.toUpperCase()}</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </div>

                            <div className='col-lg-12'>
                                <Form.Group as={Col} controlId="validationCustom02">
                                    <Form.Label  style={{fontSize : "13px"}}>Pindah Barang, Musnah & Return ke suplier</Form.Label>
                                    <InputGroup>
                                        <NumericFormat 
                                            customInput={Form.Control}
                                            thousandSeparator={true}
                                            value={location.state.data.pin_bar}
                                            disabled
                                        />
                                        <InputGroup.Text id="basic-addon2">{location.state.data.unit.toUpperCase()}</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </div>

                        </div>
                        </Card.Body>
                    </Card> 
                </div>
                <div className='col-lg-8'>
                    <Accordion defaultActiveKey="0" alwaysOpen>
                        <Accordion.Item eventKey="0" className='box-card mb-3'>
                            <Accordion.Header>Rata-Rata Pengadaan Item</Accordion.Header>
                            <Accordion.Body>
                                <div className="row">
                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Pengadaan Lama</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.pengad_lama}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Pengadaan Cepat</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.pengad_cepat}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Rata-Rata Pengadaan</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.pngad_rata}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Permintaan Maks Prod</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.permint_maxpro}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className='box-card mb-3'>
                            <Accordion.Header>Safety Stock Rata-Rata</Accordion.Header>
                            <Accordion.Body>
                                <div className="row">
                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Rata Rata/Jml permintaan</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.average_jmlminta}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Stock MAX</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.save_stockmax}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Re Order Max</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.reorder_stockmax}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Ket Safety Stock Max</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={location.state.data.ket_stockmax}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2" className='box-card mb-3'>
                            <Accordion.Header>Safety Stock Tidak Pasti</Accordion.Header>
                            <Accordion.Body>
                                <div className="row">
                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>STDEVP</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.stdevp}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Stock Permintaan</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.savestok_tp}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Re Order Point</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.reorder_tp}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Ket Tidak Pasti</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={location.state.data.ketper_tp}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3" className='box-card mb-3'>
                            <Accordion.Header>Limit Stock & Standar Penyimpanan</Accordion.Header>
                            <Accordion.Body>
                                <div className="row">
                                    <div className='col-lg-6'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Limit Stock</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.limit_stok}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-6'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Ket Limit Stock</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={location.state.data.ket_limit}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Standar( Palet )</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.std_smpan}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Qty/Palet</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.qty_perpalet}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Update Qty ( Palet )</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.updt_simpalet}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="4" className='box-card mb-3'>
                            <Accordion.Header>Status & Estimasi Tanggal</Accordion.Header>
                            <Accordion.Body>
                                <div className="row">
                                    <div className='col-lg-12'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Status</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={location.state.data.status_tmpt}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-lg-12'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Estimasi Tanggal kirim Berdasarkan Safety stock max average</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.estimasi_krmbypalet}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-lg-12'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label style={{fontSize: '12px'}}>Estimasi Tanggal kirim Berdasarkan Permintaan tidak pasti</Form.Label>
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={location.state.data.estimasi_krmtp}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                            
                            
                            
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>
            </Form>
        </Container>
    </div>
    {isLoading ? <LoadingPage/> : ""}
    </>
  )
}
