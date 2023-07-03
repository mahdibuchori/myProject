import React, { useState, useEffect, useCallback } from 'react';
import './datastok.css';
import Swal from "sweetalert2";
import id from 'date-fns/locale/id';
import Select from'../../../component/Select';
import { formatInTimeZone } from 'date-fns-tz';
import { useNavigate } from 'react-router-dom';
import { API_AUTH } from '../../../apis/apisData';
import { NumericFormat } from 'react-number-format';
import { Breadcrumb, Button, Card, Col, Container, Form, InputGroup, } from 'react-bootstrap';

import {LoadingPage} from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import { FileKartu, FileSatuan, FileTipe } from '../../../datafile/FileSelect';
import useMaterialStore, { selectFetchMaterial } from '../../../store/listBarang';
import useProviderStore, {selectProvider, selectFetchProvider, selectProviderReady, selectFalseProvider} from '../../../store/listProvider';


export const InputStok = () => {
    const navigate = useNavigate();
    const userData = useAuthStore(selectUser);
    const onMaterial = useMaterialStore(selectFetchMaterial);
    const newProvider = useProviderStore(selectProvider);
    const fetchProvider = useProviderStore(selectFetchProvider);
    const falseProvider = useProviderStore(selectFalseProvider);
    const providerReady = useProviderStore(selectProviderReady);

    const [isLoading, setIsLoading] = useState(false);
    const [ validated, setValidated ] = useState(false);
    const [provider, setProvider] = useState([]);
    const [ idItem,setIdItem ] = useState('');
    const [ item,setItem ] = useState('');
    const [ saldoAwal,setSaldoAwal ] = useState('');
    const [ pengadaanLama,setPengadaanLama ] = useState('');
    const [ pengadaanCepat,setPengadaanCepat ] = useState('');
    const [simpanPalet, setSimpanPalet] = useState('');
    const [itemPalet, setItemPalet] = useState('');
    const [lot, setLot] = useState('');
    const [expired, setExpired] = useState('');
    const [tanggal, setTanggal] = useState('');

    useEffect(() => { 
        falseProvider();  
        fetchProvider();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    useEffect(() => {
        setIsLoading(true);
        if (!providerReady) return;
        onGridReady();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providerReady]);

    useEffect(() => {
        const createUniq = () => {
            const xsd = Math.random().toString(36).slice(-4);
            setIdItem("IDB"+xsd.toUpperCase());
            let bln = formatInTimeZone(new Date(), 'Asia/Jakarta', 'MM', { locale: id });
            let tahun = formatInTimeZone(new Date(), 'Asia/Jakarta', 'yyyy', { locale: id });
            let hari = formatInTimeZone(new Date(), 'Asia/Jakarta', 'dd', { locale: id });
            setTanggal(`${tahun}-${bln}-${hari}`)
        }
        createUniq();
      }, []);
      
    const [form, setForm] = useState({
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

    const onGridReady = () =>{
        const results =  newProvider.filter(element => {
            return  element.nama_provider
        });
        results.sort((a, b) => a.nama_provider.localeCompare(b.nama_provider));

        let modifiedArr = results.map(function(element){
            return { value: element.nama_provider, label: element.nama_provider };
        });
        setProvider(modifiedArr);
        setIsLoading(false);
    }

    const handleSubmit = (event) => {
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
    }

    const saveData = async () =>{
        if(saldoAwal === ""){
            Swal.fire('Info','Harap masukan nilai saldo awal','info');
        }
        else if(pengadaanLama === ""){
            Swal.fire('Info','Harap masukan nilai pengadaan terlama','info');
        }
        else if(pengadaanCepat === ""){
            Swal.fire('Info','Harap input nilai pengadaan tercepat','info');
        }
        else if(simpanPalet === ""){
            Swal.fire('Info','Harap masukan standar penyimpanan ( palet )','info');
        }
        else if(itemPalet === ""){
            Swal.fire('Info','Harap input nilai qty item per palet','info');
        }
        else{
            try {
                setIsLoading(true);

                const data = {
                    id_item: idItem,
                    item : item,
                    unit : form.cekSatuan,
                    saldo_awal : saldoAwal,
                    pengad_lama : `${pengadaanLama}`,
                    pengad_cepat : `${pengadaanCepat}`,
                    tipe_barng : `${form.cekTipe}`,
                    std_smpan : `${simpanPalet}`,
                    qty_perpalet : `${itemPalet}`,
                    tanggal : `${tanggal}`,
                    tipe : `${form.cekKartuStock}`,
                    provider : `${form.cekProvider}`,
                    lot : `${lot}`,
                    expired : `${expired}`
                }
                console.log(data)
                await API_AUTH.post(`/Gudang`, {
                    id_item: idItem,
                    item : item.toUpperCase(),
                    unit : form.cekSatuan,
                    saldo_awal : saldoAwal,
                    pengad_lama : `${pengadaanLama}`,
                    pengad_cepat : `${pengadaanCepat}`,
                    tipe_barng : `${form.cekTipe}`,
                    std_smpan : `${simpanPalet}`,
                    qty_perpalet : `${itemPalet}`,
                    tanggal : `${tanggal}`,
                    tipe : `${form.cekKartuStock}`,
                    provider : `${form.cekProvider}`,
                    lot : `${lot}`,
                    expired : `${expired}`
                  });
                
                await onMaterial();
                setIsLoading(false);
                Swal.fire('Item baru berhasil ditambahkan!', navigate(`/main/${userData.user_divisi}/STOKGUDANG`), 'success');
                
            } catch (error) {
                console.log(error)
                setIsLoading(false);
                Swal.fire({
                    icon: 'info',
                    title: 'Oops...',
                    text: error.response.data.msg
                })
            }
        }
    
    }

    const changeKode = () =>{
        const xsd = Math.random().toString(36).slice(-4);
        setIdItem("IDB"+xsd.toUpperCase());
    }
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
                <Breadcrumb.Item active>Create</Breadcrumb.Item>
                </Breadcrumb>
                </div>
            </div>
            <Container>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between align-items-lg-center py-2 flex-column flex-lg-row">
                    <h2 className="h5 mb-2 mb-lg-0">Create New Item</h2>
                </div>
                <div className="row">
                    <div className='col-lg-4'>
                    <Card className='mb-4'>
                        <Card.Body>
                        <div className="row">
                        <h4>List Item</h4>

                        <div className='col-lg-12'>
                            <Form.Group as={Col} controlId="validationCustom01">
                            <Form.Label>ID Item</Form.Label>
                            
                            <InputGroup className="mb-3">
                                <Form.Control
                                    required
                                    type="text"
                                    disabled
                                    value={idItem}
                                />
                                <Button id="button-addon1" onClick={()=>changeKode()}>
                                    <i className="bi bi-arrow-repeat"></i>
                                </Button>
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <div className='col-lg-12'>
                            <Form.Group as={Col} controlId="validationCustom02">
                            <Form.Label>Tipe</Form.Label>
                            <Select
                                title={"tipe"}
                                name={"cekTipe"}
                                value={form.cekTipe}
                                options={FileTipe}
                                onChangeFunc={onHandleChange}
                                {...error.cekTipe}
                            />
                            </Form.Group>
                        </div>

                        <div className='col-lg-12'>
                            <Form.Group as={Col} controlId="validationCustom02">
                            <Form.Label>Material</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={item.toUpperCase()}
                                onChange={ (e) => setItem(e.target.value) }
                            />
                            <Form.Control.Feedback type="invalid">Harap Input Nama Material</Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <div className='col-lg-12'>
                            <Form.Group as={Col} controlId="validationCustom01">
                                <Form.Label>Saldo Awal</Form.Label>
                                <NumericFormat 
                                    customInput={Form.Control}
                                    thousandSeparator={true}
                                    onChange={ (e) => setSaldoAwal(e.target.value) }
                                />
                            </Form.Group>
                            </div>
                            
                            <div className='col-lg-12'>
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
                        </Card.Body>
                    </Card> 
                    </div>
                    <div className='col-lg-8'>
                    {/* <Card className='mb-4'>
                        <Card.Body>
                        <h4>Data In/Out Item</h4>
                        <div className="row">
                            <div className='col-lg-6'>
                            <Form.Group as={Col} controlId="validationCustom01">
                                <Form.Label>Terima Barang</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    onChange={ (e) => setTerimaBarang(e.target.value) }
                                />
                                <Form.Control.Feedback type="invalid">Harap Input Terima Barang</Form.Control.Feedback>
                            </Form.Group>
                            </div>

                            <div className='col-lg-6'>
                            <Form.Group as={Col} controlId="validationCustom01">
                                <Form.Label>Return Produksi</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    onChange={ (e) => setReturProd(e.target.value) }
                                />
                                <Form.Control.Feedback type="invalid">Harap Input Return Produksi</Form.Control.Feedback>
                            </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-lg-6'>
                            <Form.Group as={Col} controlId="validationCustom01">
                                <Form.Label>Permintaan Produksi</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    onChange={ (e) => setPermintProd(e.target.value) }
                                />
                                <Form.Control.Feedback type="invalid">Harap Input Stok Akhir</Form.Control.Feedback>
                            </Form.Group>
                            </div>

                            <div className='col-lg-6'>
                            <Form.Group as={Col} controlId="validationCustom01">
                                <Form.Label>Pindah Barang</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    onChange={ (e) => setPindahBarang(e.target.value) }
                                />
                                <Form.Control.Feedback type="invalid">Harap Input Pindah Barang</Form.Control.Feedback>
                            </Form.Group>
                            </div>
                        </div>
                        </Card.Body>
                    </Card> */}

                    <Card className='mb-2'>
                        <Card.Body>
                        <h4>Rata-Rata Pengadaan Item</h4>
                        <div className="row">
                            <div className='col-lg-6'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Pengadaan Lama</Form.Label>
                                    <NumericFormat 
                                        customInput={Form.Control}
                                        thousandSeparator={true}
                                        onChange={ (e) => setPengadaanLama(e.target.value) }
                                    />
                                </Form.Group>
                            </div>

                            <div className='col-lg-6'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Pengadaan Cepat</Form.Label>
                                    <NumericFormat 
                                        customInput={Form.Control}
                                        thousandSeparator={true}
                                        onChange={ (e) => setPengadaanCepat(e.target.value) }
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        </Card.Body>
                    </Card>

                    <Card className='mb-2'>
                        <Card.Body>
                        <h4>Penyimpanan Palet</h4>
                        <div className="row">
                            <div className='col-lg-6'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Standar Penyimpanan ( Palet )</Form.Label>
                                    <NumericFormat 
                                        customInput={Form.Control}
                                        thousandSeparator={true}
                                        onChange={ (e) => setSimpanPalet(e.target.value) }
                                    />
                                </Form.Group>
                            </div>

                            <div className='col-lg-6'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Qty Item Per Palet</Form.Label>
                                    <NumericFormat 
                                        customInput={Form.Control}
                                        thousandSeparator={true}
                                        onChange={ (e) => setItemPalet(e.target.value) }
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        </Card.Body>
                    </Card>

                    <Card className='mb-2'>
                        <Card.Body>
                        <h4>Kartu Stock</h4>
                        <div className="row">
                            <div className='col-lg-6'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Tipe</Form.Label>
                                    <Select
                                        title={"kartustok"}
                                        name={"cekKartuStock"}
                                        value={form.cekKartuStock}
                                        options={FileKartu}
                                        onChangeFunc={onHandleChange}
                                        // {...error.cekKartuStock}
                                    />
                                </Form.Group>
                            </div>

                            <div className='col-lg-6'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Eksternal Provider</Form.Label>
                                    <Select
                                        title={"provider"}
                                        name={"cekProvider"}
                                        value={form.cekProvider}
                                        options={provider}
                                        onChangeFunc={onHandleChange}
                                        // {...error.cekProvider}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-lg-6'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>No. Lot</Form.Label>
                                    <Form.Control
                                        type="text"
                                        onChange={ (e) => setLot(e.target.value) }
                                    />
                                </Form.Group>
                            </div>

                            <div className='col-lg-6'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Expired</Form.Label>
                                    <Form.Control
                                        type="date"
                                        onChange={ (e) => setExpired(e.target.value) }
                                    />
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
