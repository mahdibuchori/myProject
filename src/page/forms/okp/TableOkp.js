import React, { useMemo, useRef, useState, useEffect } from 'react';
import './okp.css';
// import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Dropdown, Form, Modal, Stack } from 'react-bootstrap';
import Swal from "sweetalert2";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { COLUMNS_OKP, COLUMNS_OKPNOTE } from '../../../datafile/columns';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import useOkpStore, {selectOkp,selectFetchOkp,selectOkpReady,selectFalseOkp, selectNoOkp, selectFetchNoOKP, selectNoOKPReady, selectFalseNoOkp, selectCreOKP,selectFetchCreateOKP,selectCreateReady,selectFalseCreateOkp} from '../../../store/dataOkp';
import { FileRevOKP } from '../../../datafile/FileSelect';
// import { InputOkp } from './InputOkp';

export const TableOkp = () => {
    let navigate = useNavigate();
    const gridRef = useRef();
    const userData = useAuthStore(selectUser);
    
    
    const onOkp = useOkpStore(selectFetchOkp);
    const dataOkp = useOkpStore(selectOkp);
    const okpReady = useOkpStore(selectOkpReady);
    const okpFalse = useOkpStore(selectFalseOkp);

    const noOkp = useOkpStore(selectNoOkp);
    const dataNoOkp = useOkpStore(selectFetchNoOKP);
    const noOkpReady = useOkpStore(selectNoOKPReady);
    const noOkpFalse = useOkpStore(selectFalseNoOkp);

    const creOkp = useOkpStore(selectCreOKP);
    const fetchOKP = useOkpStore(selectFetchCreateOKP);
    const createReady = useOkpStore(selectCreateReady);
    const falseCreateOkp = useOkpStore(selectFalseCreateOkp);
    
    const columns = useMemo(() => COLUMNS_OKP, []);
    const columnsNote = useMemo(() => COLUMNS_OKPNOTE, []);
  
    const containerStyle = useMemo(() => ({ Width: '100%', Height: '100%' }), []);
    
    const [blnNew, setBlnNew] = useState('');
    const [selectTgl, setSelectTgl] = useState('');
    const [okp, setOkp] = useState('');
    const [produksi, setProduksi] = useState('');
    const [revisiOK, setRevisiOK] = useState('');

    
    const [tglOKP, setTglOKP] = useState('');
    const [tglProd, setTglProd] = useState('');
    const [tglRevisi, setTglRevisi] = useState('');
    const [nosOKP, setNosOKP] = useState('');
    const [sheet, setSheet] = useState([]);
    const [sheetRev, setSheetRev] = useState([]);
    const [bottomRow, setBottomRow] = useState([]);
    const [width, setWidth] = useState(window.innerWidth -200);
    const [height, setHeight] = useState(window.innerHeight-200);
    const [isLoading, setIsLoading] = useState(false);
    const [rowData, setRowData] = useState();
    const [rowNote, setRowNote] = useState();
    const [show, setShow] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showRev, setShowRev] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseNew = () => {
        noOkpFalse();
        setTglOKP('');
        setTglProd('');
        setTglRevisi('');
        setNosOKP('');
        setSheetRev([]);
        setShowNew(false)
    };
    const handleShowNew = () =>{
        noOkpFalse();
        setTglOKP('');
        setTglProd('');
        setTglRevisi('');
        setNosOKP('');
        setSheetRev([]);
        setShowNew(true);
    };

    useEffect(() => { 
        setIsLoading(true);
        const date = new Date();
        const mount = date.getMonth() + 1;
        const year = date.getFullYear();
        let news = "";
        const p = (mount + 1).toString().length;
        if (p < 2) {news = '0' + mount.toString()};
        setBlnNew(`${year}-${news}`)
        okpFalse();
        setRowData();
        setSelectTgl();
        setOkp();
        setRevisiOK();
        setRowNote();
        setBottomRow();
        onOkp(`${year}-${mount}`,"cekSheetOKP","");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // setIsLoading(true);
        if (!okpReady) return;
        onGridReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [okpReady]);

    useEffect(() => {
        if (!noOkpReady) return;
        cekDataOK()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noOkpReady]);

    useEffect(() => {
        if (!createReady) return;
        setOkpReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createReady]);
    
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

    const defaultColDef = useMemo(() => {
        return {
        editable: false,
        sortable: true,
        filter: true,
        resizable: true,
        };
    }, []);

    const onGridReady = () =>{
        try {
            console.log(dataOkp);
            const total = dataOkp.okp[0]?.jumBarang;
            const pinnedBottomRowData =  [{no: "Total", kodeOKP: '', produk: '', batch: total , varian: null, revisi : ""}];
            setRowData(dataOkp.dOKP);
            setSelectTgl(dataOkp.okp[0]?.tangOKP);
            setOkp(dataOkp.okp[0]?.okp)
            setRevisiOK(dataOkp.okp[0]?.revisi);
            setProduksi(dataOkp.okp[0]?.tangProd);
            setSheet(dataOkp.data)
            setRowNote(dataOkp.dNote)
            setBottomRow(pinnedBottomRowData);
            setIsLoading(false);
            handleShow()
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
    const backhome = (e) =>{
        okpFalse();
        setRowData();
        setSelectTgl();
        setOkp();
        setRevisiOK()
        setRowNote();
        navigate(e);
    }
    const toInput = (e) =>{
        okpFalse();
        setRowData();
        setSelectTgl();
        setOkp();
        setRevisiOK()
        setRowNote();
        setProduksi();
        navigate(e,{state:{
            nomer : dataOkp.okp[0].noUrut,
            noteLength : dataOkp.dNote.length,
            okp : okp,
            selectTgl : selectTgl,
            produksi : produksi,
            revisiOK : revisiOK,
            tglRevisi : dataOkp.okp[0]?.tangRev, 
        }});
    }
    const createOKP = (e) =>{
        if(userData.user_divisi === "Develop" || userData.user_divisi === "Develop"){
            if(userData.user_level === "Level1" || userData.user_level === "Level2"){
                Swal.fire({
                    title: 'Silahkan pilih option di bawah ini ?',
                    icon:'info',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Buat OKP baru',
                    denyButtonText: `Add data OKP`,
                  }).then((result) => {
                    if (result.isConfirmed) {
                        handleShowNew()
                    } else if (result.isDenied) {
                        console.log("okp :"+okp)
                        if(okp === "" || okp === undefined){
                            Swal.fire('Harap Cek Tanggal OKP',"","info")
                            handleShow()
                        }
                        else{
                            toInput(`/main/${userData.user_divisi}/OKP/Input`)
                        }
                    // <InputOkp/>
                    }
                  })
            }
            else{
                Swal.fire("Info","Anda tidak memiliki akses",'info')
            }
        }
        else{
            Swal.fire("Info","Anda tidak memiliki akses",'info')
        }

    }
    const cekNoOKP = (e) =>{
        setIsLoading(true);
        noOkpFalse();
        dataNoOkp(e,"getNoOKP","");
        console.log(noOkpReady);
    }
    const cekDataOK = () =>{
        setNosOKP(noOkp[0].okp);
        noOkpFalse();
        setIsLoading(false);
        console.log(noOkpReady);
    }
    const handleSelectChange = (e) => {
        setRowData();
        setRowNote();
        setSelectTgl();
        setOkp();
        setRevisiOK();
        okpFalse();
        setIsLoading(true);
        const nilai = e.target.value;
        onOkp(nilai,"cekSheetOKP","");
        
    }
    const onHandeleRev = (e) =>{
        if(e.value === "---" ||e.value === "" || e.value === undefined){
            setShowRev(true);
            setTglRevisi('')
        }   
        else{
            setShowRev(false);
        }
    }
    const handleDateChange = (e) =>{
        setRowData();
        setRowNote();
        setSelectTgl();
        setOkp();
        setRevisiOK();
        okpFalse();
        setIsLoading(true);
        const nilai = e.value;
        onOkp(blnNew,"cekSheetOKP",nilai);
        handleClose();
    }
    const createNew = (e) =>{
        e.preventDefault();
        if(tglOKP === ""){
            Swal.fire('Tgl OKP','Harap isi tanggal OKP','info')
        }
        else if(tglProd === ""){
            Swal.fire('Tgl OKP','Harap isi tanggal Produksi','info')
        }
        else if(nosOKP === ""){
            Swal.fire('Tgl OKP','Harap isi tanggal Produksi','info')
        }
        else{
            let revSheet = "";
            if(sheetRev?.value === "" || sheetRev?.value === "---" || sheetRev?.value === undefined){
                revSheet = "";
            }
            else{
                revSheet = sheetRev?.value;   
            }

            if(revSheet !== "" && tglRevisi === ""){
                Swal.fire('Info','Harap input tgl revisi','info')
            }
            else{
                setIsLoading(true);
                falseCreateOkp();
                fetchOKP(tglProd,tglOKP,tglRevisi,revSheet,nosOKP);
            }
        }
        
    }
    const setOkpReady = () =>{
        Swal.fire(creOkp[0]?.cek,creOkp[0]?.keterangan,"info");
        handleCloseNew();
        falseCreateOkp();
        okpFalse();
        let inDate = new Date( tglOKP );
        let dateIn = (`${inDate.toLocaleString('id-ID', { day: '2-digit' })} ${inDate.toLocaleString('id-ID', { month: 'long' })} ${inDate.getFullYear()}`);
        let revSheet = "";
        if(sheetRev?.value === "" || sheetRev?.value === "---" || sheetRev?.value === undefined){
            revSheet = dateIn;
        }
        else{
            revSheet = `${dateIn} ${sheetRev.value}`;   
        }
        const isi = {value: revSheet, label: revSheet};
        handleDateChange(isi);
    }

    const cetakOKP = (e) =>{
        // console.log(dataOkp)
        navigate(e, {state:{data: dataOkp}})
    }

  return (
    <>
    <div style={{containerStyle}} className='containerStyle'>
        <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
            <div className="bg-light">
                <Breadcrumb className="bg-light m-2">
                    <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                    <Breadcrumb.Item active>OKP</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="bg-light border ms-auto"></div>
            <div className="vr" />
            <div className="bg-light">
                <Dropdown>
                    <Dropdown.Toggle variant="primary">
                    Menu
                    </Dropdown.Toggle>
                    {/* backhome(`/main/${userData.user_divisi}/OKP/Preview`)*/}
                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item onClick={() => createOKP(`/main/${userData.user_divisi}/OKP/Create`)}><i class="bi bi-pencil"></i> Create</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => cetakOKP(`/main/${userData.user_divisi}/OKP/Preview`)}><i className="bi bi-printer"></i> Print</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleShow}><i className="bi bi-arrow-clockwise"></i> Refresh</Dropdown.Item>
                        
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </Stack>
        <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
            <div className="bg-light ">No. OKP: {okp}</div>
            <div className="bg-light ">Tgl OKP : {selectTgl}</div>
            <div className="bg-light ">Tgl Produksi : {produksi}</div>
            <div className="bg-light ">Revisi : {revisiOK}</div>
        </Stack>
        <div style={{width: width, height: 350, padding: "0px 10px 0px 10px"}} className="ag-theme-alpine">
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columns}
                defaultColDef={defaultColDef}
                pinnedBottomRowData={bottomRow}
            ></AgGridReact>
        </div>
        <h6 style={{padding: "0px 10px 0px 10px", marginTop: 8}}>Note</h6>
        <div style={{width: width, height: 220, padding: "0px 10px 0px 10px"}} className="ag-theme-alpine">
            <AgGridReact
                ref={gridRef}
                rowData={rowNote}
                columnDefs={columnsNote}
                defaultColDef={defaultColDef}
            ></AgGridReact>
        </div>
    </div>

    <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
        <Form>
            
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Kode OKP</Form.Label>
              <Form.Control
                type="month"
                value={blnNew}
                onChange={(e) => {
                    setBlnNew(e.target.value)
                    handleSelectChange(e)
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Tanggal Pembuatan OKP</Form.Label>
                <Select
                    required
                    name="tipe"
                    options={sheet}
                    onChange={(e) => {
                        setSheet(e)
                        handleDateChange(e)
                    }}
                    isSearchable = {true}
                />
            </Form.Group>
        </Form>
        
        </Modal.Body>
        
    </Modal>

    <Modal show={showNew} onHide={handleCloseNew} centered>
        <Modal.Header>
            <Modal.Title>Buat OKP Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={createNew}>
                <Form.Group className="mb-3">
                    <Form.Label>Tanggal OKP</Form.Label>
                    <Form.Control type="date" value={tglOKP} onChange={e => setTglOKP(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Tanggal Produksi</Form.Label>
                    <Form.Control 
                        type="date" 
                        value={tglProd} 
                        onChange={e => {
                            setTglProd(e.target.value)
                            cekNoOKP(e.target.value)
                        }}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>No OKP</Form.Label>
                    <Form.Control type="text" value={nosOKP} disabled/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Revisi</Form.Label>
                        <Select
                            title={"revisi okp"}
                            name={"cekRevisi"}
                            // value={sheetRev[0]}  
                            options={FileRevOKP}
                            onChange={e => {
                                setSheetRev(e)
                                onHandeleRev(e)
                            }}
                            // {...error.cekDivisi}
                        />
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label>Tanggal Revisi</Form.Label>
                    <Form.Control type="date" value={tglRevisi} onChange={e => setTglRevisi(e.target.value)} disabled ={showRev}/>
                </Form.Group>
                

                <Button variant="primary" type="submit">
                Submit
                </Button>
            </Form>
        </Modal.Body>
        
    </Modal>

    {isLoading ? <LoadingPage/> : ""}
    </>
  )
}
