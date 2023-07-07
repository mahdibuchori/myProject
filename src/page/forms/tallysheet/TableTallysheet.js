import React, {useEffect, useMemo, useState} from 'react';
import './tallysheet.css';
import Swal from "sweetalert2";
import id from 'date-fns/locale/id';
import { formatInTimeZone } from 'date-fns-tz';
import { useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import CreatableSelect from 'react-select/creatable';
import { Badge, Breadcrumb, Button, Card, Col, Dropdown, Form, InputGroup, ListGroup, Modal, Row, Stack, Tab, Tabs } from 'react-bootstrap';

import { FileTally } from '../../../datafile/FileSelect';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import useProviderStore, {selectProvider, selectFetchProvider, selectProviderReady} from '../../../store/listProvider';
import useTallyStore, { selectLotTally, selectFetchLotTally, selectLottallyReady, selectFalseLotTally, selectFalseTallyId } from '../../../store/ListTally';


export const TableTallysheet = () => {
    let navigate = useNavigate();
  
    const userData = useAuthStore(selectUser);
    const tallyData = useTallyStore(selectLotTally);
    const fetchTally = useTallyStore(selectFetchLotTally);
    const tallyReady = useTallyStore(selectLottallyReady);
    const tallyFalse = useTallyStore(selectFalseLotTally);
    const tallyFalseId = useTallyStore(selectFalseTallyId);

    const newProvider = useProviderStore(selectProvider);
    const fetchProvider = useProviderStore(selectFetchProvider);
    const providerReady = useProviderStore(selectProviderReady);

    const [bulan, setBulan] = useState();
    const [nolot, setNolot] = useState('');
    const [key, setKey] = useState('A-ID' );
    const [provider, setProvider] = useState([]);
    const [bonlesAi, setBonlesAi] = useState([]);
    const [bonlesAik, setBonlesAik] = useState([]);
    const [bonlesAii, setbonlesAii] = useState([]);
    const [bonlesMdm, setbonlesMdm] = useState([]);
    const [garam, setGaram] = useState([]);
    const [lain, setLain] = useState([]);
    const [namaItem, setNamaItem] = useState();
    const [potKarung, setPotKarung] = useState(0);
    const [supplier, setSupplier] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);

    const containerStyle = useMemo(() => ({ Width: '100%', Height: '100%' }), []);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => { 
        setIsLoading(true);
        tallyFalse();
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const day = date.getDate();
        let bb = String(month).padStart(2, '0');
        let dd = String(day).padStart(2, '0');
        let yy = formatInTimeZone(new Date(), 'Asia/Jakarta', 'yy', { locale: id });
        setBulan(`${year}-${bb}`);
        fetchTally(`${year}-${bb}`, userData.user_plan);
        switch (month) {
            case 1:
                setNolot(`A-${dd}-${yy}`)
                break;
            case 2:
                setNolot(`B-${dd}-${yy}`)
                break;
            case 3:
                setNolot(`C-${dd}-${yy}`)
                break;
            case 4:
                setNolot(`D-${dd}-${yy}`)
                break;
            case 5:
                setNolot(`$E-${dd}-${yy}`)
                break;
            case 6:
                setNolot(`F-${dd}-${yy}`)
                break;
            case 7:
                setNolot(`G-${dd}-${yy}`)
                break;
            case 8:
                setNolot(`H-${dd}-${yy}`)
                break;
            case 9:
                setNolot(`I-${dd}-${yy}`)
                break;
            case 10:
                setNolot(`J-${dd}-${yy}`)
                break;
            case 11:
                setNolot(`K-${dd}-${yy}`)
                break;
            case 12:
                setNolot(`L-${dd}-${yy}`)
                break;
            default:
                setNolot(`M-${dd}-${yy}`)
        }
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // setIsLoading(true);
        if (!tallyReady) return;
        listTally()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tallyReady]);

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

    const onSetDate =async (event) => {
        setIsLoading(true)
        tallyFalse();
        setBulan(event.target.value);
        await fetchTally(event.target.value, userData.user_plan);
    }

    const listTally = () =>{
        try {
            const resultx = Object.values(tallyData.reduce((r, e) => {
                let k = `${e.no_tally}`;
                let total = parseFloat(e.qty_tally);
                let terpakai = 0;
                let qtyPakai = 0;
                if(e.status !== ""){
                    terpakai = 1;
                    qtyPakai = total;
                }
                if(!r[k]) r[k] = {...e, count: 1, total : total, terpakai : terpakai, qtyPakai : qtyPakai}
                else {
                    r[k].count += 1 ;
                    r[k].total += parseFloat(total) ;
                    r[k].terpakai += terpakai ;
                    r[k].qtyPakai += parseFloat(qtyPakai) ;
                }
                return r;
            }, {}));
                
            const bAid = resultx.filter(x => x.item.toUpperCase() === "A-ID");
            const bAidk = resultx.filter(x => x.item.toUpperCase() === "A-IDK");
            const bAiid = resultx.filter(x => x.item.toUpperCase() === "A-IID");  
            const mmdm = resultx.filter(x => x.item.toUpperCase() === "M4");
            const grm = resultx.filter(x => x.item.toUpperCase() === "K4"); 
            const lln = resultx.filter(x => x.item.toUpperCase() !== "A-ID" && x.item.toUpperCase() !== "A-IID" && x.item.toUpperCase() !== "M4" && x.item.toUpperCase() !== "K4");   

            setBonlesAi(bAid);
            setBonlesAik(bAidk)
            setbonlesAii(bAiid);
            setbonlesMdm(mmdm);
            setGaram(grm)
            setLain(lln)
            setIsLoading(false);
        } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Pengambilan Data Pengadaan Gagal!',
            footer: error.message
        })
        setIsLoading(false);
        }
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

    const handelSelect = (e) =>{
        setNamaItem(e)
    }
    
    const handleSubmit  = () =>{
        const date = new Date();
        const month = date.getMonth() + 1;
        let bb = String(month).padStart(2, '0');
        let yy = formatInTimeZone(new Date(), 'Asia/Jakarta', 'yy', { locale: id });
        const xsd = Math.random().toString(36).slice(-4);
        let jns = "";
        let nItem = namaItem.toUpperCase()
        if(nItem !== "A-ID" && nItem !== "A-IID" && nItem !== "M4" && nItem !== "K4"){
            jns = "LL";
        }
        else{
            let xy = nItem.replace("-","");
            jns = xy;
        }
        let data = {
            no_tally : `${jns}${xsd.toUpperCase()}${bb}${yy}`,
            id_tally : `${xsd.toUpperCase()}${bb}${yy}`,
            item : nItem,
            nolot : nolot,
            potKar : potKarung,
            provider : supplier,
            bulan_tahun : bulan
        }
        navigate(`/main/${userData.user_divisi}/Tallysheet/Create`,{state:{
            data : data
          }});
    }
    
    const handlePreview =async (e) =>{
        try {
            await tallyFalseId()
            const result = Object.values(tallyData.reduce((r, e) => {
                let k = `${e.no_tally}`;
                let total = parseFloat(e.qty_tally);
                let terpakai = 0;
                let qtyPakai = 0;
                if(e.status !== ""){
                    terpakai = 1;
                    qtyPakai = total;
                }
                if(!r[k]) r[k] = {...e, count: 1, total : total, terpakai : terpakai, qtyPakai : qtyPakai}
                else {
                    r[k].count += 1 ;
                    r[k].total += parseFloat(total) ;
                    r[k].terpakai += terpakai ;
                    r[k].qtyPakai += parseFloat(qtyPakai) ;
                }
                return r;
            }, {}));
            const item = result.filter(x => x.no_tally === e);
            console.log(item)
            let idTall = item[0].id_tally.split('-');
            let data = {
                no_tally : item[0].no_tally,
                id_tally : idTall[0],
                item : item[0].item,
                nolot : item[0].no_lot,
                potKar : item[0].potong_karung,
                provider : item[0].supplier,
                bulan_tahun : item[0].bulan_tahun,
                petugas_tally : item[0].petugas_tally,
                srtJlan : item[0].srtJlan,
                plan : item[0].plan
            }
            console.log(data);
            navigate(`/main/${userData.user_divisi}/Tallysheet/Preview`,{state:{
                data : data
            }});
        } catch (error) {
            
        }
    }
    
    const backhome = (e) =>{
        navigate(e)
    }
  return (
    <>
    <div style={{containerStyle}} className='containerStyle'>
        <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
            <div>
                <Breadcrumb className="m-2">
                    <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                    <Breadcrumb.Item active>List Tallysheet</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className=" ms-auto">
                <div style={{marginRight: 10, display:'flex'}}>
                    <InputGroup variant="outline-primary">
                        <Form.Control
                            type="month"
                            // value={`2023-03`}
                            value={bulan}
                            min="2020-08"
                            onChange={(e) =>onSetDate(e)}
                        />
                    </InputGroup>
                
                </div>
            </div>
            <div className="vr" />
            <div>
                <Dropdown>
                    <Dropdown.Toggle variant="primary">
                    Menu
                    </Dropdown.Toggle>
                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item onClick={handleShow}><i class="bi bi-pencil"></i> Create</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item ><i className="bi bi-printer"></i> Print</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item><i className="bi bi-arrow-clockwise"></i> Refresh</Dropdown.Item>
                        
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </Stack>

        <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => {
                setKey(k);
                listTally();
            }}
            className="mb-1 p-1"
        >

        <Tab eventKey="A-ID" title="A-ID">
            <Row xs={1} md={4} className="g-4">
                {bonlesAi.map((card, i) => {
                    let tglTally = card.tgl_tally.split("-");
                    const tallyTgl = `${tglTally[2]}-${tglTally[1]}-${tglTally[0]}`;
                    let tAwal = parseFloat(card.total);
                    let tKrng = card.count * parseFloat(card.potong_karung);
                    let tAkhir = parseFloat(tAwal - tKrng).toFixed(2);
                    let tpakai = parseFloat(card.qtyPakai);
                    let tKrngPakai = parseFloat(card.qtyPakai) * parseFloat(card.potong_karung);
                    let tAkhirPakai = ((parseFloat(tAwal - tKrng)) - parseFloat(tpakai - tKrngPakai)).toFixed(2);

                    return(
                        <Col>
                            <Card>
                                <Card.Header className={"text-center bg-primary text-white"}>{`${card.item} ${card.no_lot}`}</Card.Header>
                                <ListGroup as="ol">
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div className="fw-bold">Tgl Tally</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {tallyTgl}
                                        </Badge>
                                    </ListGroup.Item>

                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Karung</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {card.count} Q
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Qty</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {`${tAkhir} ${card.unit}`}
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Pemakaian</div>
                                        </div>
                                        <Badge bg="danger" className="fw-bold">
                                        {`${card.terpakai} Q`}
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Sisa</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {`${tAkhirPakai} ${card.unit}`}
                                        </Badge>
                                    </ListGroup.Item>
                                </ListGroup>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end p-1">
                                    <Button type="submit" className="btn btn-primary" onClick={e => handlePreview(card.no_tally)}>
                                        Cek Tally <i className="bi bi-arrow-right"></i>
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    )

                })}
            </Row>
        </Tab>
        <Tab eventKey="A-IDK" title="A-IDK">
            <Row xs={1} md={4} className="g-4">
                {bonlesAik.map((card, i) => {
                    let tglTally = card.tgl_tally.split("-");
                    const tallyTgl = `${tglTally[2]}-${tglTally[1]}-${tglTally[0]}`;
                    let tAwal = parseFloat(card.total);
                    let tKrng = card.count * parseFloat(card.potong_karung);
                    let tAkhir = parseFloat(tAwal - tKrng).toFixed(2);
                    let tpakai = parseFloat(card.qtyPakai);
                    let tKrngPakai = parseFloat(card.qtyPakai) * parseFloat(card.potong_karung);
                    let tAkhirPakai = ((parseFloat(tAwal - tKrng)) - parseFloat(tpakai - tKrngPakai)).toFixed(2);

                    return(
                        <Col>
                            <Card>
                                <Card.Header className={"text-center bg-primary text-white"}>{`${card.item} ${card.no_lot}`}</Card.Header>
                                <ListGroup as="ol">
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div className="fw-bold">Tgl Tally</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {tallyTgl}
                                        </Badge>
                                    </ListGroup.Item>

                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Karung</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {card.count} Q
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Qty</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {`${tAkhir} ${card.unit}`}
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Pemakaian</div>
                                        </div>
                                        <Badge bg="danger" className="fw-bold">
                                        {`${card.terpakai} Q`}
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Sisa</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {`${tAkhirPakai} ${card.unit}`}
                                        </Badge>
                                    </ListGroup.Item>
                                </ListGroup>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end p-1">
                                    <Button type="submit" className="btn btn-primary" onClick={e => handlePreview(card.no_tally)}>
                                        Cek Tally <i className="bi bi-arrow-right"></i>
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    )

                })}
            </Row>
        </Tab>
        <Tab eventKey="A-IID" title="A-IID">
            <Row xs={1} md={4} className="g-4">
                {bonlesAii.map((card, i) => {
                    let tglTally = card.tgl_tally.split("-");
                    const tallyTgl = `${tglTally[2]}-${tglTally[1]}-${tglTally[0]}`;
                    let tAwal = parseFloat(card.total);
                    let tKrng = card.count * parseFloat(card.potong_karung);
                    let tAkhir = parseFloat(tAwal - tKrng).toFixed(2);
                    let tpakai = parseFloat(card.qtyPakai);
                    let tKrngPakai = parseFloat(card.qtyPakai) * parseFloat(card.potong_karung);
                    let tAkhirPakai = ((parseFloat(tAwal - tKrng)) - parseFloat(tpakai - tKrngPakai)).toFixed(2);

                    return(
                        <Col>
                            <Card>
                                <Card.Header className={"text-center bg-primary text-white"}>{`${card.item} ${card.no_lot}`}</Card.Header>
                                <ListGroup as="ol">
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div className="fw-bold">Tgl Tally</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {tallyTgl}
                                        </Badge>
                                    </ListGroup.Item>

                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Karung</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {card.count} Q
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Qty</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {`${tAkhir} ${card.unit}`}
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Pemakaian</div>
                                        </div>
                                        <Badge bg="danger" className="fw-bold">
                                        {`${card.terpakai} Q`}
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Sisa</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {`${tAkhirPakai} ${card.unit}`}
                                        </Badge>
                                    </ListGroup.Item>
                                </ListGroup>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end p-1">
                                    <Button type="submit" className="btn btn-primary" onClick={e => handlePreview(card.no_tally)}>
                                        Cek Tally <i className="bi bi-arrow-right"></i>
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    )

                })}
            </Row>
        </Tab>
        <Tab eventKey="M4" title="M4">
            <Row xs={1} md={4} className="g-4">
                {bonlesMdm.map((card, i) => {
                    let tglTally = card.tgl_tally.split("-");
                    const tallyTgl = `${tglTally[2]}-${tglTally[1]}-${tglTally[0]}`;
                    let tAwal = parseFloat(card.total);
                    let tKrng = card.count * parseFloat(card.potong_karung);
                    let tAkhir = parseFloat(tAwal - tKrng).toFixed(2);
                    let tpakai = parseFloat(card.qtyPakai);
                    let tKrngPakai = parseFloat(card.qtyPakai) * parseFloat(card.potong_karung);
                    let tAkhirPakai = ((parseFloat(tAwal - tKrng)) - parseFloat(tpakai - tKrngPakai)).toFixed(2);

                    return(
                        <Col>
                            <Card>
                                <Card.Header className={"text-center bg-primary text-white"}>{`${card.item} ${card.no_lot}`}</Card.Header>
                                <ListGroup as="ol">
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div className="fw-bold">Tgl Tally</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {tallyTgl}
                                        </Badge>
                                    </ListGroup.Item>

                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Karung</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {card.count} Q
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Qty</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {`${tAkhir} ${card.unit}`}
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Pemakaian</div>
                                        </div>
                                        <Badge bg="danger" className="fw-bold">
                                        {`${card.terpakai} Q`}
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Sisa</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {`${tAkhirPakai} ${card.unit}`}
                                        </Badge>
                                    </ListGroup.Item>
                                </ListGroup>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end p-1">
                                    <Button type="submit" className="btn btn-primary" onClick={e => handlePreview(card.no_tally)}>
                                        Cek Tally <i className="bi bi-arrow-right"></i>
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    )

                })}
            </Row>
        </Tab>
        <Tab eventKey="K4" title="K4">
            <Row xs={1} md={4} className="g-4">
                {garam.map((card, i) => {
                    let tglTally = card.tgl_tally.split("-");
                    const tallyTgl = `${tglTally[2]}-${tglTally[1]}-${tglTally[0]}`;
                    let tAwal = parseFloat(card.total);
                    let tKrng = card.count * parseFloat(card.potong_karung);
                    let tAkhir = parseFloat(tAwal - tKrng).toFixed(2);
                    let tpakai = parseFloat(card.qtyPakai);
                    let tKrngPakai = parseFloat(card.qtyPakai) * parseFloat(card.potong_karung);
                    let tAkhirPakai = ((parseFloat(tAwal - tKrng)) - parseFloat(tpakai - tKrngPakai)).toFixed(2);

                    return(
                        <Col>
                            <Card>
                                <Card.Header className={"text-center bg-primary text-white"}>{`${card.item} ${card.no_lot}`}</Card.Header>
                                <ListGroup as="ol">
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div className="fw-bold">Tgl Tally</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {tallyTgl}
                                        </Badge>
                                    </ListGroup.Item>

                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Karung</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {card.count} Q
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Qty</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {`${tAkhir} ${card.unit}`}
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Pemakaian</div>
                                        </div>
                                        <Badge bg="danger" className="fw-bold">
                                        {`${card.terpakai} Q`}
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Sisa</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {`${tAkhirPakai} ${card.unit}`}
                                        </Badge>
                                    </ListGroup.Item>
                                </ListGroup>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end p-1">
                                    <Button type="submit" className="btn btn-primary" onClick={e => handlePreview(card.no_tally)}>
                                        Cek Tally <i className="bi bi-arrow-right"></i>
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    )

                })}
            </Row>
        </Tab>
        <Tab eventKey="Lain-Lain" title="Lain-Lain">
            <Row xs={1} md={4} className="g-4">
                {lain.map((card, i) => {
                    let tglTally = card.tgl_tally.split("-");
                    const tallyTgl = `${tglTally[2]}-${tglTally[1]}-${tglTally[0]}`;
                    let tAwal = parseFloat(card.total);
                    let tKrng = card.count * parseFloat(card.potong_karung);
                    let tAkhir = parseFloat(tAwal - tKrng).toFixed(2);
                    let tpakai = parseFloat(card.qtyPakai);
                    let tKrngPakai = parseFloat(card.qtyPakai) * parseFloat(card.potong_karung);
                    let tAkhirPakai = ((parseFloat(tAwal - tKrng)) - parseFloat(tpakai - tKrngPakai)).toFixed(2);

                    return(
                        <Col>
                            <Card>
                                <Card.Header className={"text-center bg-primary text-white"}>{`${card.item} ${card.no_lot}`}</Card.Header>
                                <ListGroup as="ol">
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div className="fw-bold">Tgl Tally</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {tallyTgl}
                                        </Badge>
                                    </ListGroup.Item>

                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Karung</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {card.count} Q
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Qty</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {`${tAkhir} ${card.unit}`}
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Pemakaian</div>
                                        </div>
                                        <Badge bg="danger" className="fw-bold">
                                        {`${card.terpakai} Q`}
                                        </Badge>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        <div>Total Sisa</div>
                                        </div>
                                        <Badge bg="light" className="text-dark fw-bold">
                                        {`${tAkhirPakai} ${card.unit}`}
                                        </Badge>
                                    </ListGroup.Item>
                                </ListGroup>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end p-1">
                                    <Button type="submit" className="btn btn-primary" onClick={e => handlePreview(card.no_tally)}>
                                        Cek Tally <i className="bi bi-arrow-right"></i>
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    )

                })}
            </Row>  
        </Tab>

        </Tabs>
    </div>

    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
    >
        <Modal.Header closeButton>
        <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                    <Form.Label>Item</Form.Label>
                    <CreatableSelect 
                        options={FileTally} 
                        onChange={e => handelSelect(e.value)}
                        isClearable 
                    />
                </Form.Group>
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                    <Form.Label>No Lot</Form.Label>
                    <Form.Control
                        type="text"
                        value={nolot}
                        disabled
                    />
                </Form.Group>
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                    <Form.Label>Potong Karung</Form.Label>
                    <NumericFormat 
                        customInput={Form.Control}
                        thousandSeparator={true}
                        value={potKarung}
                        onChange ={e => {
                            setPotKarung(e.target.value)
                            console.log(e.target.value)
                        }}
                    />
                </Form.Group>
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                    <Form.Label>Eksternal Provider</Form.Label>
                    <CreatableSelect 
                        options={provider} 
                        onChange={e => setSupplier(String(e.value).toUpperCase())}
                        isClearable 
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        <Button variant="primary" onClick={e => handleSubmit()}>Understood</Button>
        </Modal.Footer>
    </Modal>
    
    
    {isLoading ? <LoadingPage/> : ""}
    </>
  )
}
