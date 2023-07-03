import React, {useEffect, useState} from 'react'
import Swal from "sweetalert2";
import { NumericFormat } from 'react-number-format';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_AUTH } from '../../../apis/apisData';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import { Accordion, Breadcrumb, Button, Card, Col, Container, FloatingLabel, Form, ListGroup, Modal } from 'react-bootstrap';

import useAuthStore, { selectUser } from '../../../store/authLogin';
import useTallyStore, { selectTallyByID, selectFetchTallyId, selectFalseTallyId, selectTallyIdReady } from '../../../store/ListTally';

export const CreateTallysheet = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userData = useAuthStore(selectUser);
    const tallyData = useTallyStore(selectTallyByID);
    const fetchTally = useTallyStore(selectFetchTallyId);
    const tallyFalse = useTallyStore(selectFalseTallyId);
    const tallyReady = useTallyStore(selectTallyIdReady);

    const [idTally, setIdTally] = useState('');
    const [karung, setKarung] = useState(0);
    const [qtyTotal, setQtyTotal] = useState(0);
    const [qtyData, setQtyData] = useState(0);
    const [mdlQty, setMdlQty] = useState(0);
    const [mdlId, setMdlId] = useState('');

    const [dataFile, setdataFile] = useState([]);

    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    useEffect(() => {   
        fetchTally(location.state.data.no_tally, userData.user_plan);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsLoading(true);
        // console.log(tallyReady)
        if (!tallyReady) return;
        onDataReady();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tallyReady]);

    const onDataReady = () =>{
        // console.log(location.state.data);
        // console.log(tallyData);
        const xsd = (Math.random().toString(36).slice(-2)).toUpperCase();
        setIdTally(`${location.state.data.id_tally}-${xsd}`);
        setKarung(tallyData.length);
        if(tallyData.length === 0 ){
            setQtyTotal(0)
        }
        else{
            const sum = tallyData.reduce((accumulator, value) => {
                return accumulator + parseFloat(value.qty_tally);
            }, 0);
            setQtyTotal(parseFloat(sum).toFixed(2))
        }

        const result = tallyData.map(e => {
                const d = new Date(e.tambahan)
                return({ id_tally: e.id_tally, qty_tally: e.qty_tally, tambahan: d })
            }    
        );
        // console.log(result)

        result.sort(function(a,b){
            return new Date(b.tambahan) - new Date(a.tambahan)
          })
        setdataFile(result)
        //   console.log(result)
        
        setIsLoading(false);
    }

    const handleSubmit =async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        // console.log(form.checkValidity());
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        }
        else{
            const date = new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const day = date.getDate();
            let bb = String(month).padStart(2, '0');
            let dd = String(day).padStart(2, '0');
            setIsLoading(true);
            try {
                /* console.log({
                    id_tally : idTally,
                    no_tally : location.state.data.no_tally,	
                    bulan_tahun	: location.state.data.bulan_tahun,
                    item : location.state.data.item,	
                    no_lot : location.state.data.nolot,	
                    qty_tally :	`${qtyData}`,	
                    supplier : location.state.data.provider,
                    tgl_tally : `${year}-${bb}-${dd}`,	
                    petugas_tally : userData.user_name,	
                    potong_karung : `${location.state.data.potKar}`,
                    plan : userData.user_plan,
                }) */
                const next = await API_AUTH.post(`/saveTally`, {
                    id_tally : idTally,
                    no_tally : location.state.data.no_tally,	
                    bulan_tahun	: location.state.data.bulan_tahun,
                    item : location.state.data.item,	
                    no_lot : location.state.data.nolot,	
                    qty_tally :	`${qtyData}`,	
                    supplier : location.state.data.provider,
                    tgl_tally : `${year}-${bb}-${dd}`,	
                    petugas_tally : userData.user_name,	
                    potong_karung : `${location.state.data.potKar}`,
                    tambahan : date, //`${hh}:${mm}:${ss}`
                    plan : userData.user_plan,
                });
                setQtyData('');
                setdataFile([]);
                await tallyFalse();
                fetchTally(location.state.data.no_tally, userData.user_plan);
                Swal.fire(`${next.data.success}`, "", 'success');
                onDataReady();
            } catch (error) {
                Swal.fire(`${error.response.data.message}`, "", 'error');
                setIsLoading(false)
            }
        }
    }
     
    const handleShow = (e,i) =>{
        setMdlId(i)
        setMdlQty(parseFloat(e))
        setShow(true);
    }
    
    const handleEdit = async (e) =>{
        setIsLoading(true);
            try {
                /* console.log({
                    status : e,
                    id_tally : mdlId,
                    no_tally : location.state.data.no_tally,
                    qty : mdlQty
                }) */
                const next = await API_AUTH.put(`/updateTally/${location.state.data.no_tally}`, {
                    status : e,
                    id_tally : mdlId,
                    no_tally : location.state.data.no_tally,
                    qty_tally :	`${mdlQty}`,
                    plan : userData.user_plan,
                });
                await tallyFalse();
                fetchTally(location.state.data.no_tally, userData.user_plan);
                handleClose();
                Swal.fire(`${next.data.success}`, "", 'success');
                onDataReady();
            } catch (error) {
                Swal.fire(`${error.response.data.message}`, "", 'error');
                setIsLoading(false)
            }
        // id_tally, no_tally, qty_tally, plan, status
    }
    
    const cekNumber = (e) =>{
        setQtyData(e)
    }

    const backhome = (e) =>{
        fetchTally();
        navigate(e);
    }

  return (
        <>
        <div className='tallysheetSet'>
            <div className='tallysheetSet-item-top'>
                <div>
                    <Breadcrumb  bg="light">
                    <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => backhome(`/main/${userData.user_divisi}/Tallysheet`)}>List Tallysheet</Breadcrumb.Item>
                    <Breadcrumb.Item active>Create</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <Container className='mt-2' fluid>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-4 mb-1">
                            <Accordion defaultActiveKey={['0']} alwaysOpen>
                                <Accordion.Item eventKey="0" className='mb-2 box-fp'>
                                    <Accordion.Header>Data Item</Accordion.Header>
                                    <Accordion.Body>
                                        <div className="row">
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>No Tally</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={location.state.data.no_tally}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="row">
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Nama Item</Form.Label>
                                                <Form.Control 
                                                    as="textarea" 
                                                    aria-label="With textarea" 
                                                    rows={1}
                                                    value = {location.state.data.item}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="row">
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>No. Lot</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={location.state.data.nolot}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="row">
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Potong Karung</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={location.state.data.potKar}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="row">
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Eksterna Provider</Form.Label>
                                                <Form.Control 
                                                    as="textarea" 
                                                    aria-label="With textarea" 
                                                    rows={2}
                                                    value = {location.state.data.provider}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </div>
                                    </Accordion.Body>                       
                                </Accordion.Item>
                            </Accordion>
                        </div>
                        <div className="col-md-8 mb-1">
                            <Card className="mb-2">
                                <Card.Body>
                                    <div className="row p-2">
                                        <div className='col-sm-6 col-md-4'>
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>ID Tallysheet</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={idTally}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </div>

                                        <div className='col-sm-6 col-md-4'>
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Total Karung</Form.Label>
                                                <NumericFormat 
                                                    customInput={Form.Control}
                                                    thousandSeparator={true}
                                                    value={qtyData}
                                                    onValueChange ={e => {
                                                        cekNumber(e.value)
                                                    }}
                                                />
                                            </Form.Group>
                                        </div>

                                        <div className='col-sm-6 col-md-4'>
                                            <Form.Group as={Col} controlId="validationCustom02">
                                                <Form.Label></Form.Label>
                                                <Button 
                                                    type="submit" 
                                                    className='mt-2'
                                                >
                                                    <i className="bi bi-send"></i> Simpan
                                                </Button>
                                            </Form.Group>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                            <Card className="mb-3">
                                <Card.Body>
                                <div className="row p-2">
                                    <div className='col-sm-6 col-md-6'>
                                        <FloatingLabel controlId="floatingPasswords" label="Total Karung">
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={karung}
                                                disabled
                                            />
                                        </FloatingLabel>
                                    </div>
                                    <div className='col-sm-6 col-md-6'>
                                        <FloatingLabel controlId="floatingPassword" label="Total Qty">
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={qtyTotal}
                                                disabled
                                            />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                
                                </Card.Body>
                            </Card>

                            <ListGroup as="ol">
                                {dataFile.map((x, i) => {
                                    let n = dataFile.length - i
                                    return(
                                        <ListGroup.Item as="li" className='d-flex mb-3 justify-content-between align-items-center flex-wrap bs-box'>
                                        <h3 className="mb-0 text-dark">{n}. {x.qty_tally}</h3>
                                        <Button onClick={e => handleShow(x.qty_tally, x.id_tally)}>
                                            <i className="bi bi-pencil"></i> Edit
                                        </Button>
                                        </ListGroup.Item>

                                    )
                                })}
                            </ListGroup>
                            
                        </div>
                    </div>
                </Form>
            </Container>
        </div>

        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
            <Modal.Title>Edit Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>ID Tallysheet</Form.Label>
                        <Form.Control
                            type="text"
                            value={mdlId}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label>Total Karung</Form.Label>
                        <NumericFormat 
                            customInput={Form.Control}
                            thousandSeparator={true}
                            value={mdlQty}
                            onValueChange ={e => {
                                setMdlQty(e.value)
                            }}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                <i className="bi bi-backspace-fill"></i>&nbsp;Close
            </Button>
            <Button variant="danger" className='mx-4'  onClick={e => handleEdit('hapus')}>
                <i className="bi bi-trash"></i>&nbsp;Hapus
            </Button>
            <Button variant="primary" onClick={e => handleEdit('edit')}>
            <i className="bi bi-pencil"></i>&nbsp;Edit
            </Button>
            </Modal.Footer>
        </Modal>

        {isLoading ? <LoadingPage /> : ""}
        </>
  )
}
