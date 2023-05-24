import React, { useState, useEffect, useCallback } from 'react'
import './dataSparepart.css';
import Swal from "sweetalert2";
import Select from'../../../component/Select';
import { useNavigate } from 'react-router-dom';
import { API_AUTH } from '../../../apis/apisData';
import { NumericFormat } from 'react-number-format';
import { Breadcrumb, Button, Card, Col, Container, Form } from 'react-bootstrap';

import {LoadingPage} from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import { FilePart, FileSatuan } from '../../../datafile/FileSelect';
import usePartStore, { selectPart, selectFetchPart, selectPartReady, selectFalsePart } from '../../../store/ListPart';

export const AddPart = () => {
    const navigate = useNavigate();
    const userData = useAuthStore(selectUser);

    const onPart = usePartStore(selectFetchPart);
    const dataPart = usePartStore(selectPart);
    const partReady = usePartStore(selectPartReady);
    const partFalse = usePartStore(selectFalsePart);

    const [ idItem,setIdItem ] = useState('');
    const [namapart, setNamapart] = useState('');
    const [stockPart, setStockPart] = useState('');
    const [bufferPart, setBufferPart] = useState('');
    const [maxPart, setMaxPart] = useState('');
    const [statusPart, setStatusPart] = useState('');
    const [colorPart, setColorPart] = useState('#7a0080');
    const [bgPart, setBgPart] = useState('#eee');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const createUniq = () => {
          const xsd = Math.random().toString(36).slice(-4);
          setIdItem(xsd.toUpperCase());
        }
        createUniq();
      }, []);

    useEffect(() => { 
        setIsLoading(true);
        partFalse();
        onPart(userData.user_plan)
        console.log(userData)
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // setIsLoading(true);
        if (!partReady) return;
        onDataReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [partReady]);

    const onDataReady = () =>{
        console.log(dataPart)
    }

    const [form, setForm] = useState({
        cekTipe: null,
        cekSatuan: null,
    });

    const onValidate = (value, name) => {
    setError((prev) => ({
        ...prev,
        [name]: { ...prev[name], errorMsg: value },
    }));
    };

    const [error, setError] = useState({
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
    });
    
    const onHandleChange = useCallback((value, name) => {
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
    };

    const cekStatus = (nilai,data) =>{
        let buffer = 0;
        let stok = 0
        if(data === "buffer"){
            buffer = parseFloat(nilai);
            if(stockPart){
                stok = parseFloat(stockPart);
            }
            if(!nilai){
                setBufferPart(0)
            }
              
        }
        else{
            if(bufferPart){
                buffer = parseFloat(bufferPart);
            }
            stok = parseFloat(nilai);  
            if(!nilai){
                setStockPart(0)
            }
        }

        if(stok <= buffer){
            setStatusPart('STOCK LIMIT');
            setColorPart('#800000');
            setBgPart('#d07979a7');
        }
        else{
            setStatusPart('AMAN');
            setColorPart('#008011');
            setBgPart('#38cc4c73');
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const isValid = validateForm();
        if (!isValid) {
            console.error('Invalid Form!');
            return false;
        }
        else if(!namapart){
            Swal.fire('Info','Harap input nama sparepart','warning');
        }
        else if(!stockPart){
            Swal.fire('Info','Harap input stock sparepart','warning');
        }
        else if(!bufferPart){
            Swal.fire('Info','Harap input buffer stock sparepart','warning');
        }
        else if(!maxPart){
            Swal.fire('Info','Harap input maksimal stock sparepart','warning');
        }
        else if(!statusPart){
            Swal.fire('Info','Status sparepart tidak ada','warning');
        }
        else{
            let idCode = "";
            let plan = ""
            switch (form.cekTipe) {
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
            if(String(userData.user_plan).toUpperCase() === "SENTUL"){
                plan = "STL"
            }
            else{
                plan = "BTL"
            }
            const kode = `${idCode}-${idItem}-${plan}`;
            console.log()
            if(!kode){
                Swal.fire('Info','Kode Item Part tidak terbaca harap refresh page','warning');
            }
            else{
                saveData(kode);
            }
        }
    }

    const saveData = async (kode) =>{
        try {
            console.log({
                id_item	: kode,
                nama_item : namapart,	
                unit : form.cekSatuan,
                stok : stockPart,
                buffer : bufferPart,
                maks_stok : maxPart,
                status_item	: statusPart,
                tipe_barng	: form.cekTipe,
                plan : userData.user_plan
            })
            const next = await API_AUTH.post(`/createPart`, {
                id_item	: kode,
                nama_item : namapart,	
                unit : form.cekSatuan,
                stok : stockPart,
                buffer : bufferPart,
                maks_stok : maxPart,
                status_item	: statusPart,
                tipe_barng	: form.cekTipe,
                plan : userData.user_plan
            });
            
            Swal.fire(`${next.data.success}`, backhome(`/main/${userData.user_divisi}/Sparepart`), 'success');
            setIsLoading(false);
        } catch (error) {
            console.log(error.response.data.message)
            setIsLoading(false)
        }
    }

    const backhome = (e) =>{
        navigate(e);
    }

    return (
        <>
        <div className='dataspare'>
        <div className='dataspare-item-top'>
            <div>
            <Breadcrumb>
            <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
            <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}/Sparepart`)}>Table Spare Part</Breadcrumb.Item>
            <Breadcrumb.Item active>Add Sparepart</Breadcrumb.Item>
            </Breadcrumb>
            </div>
        </div>
        <Container>
            <Form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between align-items-lg-center py-2 flex-column flex-lg-row">
                <h2 className="h5 mb-3 mb-lg-0">Create New Item</h2>
            </div>
            <div className="row">
                <div className='col-lg-4'>
                <Card className='mb-4'>
                    <Card.Body>
                        <div className="row">
                            <h4>List Item</h4>

                            <div className='col-lg-12'>
                                <Form.Group as={Col} controlId="validationCustom02">
                                <Form.Label>Tipe Part</Form.Label>
                                <Select
                                    title={"tipe"}
                                    name={"cekTipe"}
                                    value={form.cekTipe}
                                    options={FilePart}
                                    onChangeFunc={onHandleChange}
                                    {...error.cekTipe}
                                />
                                </Form.Group>
                            </div>

                            <div className='col-lg-12'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                <Form.Label>ID Part</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={idItem}
                                    disabled
                                />
                                <Form.Control.Feedback type="invalid">Id Part tidak boleh kosong</Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <div className='col-lg-12'>
                                <Form.Group as={Col} controlId="validationCustom02">
                                <Form.Label>Nama Part</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        aria-label="With textarea"
                                        onChange={ (e) => setNamapart(e.target.value) }
                                        
                                    />
                                    <Form.Control.Feedback type="invalid">Harap input nama sparepart</Form.Control.Feedback>
                                </Form.Group>
                            </div>

                        </div>
                    </Card.Body>
                </Card> 
                </div>
                <div className='col-lg-8'>
                <Card className='mb-4'>
                    <Card.Body>
                    <h4>Data Part</h4>
                    <div className="row">
                        <div className='col-lg-6'>
                        <Form.Group as={Col} controlId="validationCustom01">
                            <Form.Label>Stock</Form.Label>
                                <NumericFormat 
                                    customInput={Form.Control}
                                    thousandSeparator={false}
                                    value={stockPart}
                                    onChange={ (e) => {
                                        setStockPart(e.target.value)
                                        cekStatus(e.target.value,"stock")
                                    } }
                                />
                        </Form.Group>
                        </div>

                        <div className='col-lg-6'>
                            <Form.Group as={Col} controlId="validationCustom01">
                                <Form.Label>Unit</Form.Label>
                                    <Select
                                        title={"unit"}
                                        name={"cekSatuan"}
                                        value={form.cekSatuan}
                                        options={FileSatuan}
                                        onChangeFunc={onHandleChange}
                                        {...error.cekSatuan}
                                    />
                            </Form.Group>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-lg-6'>
                        <Form.Group as={Col} controlId="validationCustom01">
                            <Form.Label>Buffer Stock</Form.Label>
                                <NumericFormat 
                                    customInput={Form.Control}
                                    thousandSeparator={false}
                                    value={bufferPart}
                                    onChange={ (e) => {
                                        setBufferPart(e.target.value)
                                        cekStatus(e.target.value,"buffer")
                                    } }
                                />
                                <Form.Control.Feedback type="invalid">Harap Input Terima Barang</Form.Control.Feedback>
                        </Form.Group>
                        </div>

                        <div className='col-lg-6'>
                        <Form.Group as={Col} controlId="validationCustom01">
                            <Form.Label>Stock Maksimal</Form.Label>
                            <NumericFormat 
                                customInput={Form.Control}
                                thousandSeparator={false}
                                value={maxPart}
                                onChange={ (e) => setMaxPart(e.target.value) }
                            />
                            <Form.Control.Feedback type="invalid">Harap Input Return Produksi</Form.Control.Feedback>
                        </Form.Group>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-lg-12'>
                        <Form.Group as={Col} controlId="validationCustom01">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                style={{backgroundColor : bgPart, color : colorPart}}
                                value={statusPart}
                                disabled
                            />
                            <Form.Control.Feedback type="invalid">Harap Input Stok Akhir</Form.Control.Feedback>
                        </Form.Group>
                        </div>

                    </div>
                    </Card.Body>
                </Card>

                <div className='mb-5'>
                    <div className="row justify-content-end">
                    <div className="col-lg-6">
                    </div>
                    <div className="col-lg-6">
                        <div className="float-end text-end">
                        <Button type="submit" className='p-3 mb-5'>
                            <i className="bi bi-send"></i> &nbsp;Simpan Data</Button>
                        </div>
                    </div>
                    </div>
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
