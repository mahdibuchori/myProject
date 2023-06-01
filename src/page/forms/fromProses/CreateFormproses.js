import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner'
import './formProses.css';
import Swal from "sweetalert2";
import Select from 'react-select';
import id from 'date-fns/locale/id';
import { formatInTimeZone } from 'date-fns-tz';
// import { API_AUTH } from '../../../apis/apisData';
import { NumericFormat } from 'react-number-format';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import { Accordion, Breadcrumb, Button, Card, Col, Container, Form, InputGroup, Modal, Row, Stack } from 'react-bootstrap';
import useProviderStore, {selectProvider, selectFetchProvider, selectProviderReady} from '../../../store/listProvider';

export const CreateFormproses = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const userData = useAuthStore(selectUser);
    const newProvider = useProviderStore(selectProvider);
    const fetchProvider = useProviderStore(selectFetchProvider);
    const providerReady = useProviderStore(selectProviderReady);

    const [isLoading, setIsLoading] = useState(false);
    const [dataReady, setDataReady] = useState(false);
    const [show, setShow] = useState(false);

    const [pengajuan, setPengajuan] = useState("");
    const [kode, setKode] = useState('');
    const [provider, setProvider] = useState([]);

    const [qtyBag, setQtyBag] = useState(0);
    const [qtyTotal, setQtyTotal] = useState(0);
    const [noLot, setNoLot] = useState("");
    const [supplier, setSupplier] = useState([]);
    /* Awal */
    const [pltAwal, setPltAwal] = useState("");
    const [tingAwal, setTingAwal] = useState("");
    const [barAwal, setBarAwal] = useState("");
    const [sisaAwal, setSisaAwal] = useState("");
    const [pecAwal, setpecAwal] = useState("");
    /* Akhir */
    const [pltAkhir, setPltAkhir] = useState("");
    const [tingAkhir, setTingAkhir] = useState("");
    const [barAkhir, setBarAkhir] = useState("");
    const [sisaAkhir, setSisaAkhir] = useState("");
    const [pecAkhir, setpecAkhir] = useState("");

    useEffect(() => {
        const createUniq = () => {
            let bln = formatInTimeZone(new Date(), 'Asia/Jakarta', 'MM', { locale: id });
            let tahu = formatInTimeZone(new Date(), 'Asia/Jakarta', 'yy', { locale: id });
            const xsd = Math.random().toString(36).slice(-4);
            setKode("FPC"+xsd.toUpperCase()+bln+tahu);
        }
        createUniq()
    }, []);

    useEffect(() => {   
        fetchProvider();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsLoading(true);
        if (!providerReady) return;
        onProviderReady();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providerReady]);

    useEffect(() => {
        setIsLoading(true);
        if(location.state === null) {
            backhome(`/main/${userData.user_divisi}/Permintaan`);
            Swal.fire('Info','Harap kembali ke halaman permintaan data tidak lengkap', 'info')
        };
        
        cekData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect (() => {
        if(!dataReady) return;
        const gntiDta = async () =>{
            let bag = qtyBag;
            let pAwal,tAwal,bAwal,sAwal,pcAwal = 0;
            let pAkhir,tAkhir,bAkhir,sAkhir,pcAkhir = 0;
            if(pltAwal === ""){pAwal = 0}else{pAwal = pltAwal};
            if(tingAwal === ""){tAwal = 0}else{tAwal = tingAwal};
            if(barAwal === ""){bAwal = 0}else{bAwal = barAwal};
            if(sisaAwal === ""){sAwal = 0}else{sAwal = sisaAwal};
            if(pecAwal === ""){pcAwal = 0}else{pcAwal = pecAwal};
            if(pltAkhir === ""){pAkhir = 0}else{pAkhir = pltAkhir};
            if(tingAkhir === ""){tAkhir = 0}else{tAkhir = tingAkhir};
            if(barAkhir === ""){bAkhir = 0}else{bAkhir = barAkhir};
            if(sisaAkhir === ""){sAkhir = 0}else{sAkhir = sisaAkhir};
            if(pecAkhir === ""){pcAkhir = 0}else{pcAkhir = pecAkhir};

            const totalAwal = parseFloat(pAwal)*((parseFloat(tAwal)*parseFloat(bAwal))+parseFloat(sAwal))+parseFloat(pcAwal);
            const totalAkhir = parseFloat(pAkhir)*((parseFloat(tAkhir)*parseFloat(bAkhir))+parseFloat(sAkhir))+parseFloat(pcAkhir);
            const hasil = (totalAwal - totalAkhir)*bag;
            setQtyTotal(hasil)
            setDataReady(false);
        } 

        gntiDta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dataReady])

    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const  handleScan = (data) => {
        
        if (data) {
        //   setResult(data);
        console.log(data.text);
        if(data.text === ""){
            handleClose()
            Swal.fire('Oppss..','Data tidak ditemukan','warning');
        }
        else{
            handleClose()
            Swal.fire('Info',`Data ditemukan ${data.text}`,'warning');
        }
        }
    };
    
    const handleError = err => {
        // alert(err);
    };

    const cekData = () =>{
        console.log(location.state.data);
        let nPengajuan = 0;
        if(location.state.data.jml_item[0]?.JmlPermintaan === null || location.state.data.jml_item[0]?.JmlPermintaan === 0){
            nPengajuan = 0;
        }
        else{
            nPengajuan = (parseFloat(location.state.data.jml_item[0]?.JmlPermintaan) * 1000) /1000;
        }
        
        setPengajuan(nPengajuan);
        setIsLoading(false);
    }

    const onProviderReady = () =>{
        const results =  newProvider.filter(element => {
            return  element.nama_provider
        });
        results.sort((a, b) => a.nama_provider.localeCompare(b.nama_provider));

        let modifiedArr = results.map(function(element){
            return { value: element.nama_provider, label: element.nama_provider, id_provider: element.id_provider, nilai_tukar : element.nilai_tukar, syarat_bayar : element.syarat_bayar };
        });
        setProvider(modifiedArr);
    }

    const handleSave = () =>{
        let data = [{
            kode : kode,
            item : location.state.data.nama_item,
            qtyBag : qtyBag,
            qtyTotal : qtyTotal,
            noLot : noLot,
            supplier : `${supplier.value}`,
            pltAwal : pltAwal,
            tingAwal : tingAwal,
            barAwal : barAwal,
            sisaAwal : sisaAwal,
            pecAwal : pecAwal,
            pltAkhir : pltAkhir,
            tingAkhir : tingAkhir,
            barAkhir : barAkhir,
            sisaAkhir : sisaAkhir,
            pecAkhir : pecAkhir,
            user : userData.user_name,
            plan : userData.user_plan
        }]
        console.log(data)
    }

    const backhome = (e) =>{
        navigate(e);
    }

    const retPreview = () =>{
        navigate(`/main/${userData.user_divisi}/Permintaan/View`,{state:{
            data : location.state.data
          }});
    }

    return (
        <>
        <div className='formprosesSet'>
            <div>
                <Stack direction="horizontal" gap={3}>
                    <div className="bg-light ">
                        <Breadcrumb>
                            <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}/Permintaan`)}>Permintaan</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={() =>retPreview()}>Preview</Breadcrumb.Item>
                            <Breadcrumb.Item active>Create Form Proses</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="bg-light border ms-auto"></div>
                    <div className="vr" />
                    <div className="bg-light border">
                        <Button variant="primary"  style={{marginRight: 10}} onClick={() => retPreview()}><i class="bi bi-backspace"></i> Kembali</Button>
                    </div>
                </Stack>
                <Container>
                    <Form>
                    <Row className='mt-2'>
                        <div className="col-md-3 mb-1">
                            <Card className='mb-2'>
                                <Card.Body>
                                    <div className="row">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Id Form Proses</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={kode}
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
                                                value = {location.state.data.nama_item}
                                                // onChange = {e => setNamaBarang(e.target.value)}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                </Card.Body>
                            </Card>
                            <Card className='mb-2'>
                                <Card.Body>
                                    <div className="row">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Qty Permintaan</Form.Label>
                                            <InputGroup>
                                                <NumericFormat 
                                                    customInput={Form.Control}
                                                    thousandSeparator={true}
                                                    value={pengajuan}
                                                    disabled
                                                />
                                                <InputGroup.Text id="basic-addon2">{location.state.data.satuan}</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                    </div>
                                    <div className="row">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Qty Item /Bag</Form.Label>
                                            <InputGroup>
                                                <NumericFormat 
                                                    customInput={Form.Control}
                                                    thousandSeparator={true}
                                                    onChange={(e)=>{
                                                        setQtyBag(e.target.value);
                                                        setDataReady(true)
                                                    }}
                                                />
                                                <InputGroup.Text id="basic-addon2">{location.state.data.satuan}</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                    </div>
                                    <div className="row">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Qty Total</Form.Label>
                                            <InputGroup>
                                                <NumericFormat 
                                                    customInput={Form.Control}
                                                    thousandSeparator={true}
                                                    value={qtyTotal}
                                                    disabled
                                                />
                                                <InputGroup.Text id="basic-addon2">{location.state.data.satuan}</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-7 mb-3">
                            <Accordion defaultActiveKey={['0','1','2']} alwaysOpen>
                                <Accordion.Item eventKey="0" className='mb-3 box-fp'>
                                    <Accordion.Header>No Lot & Eksternal Provider</Accordion.Header>
                                    <Accordion.Body>
                                    <div className="row mb-1">
                                        <div className='col-lg-4'>
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>No Lot</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={noLot}
                                                        onChange={(e)=>{setNoLot(String(e.target.value).toUpperCase())}}
                                                    />
                                                    <Button 
                                                        variant="outline-primary" 
                                                        id="button-addon2"
                                                        onClick={handleShow}
                                                    >
                                                        <i className="bi bi-qr-code-scan"></i>
                                                    </Button>
                                                </InputGroup>
                                                <Form.Control.Feedback type="invalid">Harap No Lot</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className='col-lg-8'>
                                            <Form.Group as={Col} controlId="validationCustom02">
                                                <Form.Label>Eksternal Provider</Form.Label>
                                                <Select 
                                                    required
                                                    value={supplier}
                                                    onChange={(value) => {
                                                        setSupplier(value)
                                                    }}
                                                    options = {provider}
                                                    isSearchable = {true}
                                                    // isDisabled = {provideStatus}
                                                />
                                                <Form.Control.Feedback type="invalid">Harap Input Nama karyawan</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1" className='mb-3 box-fp'>
                                    <Accordion.Header>Qty Awal & Qty Akhir</Accordion.Header>
                                    <Accordion.Body>
                                    <div className="row mb-1">
                                        <div className='col-lg-6' style={{borderRight: '1px solid black'}}>
                                            <h6>Qty Awal</h6>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Palet</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setPltAwal(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Tinggi</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setTingAwal(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Baris</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setBarAwal(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Sisa</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setSisaAwal(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row mb-2">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Pecahan</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setpecAwal(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                        </div>
                                        <div className='col-lg-6'>
                                            <h6>Qty Akhir</h6>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Palet</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setPltAkhir(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Tinggi</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setTingAkhir(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Baris</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setBarAkhir(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Sisa</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setSisaAkhir(e.target.value)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row mb-2">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Pecahan</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setpecAkhir(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                        </div>
                                    </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                        
                        <div className="col-md-2 mb-5">
                            <Card className='mb-2'>
                                <Button 
                                    variant="outline-success"
                                    onClick={(e)=>handleSave(e)}
                                >
                                    <i className="bi bi-send me-2"></i>
                                    Simpan
                                </Button>
                            </Card>
                            <Card className='mb-2'>
                                <Button 
                                    variant="outline-danger"
                                    // onClick={(e)=>handlePengajuan(e)}
                                >
                                    <i className="bi bi-arrow-left-circle me-2"></i>
                                    Batal
                                </Button>
                            </Card>
                            
                        </div>
                    </Row>
                    
                    </Form>
                </Container>
            </div>
        </div>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header>
            <Modal.Title>Arahkan Kamera ke Qrcode</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: "100%" }}
                    facingMode="environment"
                />
            </Modal.Body>
        </Modal>
        {isLoading ? <LoadingPage/> : ""}
        </>
    )
}
