import React, { useEffect, useState } from 'react';
import './orderpurchase.css';
import Swal from "sweetalert2";
import { NumericFormat } from 'react-number-format';
import { useLocation, useNavigate } from 'react-router-dom';


import { API_AUTH } from '../../../apis/apisData';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import { Breadcrumb, Button, Card, Col, Form, InputGroup, Modal, Stack } from 'react-bootstrap';

export const DataPo = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userData = useAuthStore(selectUser);
    const [dataPO, setDataPO] = useState([]);
    const [parsial, setParsial] = useState([]);
    const [selectedcourse, setselectedCourse] = useState([]);
    const [totalSub, setTotalSub] = useState(0);
    const [totalPph, setTotalPph] = useState(0);
    const [totalPpn, setTotalPpn] = useState(0);
    const [diskon, setDiskon] = useState(0);
    const [bantar, setBantar] = useState(0);
    const [total, setTotal] = useState(0);
    const [alamat, setAlamat] = useState('');

    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isHarga, setIsHarga] = useState(true);
    const [show, setShow] = useState(false);
    console.log(dataPO)
    useEffect(() => {
        setIsLoading(true);
        if(location.state === null) {
            backhome(`/main/${userData.user_divisi}/Purchasing`);
            Swal.fire('Info','Harap kembali ke halaman permintaan data tidak lengkap', 'info')
        }
        else{
            setDataPO(location.state.data)
            cekData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cekData = () =>{
        let array = location.state.data[0].dataPO;
        const totalNilai = array.reduce((nilaiSebelumnya, nilaiSaatIni) => {
            return parseFloat(nilaiSebelumnya) + parseFloat(nilaiSaatIni.subTotal);
          }, 0);
        const totalPpn = array.reduce((nilaiSebelumnya, nilaiSaatIni) => {
        return parseFloat(nilaiSebelumnya) + parseFloat(nilaiSaatIni.ppn);
        }, 0);
        const totalPph = array.reduce((nilaiSebelumnya, nilaiSaatIni) => {
        return parseFloat(nilaiSebelumnya) + parseFloat(nilaiSaatIni.pph);
        }, 0);

        const totalAll = totalNilai + totalPpn + totalPph;

        if(userData.user_divisi === "Purchasing" || userData.user_divisi === "Develop"){
            setIsHarga(false)
        }
        else{
            setIsHarga(true)
        }

        setTotalSub(totalNilai)
        setTotalPpn(totalPpn);
        setTotalPph(totalPph);
        setTotal(totalAll)
        setIsLoading(false);
    }
    
    const setHarga = (value, tipe) =>{
        let disc = 0;
        let batr = 0;
        if(tipe === "diskon"){
            if(value){
                disc = parseFloat(value);
                setDiskon(parseFloat(value));
            }
            else{setDiskon(0)}
            batr = parseFloat(bantar);
        }
        else{
            if(value) {
                batr = parseFloat(value);
                setBantar(parseFloat(value))
            }
            else{setBantar(0)}
            disc = parseFloat(diskon);
        }
        let totals = parseFloat(total) - disc - batr;
        setTotal(totals)
    }

    const handleSubmit =async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          setValidated(true);
        }
        else{
            let statusPO =location.state.data[0].status;
            let planPO =location.state.data[0].plan;
            const date = new Date();
            let mm = parseInt(date.getMonth()) + 1;
            let dd = parseInt(date.getDate());
            let yy = date.getFullYear();
            let bulan = String(mm).padStart(2, '0');
            let day = String(dd).padStart(2, '0');

            if(userData.user_divisi === "Purchasing" && userData.user_plan === planPO){
                if(statusPO === "" || statusPO === "Revisi" || statusPO === "Approved"){
                    Swal.fire({
                        title: 'Apakah Anda Ingin Melakukan Pengajuan PO?',
                        icon: 'question',
                        showDenyButton: true,
                        showCancelButton: false,
                        confirmButtonText: 'Ya',
                        denyButtonText: `Tidak`,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setIsLoading(true);
                            let data = {
                                status : 'Pengajuan',
                                revisi : '',
                                tglVery : '',
                                tglAppro : '',
                                tgl_revisi : '',
                            }
                            saveData(data)
                        } else if (result.isDenied) {
                            Swal.fire('Pengajuan PO dibatalkan', '', 'info')
                        }
                    })
                }
                else if(statusPO === "Pengajuan"){
                    Swal.fire('Info','PO masih dalam tahap pengajuan dan belum di verifikasi','info')
                }
                else{
                    Swal.fire('Info','PO masih dalam tahap verifikasi dan belum di approved','info')
                }
            }
            else if(userData.user_divisi === "PPIC-WH" && userData.user_plan === planPO  && userData.user_level === "Level2"){
                if(statusPO === "" || statusPO === "Revisi"){
                    Swal.fire('Info','Purchasing belum melakukan proses pengajuan PO','info');
                }
                else if(statusPO === "Pengajuan"){
                    Swal.fire({
                        title: 'Apakah Anda Ingin Melakukan Verifikasi PO?',
                        icon: 'question',
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Verifikasi',
                        denyButtonText: `Revisi`,
                        cancelButtonText: `Batal`,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setIsLoading(true);
                            let data = {
                                status : 'Verifikasi',
                                revisi : '',
                                tglVery : `${yy}-${bulan}-${day}`,
                                tglAppro : '',
                                tgl_revisi : '',
                            }
                            saveData(data);
                        } else if (result.isDenied) {
                            Swal.fire({
                                text: "Masukan keterangan revisi",
                                icon: 'warning',
                                input: 'textarea',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Simpan',
                                cancelButtonText: 'Batal',
                            }).then((results) => {
                                if (results.isConfirmed) {
                                    if(results.value === ""){
                                        Swal.fire('Harap input keterangan revisi','','warning');
                                    }
                                    else{
                                        setIsLoading(true);
                                        let data = {
                                            status : 'Revisi',
                                            revisi : results.value,
                                            tglVery : "",
                                            tglAppro : '',
                                            tgl_revisi : `${yy}-${bulan}-${day}`,
                                        }
                                        
                                        saveData(data);
                                    }
                                }
                            })
                        }
                    })
                }
                else if(statusPO === "Approved"){
                    Swal.fire('Info','PO sudah di approved oleh Plan Manager','info')
                }
                else{
                    Swal.fire('Info','PO sudah di verifikasi dan sedang dalam proses approved Plan Manager','info')
                }
            }
            else if(userData.user_divisi === "BOD-BOC" && userData.user_plan === planPO){
                if(statusPO === "" || statusPO === "Revisi"){
                    Swal.fire('Info','Purchasing belum melakukan proses pengajuan PO','info');
                }
                else if(statusPO === "Pengajuan"){
                    Swal.fire('Info','PO masih dalam proses verifikasi Manager PPIC-Purchasing','info')
                }
                else if(statusPO === "Verifikasi"){
                    Swal.fire({
                        title: 'Apakah Anda Ingin Melakukan Proses Approved PO?',
                        icon: 'question',
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Verifikasi',
                        denyButtonText: `Revisi`,
                        cancelButtonText: `Batal`,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setIsLoading(true);
                            let data = {
                                status : 'Approved',
                                revisi : '',
                                tglVery : location.state.data[0].tgl_verify,
                                tglAppro : `${yy}-${bulan}-${day}`,
                                tgl_revisi : '',
                            }
                            saveData(data);
                        } else if (result.isDenied) {
                            Swal.fire({
                                text: "Masukan keterangan revisi",
                                icon: 'warning',
                                input: 'textarea',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Simpan',
                                cancelButtonText: 'Batal',
                            }).then((results) => {
                                if (results.isConfirmed) {
                                    if(results.value === ""){
                                        Swal.fire('Harap input keterangan revisi','','warning');
                                    }
                                    else{
                                        setIsLoading(true);
                                        let data = {
                                            status : 'Revisi',
                                            revisi : results.value,
                                            tglVery : "",
                                            tglAppro : '',
                                            tgl_revisi : `${yy}-${bulan}-${day}`,
                                        }
                                        
                                        saveData(data);
                                    }
                                }
                            })
                        }
                    })
                }
                else{
                    Swal.fire('Info','PO sudah di aprroved dan akan di proses kembali oleh divisi Purchasing','info')
                }
            }
            else if(userData.user_divisi === "Develop"){
                if(statusPO === "" || statusPO === "Revisi" || statusPO === "Approved"){
                    Swal.fire({
                        title: 'Apakah Anda Ingin Melakukan Pengajuan PO?',
                        icon: 'question',
                        showDenyButton: true,
                        showCancelButton: false,
                        confirmButtonText: 'Ya',
                        denyButtonText: `Tidak`,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setIsLoading(true);
                            let data = {
                                status : 'Pengajuan',
                                revisi : '',
                                tglVery : '',
                                tglAppro : '',
                                tgl_revisi : '',
                            }
                            saveData(data)
                        } else if (result.isDenied) {
                            Swal.fire('Pengajuan PO dibatalkan', '', 'info')
                        }
                    })
                }
                else if(statusPO === "Pengajuan"){
                    Swal.fire({
                        title: 'Apakah Anda Ingin Melakukan Verifikasi PO?',
                        icon: 'question',
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Verifikasi',
                        denyButtonText: `Revisi`,
                        cancelButtonText: `Batal`,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setIsLoading(true);
                            let data = {
                                status : 'Verifikasi',
                                revisi : '',
                                tglVery : `${yy}-${bulan}-${day}`,
                                tglAppro : '',
                                tgl_revisi : '',
                            }
                            saveData(data);
                        } else if (result.isDenied) {
                            Swal.fire({
                                text: "Masukan keterangan revisi",
                                icon: 'warning',
                                input: 'textarea',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Simpan',
                                cancelButtonText: 'Batal',
                            }).then((results) => {
                                if (results.isConfirmed) {
                                    if(results.value === ""){
                                        Swal.fire('Harap input keterangan revisi','','warning');
                                    }
                                    else{
                                        setIsLoading(true);
                                        let data = {
                                            status : 'Revisi',
                                            revisi : results.value,
                                            tglVery : "",
                                            tglAppro : '',
                                            tgl_revisi : `${yy}-${bulan}-${day}`,
                                        }
                                        
                                        saveData(data);
                                    }
                                }
                            })
                        }
                    })
                }
                else{
                    Swal.fire({
                        title: 'Apakah Anda Ingin Melakukan Proses Approved PO?',
                        icon: 'question',
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Verifikasi',
                        denyButtonText: `Revisi`,
                        cancelButtonText: `Batal`,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setIsLoading(true);
                            let data = {
                                status : 'Approved',
                                revisi : '',
                                tglVery : location.state.data[0].tgl_verify,
                                tglAppro : `${yy}-${bulan}-${day}`,
                                tgl_revisi : '',
                            }
                            saveData(data);
                        } else if (result.isDenied) {
                            Swal.fire({
                                text: "Masukan keterangan revisi",
                                icon: 'warning',
                                input: 'textarea',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Simpan',
                                cancelButtonText: 'Batal',
                            }).then((results) => {
                                if (results.isConfirmed) {
                                    if(results.value === ""){
                                        Swal.fire('Harap input keterangan revisi','','warning');
                                    }
                                    else{
                                        setIsLoading(true);
                                        let data = {
                                            status : 'Revisi',
                                            revisi : results.value,
                                            tglVery : "",
                                            tglAppro : '',
                                            tgl_revisi : `${yy}-${bulan}-${day}`,
                                        }
                                        
                                        saveData(data);
                                    }
                                }
                            })
                        }
                    })
                }
            }
            else{
                Swal.fire('Info','Status PO tidak diketahui coba periksa kembali PO','warning')
            } 
        }    
    };

    const saveData = async (event) =>{
        try {
            const next = await API_AUTH.put(`/purchase/${location.state.data[0].id_po}`, {
                id_po : location.state.data[0].id_po,
                status : event.status,
                totalSub : totalSub,
                diskon : diskon,
                bAntar : bantar,
                total : total,
                tgl_verify : event.tglVery,
                tgl_approve : event.tglAppro,
                revisi : event.revisi,
                u_name : userData.user_name,
                tgl_revisi : event.tgl_revisi,
                plan : userData.user_plan
            })
            Swal.fire(`${next.data.success}`, backhome(`/main/${userData.user_divisi}/Purchasing`), 'success');
            setIsLoading(false);
        } catch (error) {
            Swal.fire('Info', `${error.response.data.message}`, 'warning');
            setIsLoading(false);
        }
    }

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleCetak = () =>{
        setParsial([])
        let modifiedArr = location.state.data[0].dataPO.map((card, i) => {
            return {material : card.namaBarang, parsial : card.parsial}
        })
        let nilai = [];
        for(let x= 0 ; x < modifiedArr.length; x++){
            if(modifiedArr[x].parsial.length > 1){
                for(let y= 0 ; y < modifiedArr[x].parsial.length; y++){
                    nilai.push({
                        item : modifiedArr[x].material,
                        qty : modifiedArr[x].parsial[y].qty,
                        tglDatang : modifiedArr[x].parsial[y].tglDatang,
                    })
                }
            }
            else{
                nilai.push({
                    item : modifiedArr[x].material,
                    qty : modifiedArr[x].parsial[0].qty,
                    tglDatang : modifiedArr[x].parsial[0].tglDatang,
                })
            }
        }
        setParsial(nilai)
        if(userData.user_divisi === "Purchasing" || userData.user_divisi === "Develop"){
            if(location.state.data[0].status === "Approved"){
                handleShow()
            }
            else{
                handleShow()
            }
        }
        else{
            Swal.fire('Info','Tidak memiliki akses','warning');
        }
    }

    const handlecheckbox = (e) => {
        var temp = selectedcourse;
        if(e.target.checked===false){
          temp = temp.filter((a) => {
            return a !== e.target.value;
          });
        }    
        e.target.checked
          ? setselectedCourse([...selectedcourse, e.target.value])
          : setselectedCourse([...temp]);
      };

    const handlePDF = () =>{
        let parsialDt = [];
        for (let x = 0; x< selectedcourse.length; x++){
            parsialDt.push(parsial[x])
        }
        navigate(`/main/${userData.user_divisi}/Purchasing/PreviewPO`,{state:{
            data : location.state.data[0],
            parsial : parsialDt,
            note : alamat
          }});
    }

    const backhome = (e) =>{
        navigate(e);
    }

  return (
    <>
    <div className='orderpurchase'>
        <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
            <div className="bg-light">
                <div>
                    <Breadcrumb>
                    <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => backhome(`/main/${userData.user_divisi}/Purchasing`)}>ListPO</Breadcrumb.Item>
                    <Breadcrumb.Item active>Data</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <div className="ms-auto"></div>
            <div className="vr" />
            <div className="bg-light">
                <Button variant="outline-primary" onClick={handleCetak}><i className="bi bi-filetype-pdf"></i> PDF</Button>
            </div>
        </Stack>

        <div className='orderpurchase-item-create'>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-4 mb-1">
                        <Card className='mb-1'>
                            <Card.Body>
                                <div className="row p-1">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>No PO</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            value={location.state.data[0].id_po}
                                            disabled = {true}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="row p-1">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            value={location.state.data[0].status}
                                            disabled
                                        />
                                    </Form.Group>
                                </div>
                                <div className="row p-1">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Tanggal PO</Form.Label>
                                        <Form.Control
                                            required
                                            type="date"
                                            value={location.state.data[0].tgl_po}
                                            disabled
                                        />
                                    </Form.Group>
                                </div>
                                <div className="row p-1">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Tanggal Kirim</Form.Label>
                                        <Form.Control
                                            required
                                            type="date"
                                            value={location.state.data[0].tgl_kirim}
                                            disabled
                                        />
                                    </Form.Group>
                                </div>
                                <div className="row p-1">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Nilai Tukar</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="Plan"
                                            className='btn btn-primary mb-1'
                                            value={location.state.data[0].tukar}
                                            disabled
                                        />
                                    </Form.Group>
                                </div>
                                <div className="row p-1">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Syarat Pembayaran</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="Status Pengadaan"
                                            className='btn btn-danger mb-1'
                                            value={location.state.data[0].pembayaran}
                                            disabled
                                        />
                                    </Form.Group>
                                </div>
                                <div className="row p-1">
                                    <Form.Control 
                                        as="textarea" 
                                        aria-label="With textarea"
                                        rows={1}
                                        disabled
                                        value={location.state.data[0].dataPO[0].provider}
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-8 mb-2">
                    {location.state.data[0].dataPO.map((card, i) => {
                        return(
                            <Card className="mb-2">
                                <div className="row p-1">
                                    <div className='col-lg-12'>
                                        <h5 style={{textAlign: 'center'}}>{card.namaBarang}</h5>
                                    </div>
                                </div>
                                <div className="row p-1">
                                    <div className='col-lg-2'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Jumlah</Form.Label>
                                            <NumericFormat
                                                className="text-end" 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={card.jumlah}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Harga Satuan</Form.Label>
                                            <NumericFormat
                                                className="text-end" 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={card.jumlahHarga}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className='col-lg-2'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Pajak</Form.Label>
                                            <Form.Control 
                                                required
                                                type="text"
                                                value={card.pajak}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className='col-lg-2'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Diskon</Form.Label>
                                            <Form.Control 
                                                required
                                                type="text"
                                                value={card.diskon}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Total Harga</Form.Label>
                                            <NumericFormat
                                                className="text-end" 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={card.subTotal}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="row p-1">
                                    <div className='col-lg-12'>
                                        <Form.Control 
                                            as="textarea" 
                                            aria-label="With textarea"
                                            rows={1}
                                            disabled
                                            value={card.div}
                                        />
                                    </div>
                                </div>
                            </Card>
                            
                        )
                    })}
                    <div className="mb-4">
                        <div className="row">
                            <div className='col-lg-8 text-end p-2'>
                                <h6 style={{padding : 2}}>Total Sub</h6>
                            </div>
                            <div className='col-lg-4'>
                                <NumericFormat 
                                    className="text-end"
                                    customInput={Form.Control}
                                    thousandSeparator={true}
                                    value={totalSub}
                                    // onChange ={e => setKtsDipesan(e.value)}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-lg-8 text-end p-2'>
                                <h6 style={{padding : 2}}>PPN</h6>
                            </div>
                            <div className='col-lg-4'>
                                <NumericFormat 
                                    className="text-end"
                                    customInput={Form.Control}
                                    thousandSeparator={true}
                                    value={totalPpn}
                                    // onChange ={e => setKtsDipesan(e.value)}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-lg-8 text-end p-2'>
                                <h6 style={{padding : 2}}>PPH</h6>
                            </div>
                            <div className='col-lg-4'>
                                <NumericFormat 
                                    className="text-end"
                                    customInput={Form.Control}
                                    thousandSeparator={true}
                                    value={totalPph}
                                    // onChange ={e => setKtsDipesan(e.value)}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-lg-8 text-end p-2'>
                                <h6 style={{padding : 2}}>Diskon</h6>
                            </div>
                            <div className='col-lg-4'>
                                <NumericFormat
                                    className="text-end" 
                                    customInput={Form.Control}
                                    thousandSeparator={true}
                                    value={diskon}
                                    onValueChange ={e => setHarga(e.value,'diskon')}
                                    disabled = {isHarga}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-lg-8 text-end p-2'>
                                <h6 style={{padding : 2}}>B. Antar</h6>
                            </div>
                            <div className='col-lg-4'>
                                <NumericFormat
                                    className="text-end" 
                                    customInput={Form.Control}
                                    thousandSeparator={true}
                                    value={bantar}
                                    onValueChange ={e => setHarga(e.value,'antar')}
                                    disabled = {isHarga}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-lg-8 text-end p-2'>
                                <h6 style={{padding : 2}}>Total</h6>
                            </div>
                            <div className='col-lg-4'>
                                <NumericFormat
                                    className="text-end"  
                                    customInput={Form.Control}
                                    thousandSeparator={true}
                                    value={total}
                                    // onChange ={e => setKtsDipesan(e.value)}
                                    disabled
                                />
                            </div>
                        </div>

                    </div>
                        
                        <div style={{display: 'flex', justifyContent:'flex-end', width: '100'}}>
                            <Button type="submit">Submit form</Button>
                        </div> 
                    </div>
                </div>
            </Form>
        </div>
    
    </div>

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Proses Cetak PO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>List Parsial Data</Form.Label>
              {parsial.map((card, i) => {
                const date = new Date(card.tglDatang);
                let mm = parseInt(date.getMonth()) + 1;
                let dd = parseInt(date.getDate());
                let yy = date.getFullYear();
                let bulan = String(mm).padStart(2, '0');
                let day = String(dd).padStart(2, '0');
                    return(
                        <div className="form-check">
                            <input 
                                className="form-check-input"
                                type="checkbox" 
                                value={i}
                                // disabled={cara}
                                onClick={handlecheckbox}
                            />
                            <InputGroup className="mb-3">
                                <Form.Control aria-label="Text input with checkbox" value={card.item} disabled/>
                                <Form.Control aria-label="Text input with checkbox" value={`${day}-${bulan}-${yy}`} disabled/>
                                <Form.Control aria-label="Text input with checkbox" value={card.qty} disabled/>
                            </InputGroup>
                        </div>
                    )
                })}
            </Form.Group>
            
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Keterangan Tambahan</Form.Label>
              <Form.Control 
                as="textarea"
                // value={"alamat.toUpperCase()"}
                onChange={(e) =>setAlamat(e.target.value)}
                rows={3} 
            />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePDF}>
            Pdf Preview
          </Button>
        </Modal.Footer>
    </Modal>
    {isLoading ? <LoadingPage /> : ""}
    </>
  )
}
