import React, { useState, useEffect } from 'react';
import './permintaan.css';
import Swal from "sweetalert2";
import { API_AUTH } from '../../../apis/apisData';
import { NumericFormat } from 'react-number-format';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import { Accordion, Breadcrumb, Button, Card, Col, Container, Form, InputGroup, OverlayTrigger, Row, Stack, Tooltip } from 'react-bootstrap';
import usePermintaanStore, { selectPhistory, selectFetchHistory, selectPhistoryReady, selectFalseHistory } from '../../../store/dataPermintaan';


export const ViewPermintaan = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const userData = useAuthStore(selectUser);
    const goHistory = usePermintaanStore(selectFetchHistory);
    const readyHistory = usePermintaanStore(selectPhistoryReady);
    const dtHistory = usePermintaanStore(selectPhistory);
    const falseHistory = usePermintaanStore(selectFalseHistory);
    const [isLoading, setIsLoading] = useState(false);

    const [idPermintaan, setIdPermintaan] = useState("");
    const [ okp, setOkp ] = useState('');
    const [tglTerima, setTglTerima] = useState("");
    const [tipe, setTipe] = useState("");
    const [item, setItem] = useState("");
    const [estimasi, setEstimasi] = useState("");
    const [pengajuan, setPengajuan] = useState("");
    const [keluar, setKeluar] = useState("");
    const [satuan, setSatuan] = useState("");
    const [status, setStatus] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [color, setColor] = useState("");
    const [bgColor, setBgColor] = useState("");
    const [name, setName] = useState("");
    const [waktu, setWaktu] = useState("");
    const [wpermohon, setWpermohon] = useState("");
    const [wkirim, setWkirim] = useState("");
    const [wverify, setwverify] = useState("");
    const [formPros, setFormPros] = useState(false);

    const [btnUbah, setBtnUbah] = useState(true);
    const [btnVery, setBtnVery] = useState(true);
    const [btnProses, setBtnProses] = useState(true);
    const [btnBatal, setBtnBatal] = useState(true);
    const [icon, setIcon] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        if(location.state === null) {
            backhome(`/main/${userData.user_divisi}/Permintaan`);
            Swal.fire('Info','Harap kembali ke halaman permintaan data tidak lengkap', 'info')
        };
        if(userData.user_divisi === location.state.data.divisi && userData.user_plan === location.state.data.plan && userData.user_name === location.state.data.pemohon){
            if(location.state.data.status_item === "Pengajuan" || location.state.data.status_item === "Revisi"){
                setBtnUbah(false)
            }
            if(location.state.data.status_item === "Revisi"){
                setIcon(true)
            }
            
        }

        if(userData.user_divisi === location.state.data.divisi && userData.user_plan === location.state.data.plan){
            if(location.state.data.status_item === "Pengajuan"){
                if(userData.user_level === "Level1" || userData.user_level === "Level2" || userData.user_level === "Level3" || userData.user_level === "Level4" || userData.user_level === "Level5" ){
                    setBtnVery(false);
                }
            }
        }

        if(userData.user_plan === location.state.data.plan){
            if(location.state.data.status_item === "Progress" && userData.user_divisi === "PPIC-WH"){
                setBtnProses(false);
                setBtnBatal(false);
            }
        }



        const today = new Date();
        let hour = today.getHours();
        let minute = today.getMinutes();
        let hh = String(hour).padStart(2, '0');
        let mm = String(minute).padStart(2, '0');
        const time = hh + ':' + mm ;
        setWaktu(time);
        let idnl =String(location.state.data.id_permintaan);
        const nili =async () =>{
            await falseHistory();
            await goHistory(idnl);
        }
        nili()
        cekData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // setIsLoading(true);
        if (!readyHistory) return;
        onHisReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [readyHistory]);

    const cekData = () =>{
        let nEstimasi = 0;
        let nPengajuan = 0;
        let nKeluar = 0;
        if(location.state.data.jml_item[0]?.jmlEstimasi === null || location.state.data.jml_item[0]?.jmlEstimasi === 0){
            nEstimasi = 0;
        }
        else{
            nEstimasi = (parseFloat(location.state.data.jml_item[0]?.jmlEstimasi) * 1000) /1000;
        }

        if(location.state.data.jml_item[0]?.JmlPermintaan === null || location.state.data.jml_item[0]?.JmlPermintaan === 0){
            nPengajuan = 0;
        }
        else{
            nPengajuan = (parseFloat(location.state.data.jml_item[0]?.JmlPermintaan) * 1000) /1000;
        }

        if(location.state.data.jml_item[0]?.JmlPengeluaran === null || location.state.data.jml_item[0]?.JmlPengeluaran === 0){
            nKeluar = 0;
        }
        else{
            nKeluar = (parseFloat(location.state.data.jml_item[0]?.JmlPengeluaran) * 1000) /1000;
        }
        
        if(location.state.data.status_item === ""){
            setName(userData.user_name);
        }
        else{
            setName(location.state.data.pemohon);
        }

        if (location.state.data.status_item ==='Pengajuan') {
            setColor('#800000');
            setBgColor('#d07979a7');
        }
        else if (location.state.data.status_item ==='Progress') {
            setColor('#120cce');
            setBgColor('#120cce60');
        }
        else if (location.state.data.status_item ==='Selesai') {
            setColor('#008011');
            setBgColor('#38cc4c73');
        }
        else if (location.state.data.status_item ==='Revisi') {
            setColor('#7a0080');
            setBgColor('#a35ea6c4');
        }
        else {
            setColor('#000');
            setBgColor('#fff');
        }

        setIdPermintaan(location.state.data.id_permintaan);
        setOkp(location.state.data.id_okp);
        setTglTerima(location.state.data.tgl_okp);
        setTipe(location.state.data.tipe);
        setItem(location.state.data.nama_item);
        setEstimasi(nEstimasi);
        setPengajuan(nPengajuan);
        setKeluar(nKeluar);
        setSatuan(location.state.data.satuan);
        setKeterangan(location.state.data.keterangan);
        setStatus(location.state.data.status_item);
        setWkirim(location.state.data.waktu[0].jamPengiriman);
        setWpermohon(location.state.data.waktu[0].jamPermintaan);
        setwverify(location.state.data.waktu[0].jamVerify);

        if(location.state.data.list_data.length > 0){
            setFormPros(true)
        }
        setIsLoading(false);
    }

    const onHisReady = () =>{
        console.log(readyHistory)
    }

    const handlePengajuan =(e) =>{
        Swal.fire({
            title: 'Apakah anda ingin melakukan pengajuan ulang permintaan barang?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ya',
            denyButtonText: `Tidak`,
            icon: 'question',
          }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true)
                saveData()
            } else if (result.isDenied) {
              Swal.fire('', 'Anda membatalkan untuk melakukan pengajuan ulang', 'info')
            }
          })
    }

    const saveData = async () =>{
        try {
            const next = await API_AUTH.put(`/editpermintaan`, {
                "id" : idPermintaan,
                "okp" : okp,
                "item" : item,
                "tPermintaan" : tglTerima,
                "pemohon" : userData.user_name,
                "divisi" : userData.user_divisi,
                "pengajuan" : pengajuan,
                "waktu" : wkirim,
                "now" : waktu,
                "keterangan" : keterangan,
                "plan" : userData.user_plan
            });
            setIsLoading(false);
            Swal.fire(`${next.data.message}`, backhome(`/main/${userData.user_divisi}/Permintaan`), 'success');
        } catch (error) {
            console.log(error.message)
            Swal.fire('Info', 'Terjadi Kesalahan!', 'error')
            setIsLoading(false)
        }
    }

    const handleVerify = () =>{
        Swal.fire({
            title: 'Apakah anda ingin memverifikasi permintaan barang?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ya, Verifikasi',
            denyButtonText: `Revisi Data`,
            icon: 'question',
          }).then((result) => {
            if (result.isConfirmed) {
                verifyPermintaan('Progress','');
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
                        if(results.value.length === ""){
                            Swal.fire('Harap input keterangan revisi','','warning')
                        }
                        else{
                            verifyPermintaan('Revisi',results.value);
                        }
                    }
                })
            }
          })
    }

    const verifyPermintaan = async(e,file) =>{
        try {
            // id, okp , item, tPermintaan, divisi, pengajuan, plan, now, keterangan
            const data =[{
                "id" : idPermintaan,
                "okp" : okp,
                "item" : item,
                "tPermintaan" : tglTerima,
                "divisi" : userData.user_divisi,
                "pengajuan" : e,
                "keterangan" : file,
                "plan" : userData.user_plan,
                "user" : userData.user_name,
                "now" : waktu
            }];
            console.log(data)
            const next = await API_AUTH.put(`/verifypermintaan`, {
                "id" : idPermintaan,
                "okp" : okp,
                "item" : item,
                "tPermintaan" : tglTerima,
                "divisi" : userData.user_divisi,
                "pengajuan" : e,
                "keterangan" : file,
                "plan" : userData.user_plan,
                "user" : userData.user_name,
                "now" : waktu
            });
            setIsLoading(false);
            Swal.fire(`${next.data.message}`, backhome(`/main/${userData.user_divisi}/Permintaan`), 'success');
        } catch (error) {
            console.log(error.message)
            Swal.fire('Info', 'Terjadi Kesalahan!', 'error')
            setIsLoading(false)
        }
    }

    const handleProses = () =>{
        navigate(`/main/${userData.user_divisi}/FormProses/Create`,{state:{
            data : location.state.data
          }});
    }

    const handleBatal = () =>{}

    const cekRevisi = () =>{
        Swal.fire('Info revisi',dtHistory.keterangan,'info')    
    }

    const backhome = (e) =>{
        navigate(e);
    }

    return (
        <>
        <div className='permintaanSet'>
            <div>
                <Stack direction="horizontal" gap={3}>
                    <div className="bg-light ">
                        <Breadcrumb>
                            <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}/Permintaan`)}>Permintaan</Breadcrumb.Item>
                            <Breadcrumb.Item active>Preview</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="bg-light border ms-auto"></div>
                    <div className="vr" />
                    <div className="bg-light border">
                        <Button variant="primary"  style={{marginRight: 10}} onClick={() => backhome(`/main/${userData.user_divisi}/Permintaan`)}><i class="bi bi-backspace"></i> Kembali</Button>
                    </div>
                </Stack>
            </div>
            <Container>
                <div style={{display:'flex'}}>
                    <h5>Preview Permintaan</h5>
                    {icon 
                    ? 
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Klik untuk mengetahui data revisi</Tooltip>}>
                            <span className='bt-rev' onClick={(e) =>cekRevisi(e)}>
                            <i className="bi bi-exclamation-diamond-fill"></i>
                            </span>
                        </OverlayTrigger>
                    :
                        ""
                    }
                </div>
                
                <Form>
                    <Row>
                        <div className="col-md-3 mb-1">
                            <Card>
                                <Card.Body>
                                    <div className="row">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>No OKP</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={okp}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Tanggal Permintaan</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={tglTerima}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Pemohon</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={name}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Pemverifikasi</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={location.state.data.pemverifikasi}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Pengirim</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={location.state.data.pengirim}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Status Permintaan</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={status}
                                                style={{color: color, backgroundColor: bgColor,textAlign: 'center'}}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Divisi</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={location.state.data.divisi}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-7 mb-1">
                            <Card className='mb-3'>
                                <Card.Body>
                                <div className="row mb-1">
                                    <div className='col-lg-6'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Tipe Item</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                disabled
                                                value={tipe}

                                            />
                                            <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-6'>
                                        <Form.Group as={Col} controlId="validationCustom02">
                                            <Form.Label>Nama Item</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                disabled
                                                value={item}
                                            />
                                            <Form.Control.Feedback type="invalid">Harap Input Nama karyawan</Form.Control.Feedback>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Estimasi Pemesanan</Form.Label>
                                            <InputGroup>
                                                <NumericFormat 
                                                    customInput={Form.Control}
                                                    thousandSeparator={true}
                                                    value={estimasi}
                                                    disabled
                                                />
                                                <InputGroup.Text id="basic-addon2">{satuan}</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                    </div>
                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Qty Pengajuan</Form.Label>
                                            <InputGroup>
                                                <NumericFormat 
                                                    customInput={Form.Control}
                                                    thousandSeparator={true}
                                                    value={pengajuan}
                                                    onChange={ (e) => setPengajuan(e.target.value) }
                                                    disabled={btnUbah}
                                                />
                                                <InputGroup.Text id="basic-addon2">{satuan}</InputGroup.Text>
                                            </InputGroup>
                                            <Form.Control.Feedback type="invalid">Harap Input Qty Pengajuan</Form.Control.Feedback>
                                        </Form.Group>
                                    </div>
                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Qty Keluar</Form.Label>
                                            <InputGroup>
                                                <NumericFormat 
                                                    customInput={Form.Control}
                                                    thousandSeparator={true}
                                                    value={keluar}
                                                    disabled
                                                />
                                                <InputGroup.Text id="basic-addon2">{satuan}</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom02">
                                            <Form.Label>Waktu Permohonan</Form.Label>
                                            <Form.Control
                                                required
                                                type='time'
                                                value={wpermohon}
                                                onChange={ (e) => setWpermohon(e.target.value) }
                                                disabled
                                            />
                                            <Form.Control.Feedback type="invalid">Harap Pilih Waktu Pengiriman</Form.Control.Feedback>
                                        </Form.Group>
                                    </div>
                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom02">
                                            <Form.Label>Waktu Pengiriman</Form.Label>
                                            <Form.Control
                                                required
                                                type='time'
                                                value={wkirim}
                                                onChange={ (e) => setWkirim(e.target.value)}
                                                disabled={btnUbah}
                                            />
                                            <Form.Control.Feedback type="invalid">Harap Pilih Waktu Pengiriman</Form.Control.Feedback>
                                        </Form.Group>
                                    </div>
                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom02">
                                            <Form.Label>Waktu Verifikasi</Form.Label>
                                            <Form.Control
                                                required
                                                type='time'
                                                value={wverify}
                                                onChange={ (e) => setwverify(e.target.value) }
                                                disabled
                                            />
                                            <Form.Control.Feedback type="invalid">Harap Pilih Waktu Pengiriman</Form.Control.Feedback>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12">
                                        <Form.Group as={Col} controlId="formGridArea">
                                            <Form.Label>Keterangan</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                aria-label="With textarea" 
                                                value={keterangan}
                                                onChange={(e) => {
                                                    setKeterangan(e.target.value)
                                                }}
                                                disabled={btnUbah}
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                </Card.Body>
                            </Card>
                            <Card className='mb-2'>
                                <Card.Body>
                                {formPros ?
                                    <Accordion defaultActiveKey={['0']} alwaysOpen>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Accordion Item #1</Accordion.Header>
                                            <Accordion.Body>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                            aliquip ex ea commodo consequat. Duis aute irure dolor in
                                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                            culpa qui officia deserunt mollit anim id est laborum.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>Accordion Item #2</Accordion.Header>
                                            <Accordion.Body>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                            aliquip ex ea commodo consequat. Duis aute irure dolor in
                                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                            culpa qui officia deserunt mollit anim id est laborum.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                    :
                                    <h6>Belum Ada Pengeluaran Barang</h6>
                                }
                                </Card.Body>
                            </Card>
                            
                        </div>
                        
                        <div className="col-md-2 mb-5">
                            <Card className='mb-2'>
                                <Button 
                                    variant="outline-danger"
                                    className='m-2'
                                    disabled={btnUbah}
                                    onClick={(e)=>handlePengajuan(e)}
                                >
                                    Pengajuan
                                </Button>
                            </Card>
                            <Card className='mb-2'>
                                <Button 
                                    variant="outline-primary"
                                    className='m-2'
                                    disabled={btnVery}
                                    onClick={handleVerify}
                                >
                                    Verifikasi
                                </Button>
                            </Card>
                            <Card className='mb-2'>
                                <Button 
                                    variant="outline-warning"
                                    className='m-2'
                                    disabled={btnProses}
                                    onClick={handleProses}
                                >
                                    Form Proses
                                </Button> 
                            </Card>
                            <Card className='mb-2'>
                                <Button 
                                    variant="outline-dark"
                                    className='m-2'
                                    disabled={btnBatal}
                                    onClick={handleBatal}
                                >
                                    Batal
                                </Button> 
                            </Card>
                            
                        </div>
                    </Row>
                </Form>
            </Container>
        </div>
        {isLoading ? <LoadingPage/> : ""}
        </>
    )
}
