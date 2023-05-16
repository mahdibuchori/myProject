import React, { useState, useEffect, useCallback } from 'react';
import './EksternalProvider.css';
import Swal from "sweetalert2";
import { API_AUTH } from '../../../apis/apisData';
import Select from'../../../component/Select';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Container, Form, InputGroup } from 'react-bootstrap';

import { FileSyarat, FileTukar } from '../../../datafile/FileSelect';
import {LoadingPage} from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import useProviderStore, {selectFetchProvider, selectFalseProvider} from '../../../store/listProvider';

export const InputProvider = () => {
    const navigate = useNavigate();
    const userData = useAuthStore(selectUser);
    const [kode, setKode] = useState('');
    const [nama, setNama] = useState('');
    const [alamat, setAlamat] = useState('');
    const [ telephone, setTelephone ] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [ validated, setValidated ] = useState(false);
    
    const fetchProvider = useProviderStore(selectFetchProvider);
    const falseProvider = useProviderStore(selectFalseProvider);

    useEffect(() => {
        const createUniq = () => {
          const xsd = Math.random().toString(36).slice(-4);
          setKode("EPV"+xsd.toUpperCase());
        }
        createUniq();
    }, []);
      
    const [form, setForm] = useState({
    cekSyarat: null,
    cekTukar: null,
    });

    const onValidate = (value, name) => {
        setError((prev) => ({
            ...prev,
            [name]: { ...prev[name], errorMsg: value },
        }));
    };

    const [error, setError] = useState({
    cekSyarat: {
        isReq: true,
        errorMsg: '',
        onValidateFunc: onValidate,
    },
    cekTukar: {
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
            handleSave();
        };
    }

    const backhome = (e) =>{
        navigate(e)
    } 

    const handleSave = async () =>{
        try {
            setIsLoading(true)
            await API_AUTH.post(`/Provider`, {
              id_provider : kode,
              nama_provider : nama.toUpperCase(),
              tlp_provider : telephone,
              almt_provider : alamat.toUpperCase(),
              nilai_tukar : form.cekTukar,
              syarat_bayar : form.cekSyarat
            });
            await falseProvider();
            await fetchProvider();
            Swal.fire('Eksternal Provider Berhasil Disimpan!', navigate(`/main/${userData.user_divisi}/EksternalProvider`), 'success');
        } catch (error) {
            setIsLoading(false)
            Swal.fire('Info',`${error.response.data.message}`,'warning')
            console.log(error.response.data)
        }
    }

    const changeKode = () =>{
        const xsd = Math.random().toString(36).slice(-4);
        setKode("EPV"+xsd.toUpperCase());
    }
  return (
    <>
    <div className='eksternalProvider mt-5'>
        <div className='eksternalProvider-item-top'>
            <div>
            <Breadcrumb>
                <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                <Breadcrumb.Item onClick={() => backhome(`/main/${userData.user_divisi}/EksternalProvider`)}>Provider</Breadcrumb.Item>
                <Breadcrumb.Item active>Create</Breadcrumb.Item>
            </Breadcrumb>
            </div>
        </div>
        <Container>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between align-items-lg-center py-2 flex-column flex-lg-row">
                <h2 className="h5 mb-2 mb-lg-0">Create New Eksternal Provider</h2>
            </div>
            <div className="row">
                <div className='col-lg-4'>
                    <Card className='mb-4'>
                        <Card.Body>
                            <div className="row">
                                <div className='col-lg-12 mb-3'>
                                    <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>ID Provider</Form.Label>
                                    
                                    <InputGroup>
                                        <Form.Control
                                            required
                                            type="text"
                                            disabled
                                            value={kode}
                                        />
                                        <Button id="button-addon1" onClick={()=>changeKode()}>
                                            <i className="bi bi-arrow-repeat"></i>
                                        </Button>
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className='col-lg-12 mb-3'>
                                    <Form.Group as={Col} controlId="validationCustom02">
                                    <Form.Label>Eksternal Provider</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        value={nama.toUpperCase()}
                                        onChange={ (e) => setNama(e.target.value) }
                                    />
                                    <Form.Control.Feedback type="invalid">Harap Input Nama Material</Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className='col-lg-12 mb-3'>
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>No. Telephone Provider</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={telephone}
                                            onChange={(e) =>setTelephone(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </Card.Body>
                    </Card> 
                </div>
                <div className='col-lg-8'>
                    <Card className='mb-2'>
                        <Card.Body>
                        <div className="row">
                            <div className='col-lg-6'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Syarat Pembayaran</Form.Label>
                                    <Select
                                        title={"syarat"}
                                        name={"cekSyarat"}
                                        value={form.cekSyarat}
                                        options={FileSyarat}
                                        onChangeFunc={onHandleChange}
                                        {...error.cekSyarat}
                                    />
                                </Form.Group>
                            </div>

                            <div className='col-lg-6'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Nilai Tukar</Form.Label>
                                    <Select
                                        title={"nilai tukar"}
                                        name={"cekTukar"}
                                        value={form.cekTukar}
                                        options={FileTukar}
                                        onChangeFunc={onHandleChange}
                                        {...error.cekTukar}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                        </Card.Body>
                    </Card>

                    <Card className='mb-2'>
                        <Card.Body>
                        <div className="row">
                            <div className='col-lg-12'>
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Alamat Provider</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        value={alamat.toUpperCase()}
                                        onChange={(e) =>setAlamat(e.target.value)}
                                        rows={3} 
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
