import React, { useMemo, useRef, useState, useEffect } from 'react';
import './pengadaan.css';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import { Breadcrumb, Button, Card, Col, Dropdown, DropdownButton, Form, InputGroup, Modal, Row, Stack, Tab, Tabs } from 'react-bootstrap';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import usePengadaanStore, {selectPengadaan, selectFetchPengadaan, selectPengadaanReady, selectFalsePengadaan} from '../../../store/pengadaanBarang';

export const Tablepengadaan = ({columns}) => {
    let navigate = useNavigate();
    const gridRef = useRef();
    const userData = useAuthStore(selectUser);
    const newPengadaan = usePengadaanStore(selectPengadaan);
    const fetchPengadaan = usePengadaanStore(selectFetchPengadaan);
    const pengadaanReady = usePengadaanStore(selectPengadaanReady);
    const pengadaanFalse = usePengadaanStore(selectFalsePengadaan);

    const [key, setKey] = useState('FG');

    const [bulan, setBulan] = useState();
    
    const [rowFg, setRowFg] = useState();
    const [rowHrga, setRowHrga] = useState();
    const [rowMaintenance, setRowMaintenance] = useState();
    const [rowPpic, setRowPpic] = useState();
    const [rowProduksi, setRowProduksi] = useState();
    const [rowPurchasing, setRowPurchasing] = useState();
    const [rowQaqc, setRowQaqc] = useState();
    const [rowRnD, setrowRnD] = useState();
    const [rowSsd, setRowSsd] = useState();

    const [usFg, setUsFg] = useState(true);
    const [usHrga, setUsHrga] = useState(true);
    const [usMaintenance, setUsMaintenance] = useState(true);
    const [usPpic, setUsPpic] = useState(true);
    const [usProduksi, setUsProduksi] = useState(true);
    const [usPurchasing, setUsPurchasing] = useState(true);
    const [usQaqc, setUsQaqc] = useState(true);
    const [usSsd, setUsSsd] = useState(true);
    const [usRnd, setUsRnd] = useState(true);

    const [jmlPengajuan, setJmlPengajuan] = useState(0);
    const [jmlRevisi, setJmlRevisi] = useState(0);
    const [jmlVerify, setJmlVerify] = useState(0);
    const [jmlSelesai, setJmlSelesai] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [width, setWidth] = useState(window.innerWidth -200);
    const [height, setHeight] = useState(window.innerHeight-200);
    const containerStyle = useMemo(() => ({ Width: '100%', Height: '100%' }), []);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [nilaiMin, setNilaiMin] = useState("");
    const [nilaiMax, setNilaiMax] = useState("");
    const [nilaiTanggal, setNilaiTanggal] = useState("");

    const arrDiv = ['FG', 'HR-GA', 'Maintenance', 'PPIC-WH', 'Produksi', 'Purchasing', 'QAQC', 'RnD', 'SSD'];

    useEffect(() => { 
        setIsLoading(true);
        pengadaanFalse();
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        let bb = String(month).padStart(2, '0');
        setBulan(`${year}-${bb}`);
        fetchPengadaan(`${year}-${bb}`, userData.user_plan);
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // setIsLoading(true);
        if (!pengadaanReady) return;
        onGridReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pengadaanReady]);

    useEffect(()=>{
        const cekList = () => {
            const meme = userData.user_divisi;
            switch (meme) {
                case "FG":
                    setKey("FG");
                    setUsFg(false);
                    setUsHrga(true);
                    setUsMaintenance(true);
                    setUsPpic(true);
                    setUsProduksi(true);
                    setUsPurchasing(true);
                    setUsQaqc(true);
                    setUsSsd(true);
                    setUsRnd(true);
                break;
                case "HR-GA":
                    setKey("HR-GA");
                    setUsFg(true);
                    setUsHrga(false);
                    setUsMaintenance(true);
                    setUsPpic(true);
                    setUsProduksi(true);
                    setUsPurchasing(true);
                    setUsQaqc(true);
                    setUsSsd(true);
                break;
                case "Maintenance":
                    setKey("Maintenance");
                    setUsFg(true);
                    setUsHrga(true);
                    setUsMaintenance(false);
                    setUsPpic(true);
                    setUsProduksi(true);
                    setUsPurchasing(true);
                    setUsQaqc(true);
                    setUsSsd(true);
                    setUsRnd(true);
                break;
                case "PPIC-WH":
                    setKey("PPIC-WH");
                    setUsFg(true);
                    setUsHrga(true);
                    setUsMaintenance(true);
                    setUsPpic(false);
                    setUsProduksi(true);
                    setUsPurchasing(true);
                    setUsQaqc(true);
                    setUsSsd(true);
                    setUsRnd(true);
                break;
                case "Produksi":
                    setKey("Produksi");
                    setUsFg(true);
                    setUsHrga(true);
                    setUsMaintenance(true);
                    setUsPpic(true);
                    setUsProduksi(false);
                    setUsPurchasing(true);
                    setUsQaqc(true);
                    setUsSsd(true);
                    setUsRnd(true);
                break;
                case "Purchasing":
                    setKey("Purchasing");
                    setUsFg(false);
                    setUsHrga(false);
                    setUsMaintenance(false);
                    setUsPpic(false);
                    setUsProduksi(false);
                    setUsPurchasing(false);
                    setUsQaqc(false);
                    setUsSsd(false);
                    setUsRnd(false);
                break;
                case "QAQC":
                    setKey("QAQC");
                    setUsFg(true);
                    setUsHrga(true);
                    setUsMaintenance(true);
                    setUsPpic(true);
                    setUsProduksi(true);
                    setUsPurchasing(true);
                    setUsQaqc(false);
                    setUsSsd(true);
                    setUsRnd(true);
                break;
                case "RnD":
                    setKey("RnD");
                    setUsRnd(false);
                    setUsFg(true);
                    setUsHrga(true);
                    setUsMaintenance(true);
                    setUsPpic(true);
                    setUsProduksi(true);
                    setUsPurchasing(true);
                    setUsQaqc(true);
                    setUsRnd(false);
                    setUsSsd(true);
                break;
                case "SSD":
                    setKey("SSD");
                    setUsFg(true);
                    setUsHrga(true);
                    setUsMaintenance(true);
                    setUsPpic(true);
                    setUsProduksi(true);
                    setUsPurchasing(true);
                    setUsQaqc(true);
                    setUsSsd(false);
                    setUsRnd(true);
                break;
                case "Develop":
                    setKey("FG");
                    setUsFg(false);
                    setUsHrga(false);
                    setUsMaintenance(false);
                    setUsPpic(false);
                    setUsProduksi(false);
                    setUsPurchasing(false);
                    setUsQaqc(false);
                    setUsSsd(false);
                    setUsRnd(false);
                break;
                default:
                    setKey("");
                    setUsFg(true);
                    setUsHrga(true);
                    setUsMaintenance(true);
                    setUsPpic(true);
                    setUsProduksi(true);
                    setUsPurchasing(true);
                    setUsQaqc(true);
                    setUsSsd(true);
              }
        }
        cekList()
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => {
        function handleResize() {
            if(window.innerWidth >= 991){
                setWidth(window.innerWidth -200);
            }
            else{
                setWidth(window.innerWidth -20);
            }
          
          setHeight(window.innerHeight - 220);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [width,height]);

    const onGridReady = () =>{
        try {
            const fg = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "FG");
            const hrga =newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "HR-GA");
            const maintenance = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "MAINTENANCE");
            const ppic = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "PPIC-WH");
            const produksi = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "PRODUKSI");
            const purchasing =newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "PURCHASING");
            const qaqc =newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "QAQC");
            const rnd =newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "RND");
            const ssd = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "SSD");

            const jumPengajuan = newPengadaan.filter(x => x.status.toUpperCase() === "PENGAJUAN");  
            const jumRevisi = newPengadaan.filter(x => x.status.toUpperCase() === "REVISI");       
            const jumVerify = newPengadaan.filter(x => x.status.toUpperCase() === "VERIFIKASI");    
            const jumSelesai = newPengadaan.filter(x => x.status.toUpperCase() === "SELESAI");

            setRowFg(fg);
            setRowHrga(hrga);
            setRowMaintenance(maintenance);
            setRowPpic(ppic);
            setRowProduksi(produksi);
            setRowPurchasing(purchasing);
            setRowQaqc(qaqc);
            setrowRnD(rnd)
            setRowSsd(ssd);

            setJmlPengajuan(jumPengajuan.length);
            setJmlRevisi(jumRevisi.length);
            setJmlVerify(jumVerify.length);
            setJmlSelesai(jumSelesai.length);
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

    const defaultColDef = useMemo(() => {
        return {
        editable: false,
        sortable: true,
        filter: true,
        resizable: true,
        };
    }, []);

    const onSetDate =async (event) => {
        setIsLoading(true)
        pengadaanFalse();
        setBulan(event.target.value);
        await fetchPengadaan(event.target.value, userData.user_plan);
        
    }

    const handleDrop = (data,key) =>{
        const fg = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "FG" && x.status.toUpperCase() === data.toUpperCase());
        const hrga =newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "HR-GA" && x.status.toUpperCase() === data.toUpperCase());
        const maintenance = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "MAINTENANCE" && x.status.toUpperCase() === data.toUpperCase());
        const ppic = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "PPIC-WH" && x.status.toUpperCase() === data.toUpperCase());
        const produksi = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "PRODUKSI" && x.status.toUpperCase() === data.toUpperCase());
        const purchasing =newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "PURCHASING" && x.status.toUpperCase() === data.toUpperCase());
        const qaqc =newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "QAQC" && x.status.toUpperCase() === data.toUpperCase());
        const rnd =newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "RND" && x.status.toUpperCase() === data.toUpperCase());
        const ssd = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === "SSD" && x.status.toUpperCase() === data.toUpperCase());

        setRowFg(fg);
        setRowHrga(hrga);
        setRowMaintenance(maintenance);
        setRowPpic(ppic);
        setRowProduksi(produksi);
        setRowPurchasing(purchasing);
        setRowQaqc(qaqc);
        setrowRnD(rnd)
        setRowSsd(ssd);

        if(userData.user_divisi.toUpperCase() === "PURCHASING" || userData.user_divisi.toUpperCase() === "DEVELOP"){
            setKey(key)
        }
        else{
            if(key.toUpperCase() === userData.user_divisi.toUpperCase()){
                setKey(key);
            }
            else{
                Swal.fire("Info","Anda tidak memiliki akses",'warning');
            }
        }
    }

    const backhome = (e) =>{
        navigate(e)
    }

    const routeChange = (e) => {
        let path = `Create`;
        navigate(path)
    }

    const printChange = () => {
        if(userData.user_divisi === "Purchasing" || userData.user_divisi === "Develop"){

            var newDate = new Date(bulan);
            const month = newDate.getMonth() + 1;
            const year = newDate.getFullYear();
            const day = newDate.getDate();
            const bb = String(month).padStart(2, '0');
            const dd = String(day).padStart(2, '0');
            const max = new Date(year, month, 0);
            const dayMax = max.getDate();
            const ddMax = String(dayMax).padStart(2, '0');
            const nilaiMins = `${year}-${bb}-${dd}`;
            const nilaiMaxs = `${year}-${bb}-${ddMax}`; 
            setNilaiTanggal("");
            setNilaiMin(nilaiMins);
            setNilaiMax(nilaiMaxs);
            handleShow();
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Anda Tidak Memiliki Akses',
                footer: 'Harap Hubungi Divisi Purchasing'
            });
        }
        
        
    }

    const handlePrint = () =>{
        if(nilaiTanggal === ""){
            Swal.fire('Info','Harap pilih tanggal cetak pengadaan','warning');
        }
        else{
            let xDate = new Date(nilaiTanggal);
            let newPilih = xDate.toLocaleDateString("id-ID", {day: '2-digit', month: 'long', year: 'numeric'});
            const data = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === key.toUpperCase() && x.t_pengadaan === newPilih);
            const newData = data.filter(x => x.status.toUpperCase() === "SELESAI" || x.status.toUpperCase() === "VERIFIKASI");
            if(newData.length === 0){
                Swal.fire('Info',`Belum ada status data yang sudah terverifikasi atau selesai pada tanggal ${newPilih}`,'warning');
            }
            else{
                console.log(newData)
                navigate(`/main/${userData.user_divisi}/Pengadaan/Preview`,{state:{
                    data : newData,
                    tanggal : nilaiTanggal
                  }});
            }
        }
    }
  return (
    <>
    <div style={{containerStyle}} className='containerStyle'>
        <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
            <div className="bg-light">
                <Breadcrumb className="bg-light m-2">
                    <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                    <Breadcrumb.Item active>Pengadaan</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="ms-auto">
                <div style={{marginRight: 10, display:'flex'}}>
                    <InputGroup variant="outline-primary">
                        <Form.Control
                            type="month"
                            value={bulan}
                            min="2020-08"
                            onChange={(e) =>onSetDate(e)}
                        />
                    </InputGroup>
                </div>
            </div>
            <div className="vr" />
            <div className="bg-light">
                <Dropdown>
                    <Dropdown.Toggle variant="primary">
                    Menu
                    </Dropdown.Toggle>
            
                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item onClick={routeChange}><i class="bi bi-pencil"></i> Create</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={printChange}><i className="bi bi-printer"></i> Print</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item><i className="bi bi-arrow-clockwise"></i> Refresh</Dropdown.Item>
                        
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </Stack>

        <div className="row mb-1 mt-1" style={{padding: "0px 10px 0px 10px"}}>
            <div className="col-md-3">
                <Card className='mb-1'>
                    <div className="radius-10 border-start border-0 border-3 border-dark">
                        <Card.Body style={{height: "50px", padding: '8px'}}>
                            <Stack direction="horizontal" gap={3}>
                                <div>
                                    <h6>Pengajuan ({jmlPengajuan})</h6>
                                </div>
                                <div className="bg-light ms-auto">
                                    <DropdownButton id="dropdown-basic-button" variant="outline-dark" size='sm'>
                                        {arrDiv.map((x, i) => {
                                            let index = arrDiv[i].toString();
                                            let index1 = '';
                                            let index2 = '';
                                            if(index === "Semua"){
                                                index1 = newPengadaan;
                                            }
                                            else{
                                                index1 = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === index.toUpperCase() && x.status.toUpperCase() === "PENGAJUAN");
                                                
                                            }
                                            
                                            index2 = `${index} (${index1.length})`
                                            
                                            return(
                                                <Dropdown.Item onClick={(e)=> handleDrop("PENGAJUAN",index)}>{index2}</Dropdown.Item>
                                            )
                                            
                                        })}
                                    </DropdownButton>
                                </div>
                            </Stack>
                        </Card.Body>
                    </div>
                </Card>
            </div>
            <div className="col-md-3">
                <Card className='mb-1'>
                    <div className="radius-10 border-start border-0 border-3 border-warning">
                        <Card.Body style={{height: "50px", padding: '8px'}}>
                            <Stack direction="horizontal" gap={3}>
                                <div>
                                    <h6>Revisi ({jmlRevisi})</h6>
                                </div>
                                <div className="bg-light ms-auto">
                                    <DropdownButton id="dropdown-basic-button" variant="outline-warning" size='sm'>
                                        {arrDiv.map((x, i) => {
                                            let index = arrDiv[i].toString();
                                            let index1 = '';
                                            let index2 = '';
                                            if(index === "Semua"){
                                                index1 = newPengadaan;
                                            }
                                            else{
                                                index1 = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === index.toUpperCase() && x.status.toUpperCase() === "REVISI");
                                                
                                            }
                                            
                                            index2 = `${index} (${index1.length})`
                                            
                                            return(
                                                <Dropdown.Item onClick={(e)=> handleDrop("REVISI",index)}>{index2}</Dropdown.Item>
                                            )
                                            
                                        })}
                                    </DropdownButton>
                                </div>
                            </Stack>
                        </Card.Body>
                    </div>
                </Card>
            </div>
            <div className="col-md-3">
                <Card className='mb-1'>
                    <div className="radius-10 border-start border-0 border-3 border-primary">
                        <Card.Body style={{height: "50px", padding: '8px'}}>
                            <Stack direction="horizontal" gap={3}>
                                <div>
                                    <h6>Verifikasi ({jmlVerify})</h6>
                                </div>
                                <div className="bg-light ms-auto">
                                    <DropdownButton id="order" variant="outline-primary" size='sm'>
                                        {arrDiv.map((x, i) => {
                                            let index = arrDiv[i].toString();
                                            let index1 = '';
                                            let index2 = '';
                                            if(index === "Semua"){
                                                index1 = newPengadaan;
                                            }
                                            else{
                                                index1 = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === index.toUpperCase() && x.status.toUpperCase() === "VERIFIKASI");
                                                
                                            }
                                            
                                            index2 = `${index} (${index1.length})`
                                            
                                            return(
                                                <Dropdown.Item onClick={(e)=> handleDrop("VERIFIKASI",index)}>{index2}</Dropdown.Item>
                                            )
                                            
                                        })}
                                    </DropdownButton>
                                </div>
                            </Stack>
                        </Card.Body>
                    </div>
                </Card>
            </div>
            <div className="col-md-3">
                <Card className='mb-1'>
                    <div className="radius-10 border-start border-0 border-3 border-success">
                        <Card.Body style={{height: "50px", padding: '8px'}}>
                            <Stack direction="horizontal" gap={3}>
                                <div>
                                    <h6>Selesai ({jmlSelesai})</h6>
                                </div>
                                <div className="bg-light ms-auto">
                                    <DropdownButton id="dropdown-basic-button" variant="outline-success" size='sm'>
                                        {arrDiv.map((x, i) => {
                                            let index = arrDiv[i].toString();
                                            let index1 = '';
                                            let index2 = '';
                                            if(index === "Semua"){
                                                index1 = newPengadaan;
                                            }
                                            else{
                                                index1 = newPengadaan.filter(x => x.user[0].divisi.toUpperCase() === index.toUpperCase() && x.status.toUpperCase() === "SELESAI");
                                                
                                            }
                                            
                                            index2 = `${index} (${index1.length})`
                                            
                                            return(
                                                <Dropdown.Item onClick={(e)=> handleDrop("SELESAI",index)}>{index2}</Dropdown.Item>
                                            )
                                            
                                        })}
                                    </DropdownButton>
                                </div>
                                
                            </Stack>
                        </Card.Body>
                    </div>
                </Card>
            </div>
        </div>
       
        <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => {
                setKey(k);
                onGridReady();
            }}
            className="mb-1"
        >
            <Tab eventKey="FG" title="FG" disabled={usFg}>
                <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowFg}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        pagination={false}
                        // paginationPageSize={10}
                        // paginationNumberFormatter={paginationNumberFormatter}
                        // onFirstDataRendered={onFirstDataRendered}
                        cacheQuickFilter={true}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="HR-GA" title="HR-GA" disabled={usHrga}>
                <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                    <AgGridReact
                    ref={gridRef}
                    rowData={rowHrga}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    pagination={false}
                    // paginationPageSize={10}
                    // paginationNumberFormatter={paginationNumberFormatter}
                    // onFirstDataRendered={onFirstDataRendered}
                    cacheQuickFilter={true}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="Maintenance" title="Maintenance" disabled={usMaintenance}>
                <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                    <AgGridReact
                    ref={gridRef}
                    rowData={rowMaintenance}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    pagination={false}
                    // paginationPageSize={10}
                    // paginationNumberFormatter={paginationNumberFormatter}
                    // onFirstDataRendered={onFirstDataRendered}
                    cacheQuickFilter={true}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="PPIC-WH" title="PPIC-WH" disabled={usPpic}>
                <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                    <AgGridReact
                    ref={gridRef}
                    rowData={rowPpic}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    pagination={false}
                    // paginationPageSize={10}
                    // paginationNumberFormatter={paginationNumberFormatter}
                    // onFirstDataRendered={onFirstDataRendered}
                    cacheQuickFilter={true}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="Produksi" title="Produksi" disabled={usProduksi}>
                <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                    <AgGridReact
                    ref={gridRef}
                    rowData={rowProduksi}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    pagination={false}
                    // paginationPageSize={10}
                    // paginationNumberFormatter={paginationNumberFormatter}
                    // onFirstDataRendered={onFirstDataRendered}
                    cacheQuickFilter={true}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="Purchasing" title="Purchasing" disabled={usPurchasing}>
                <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                    <AgGridReact
                    ref={gridRef}
                    rowData={rowPurchasing}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    pagination={false}
                    // paginationPageSize={10}
                    // paginationNumberFormatter={paginationNumberFormatter}
                    // onFirstDataRendered={onFirstDataRendered}
                    cacheQuickFilter={true}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="QAQC" title="QAQC" disabled={usQaqc}>
                <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                    <AgGridReact
                    ref={gridRef}
                    rowData={rowQaqc}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    pagination={false}
                    // paginationPageSize={10}
                    // paginationNumberFormatter={paginationNumberFormatter}
                    // onFirstDataRendered={onFirstDataRendered}
                    cacheQuickFilter={true}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="RnD" title="RnD" disabled={usRnd}>
                <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                    <AgGridReact
                    ref={gridRef}
                    rowData={rowRnD}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    pagination={false}
                    // paginationPageSize={10}
                    // paginationNumberFormatter={paginationNumberFormatter}
                    // onFirstDataRendered={onFirstDataRendered}
                    cacheQuickFilter={true}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="SSD" title="SSD" disabled={usSsd}>
                <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                    <AgGridReact
                    ref={gridRef}
                    rowData={rowSsd}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    pagination={false}
                    // paginationPageSize={10}
                    // paginationNumberFormatter={paginationNumberFormatter}
                    // onFirstDataRendered={onFirstDataRendered}
                    cacheQuickFilter={true}
                    ></AgGridReact>
                </div>
            </Tab>
        
        </Tabs>
    </div>

    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body>
            <Form>
                <Row className="mb-1">
                    <Form.Group as={Col} controlId="validationCustom01">
                        <Form.Label>Pilih Tanggal Cetak Pengadaan</Form.Label>
                        <Form.Control
                            required
                            type="date"
                            min={nilaiMin}
                            max={nilaiMax}
                            onChange={e =>setNilaiTanggal(e.target.value)}
                        />
                    </Form.Group>
                </Row>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handlePrint}>Lanjut</Button>
        </Modal.Footer>
      </Modal>

    {isLoading ? <LoadingPage/> : ""}
    </>
  )
}
