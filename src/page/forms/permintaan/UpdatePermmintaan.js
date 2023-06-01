import React, { useState, useEffect } from 'react';
import './permintaan.css';
import Swal from "sweetalert2";
import { API_AUTH } from '../../../apis/apisData';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import { Breadcrumb, Button, Card, Col, Container, Form, Stack } from 'react-bootstrap';

export const UpdatePermmintaan = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const userData = useAuthStore(selectUser);

    const [idPermintaan, setIdPermintaan] = useState("");
    const [ okp, setOkp ] = useState('');
    const [tglTerima, setTglTerima] = useState("");
    const [tipe, setTipe] = useState("");
    const [item, setItem] = useState("");
    const [estimasi, setEstimasi] = useState("");
    const [pengajuan, setPengajuan] = useState(0);
    const [satuan, setSatuan] = useState("");
    const [kirim, setKirim] = useState("");
    const [status, setStatus] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [color, setColor] = useState("");
    const [bgColor, setBgColor] = useState("");
    const [waktu, setWaktu] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        if(location.state === null) {
            backhome(`/main/${userData.user_divisi}/Permintaan`);
            Swal.fire('Info','Harap kembali ke halaman permintaan data tidak lengkap', 'info')
        };
        const today = new Date();
        let hour = today.getHours();
        let minute = today.getMinutes();
        let hh = String(hour).padStart(2, '0');
        let mm = String(minute).padStart(2, '0');
        const time = hh + ':' + mm ;
        setWaktu(time)
        cekData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cekData = () =>{
        let nilai = 0;
        if(location.state.data.jml_item[0]?.jmlEstimasi === null || location.state.data.jml_item[0]?.jmlEstimasi === 0){
            nilai = 0;
        }
        else{
            nilai = (parseFloat(location.state.data.jml_item[0]?.jmlEstimasi) * 1000) /1000;
        }
        setIdPermintaan(location.state.data.id_permintaan);
        setOkp(location.state.data.id_okp);
        setTglTerima(location.state.data.tgl_okp);
        setTipe(location.state.data.tipe);
        setItem(location.state.data.nama_item);
        setEstimasi(nilai)
        setSatuan(location.state.data.satuan);
        setKeterangan(location.state.data.keterangan);
        setStatus(location.state.data.status_item)
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
        setIsLoading(false);
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.stopPropagation();
          setValidated(true);
        }
        else{
            updatePermintaan()
        }
    
        
    };

    const updatePermintaan = async () =>{
        setIsLoading(true);
        try {
            const data =[{
                "id" : idPermintaan,
                "okp" : okp,
                "item" : item,
                "tPermintaan" : tglTerima,
                "pemohon" : userData.user_name,
                "divisi" : userData.user_divisi,
                "pengajuan" : pengajuan,
                "waktu" : kirim,
                "keterangan" : keterangan,
                "plan" : userData.user_plan,
                "now" : waktu
            }];
            console.log(data)
            const next = await API_AUTH.put(`/editpermintaan`, {
                "id" : idPermintaan,
                "okp" : okp,
                "item" : item,
                "tPermintaan" : tglTerima,
                "pemohon" : userData.user_name,
                "divisi" : userData.user_divisi,
                "pengajuan" : pengajuan,
                "waktu" : kirim,
                "now" : waktu,
                "keterangan" : keterangan,
                "plan" : userData.user_plan
            });
            Swal.fire(`${next.data.message}`, backhome(`/main/${userData.user_divisi}/Permintaan`), 'success');
            setIsLoading(false)
        } catch (error) {
            console.log(error.message)
            setIsLoading(false)
        }
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
                            <Breadcrumb.Item active>Update</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="bg-light border ms-auto"></div>
                    <div className="vr" />
                    <div className="bg-light border">
                        <Button variant="primary"  style={{marginRight: 10}} onClick={() => backhome(`/main/${userData.user_divisi}/Permintaan`)}><i class="bi bi-backspace"></i> Kembali</Button>
                    </div>
                </Stack>
            </div>
            <div className='permintaanSet-item-top'>
                <h5>Permintaan Update</h5>
            </div>
            <Container>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-4 mb-1">
                            <Card className='mb-1'>
                                <Card.Body>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>No OKP</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={okp}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Tanggal Permintaan</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={tglTerima}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Pemohon</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={userData.user_name}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Divisi</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={userData.user_divisi}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row p-2">
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
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-8 mb-1">
                            <Card className="mb-4">
                                <Card.Body>
                                    <div className="row p-2">
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
                                    <div className="row p-2">
                                        <div className='col-lg-6'>
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Qty Estimasi</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="number"
                                                    disabled
                                                    value={estimasi}

                                                />
                                                <Form.Control.Feedback type="invalid">Harap Input Qty Pengajuan</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className='col-lg-6'>
                                            <Form.Group as={Col} controlId="validationCustom02">
                                                <Form.Label>Qty Pengajuan</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="number"
                                                    onChange={ (e) => setPengajuan(e.target.value) }
                                                />
                                                <Form.Control.Feedback type="invalid">Harap Input Qty Pengajuan</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row p-2">
                                        <div className='col-lg-6'>
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Satuan</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    disabled
                                                    value={satuan}

                                                />
                                                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className='col-lg-6'>
                                            <Form.Group as={Col} controlId="validationCustom02">
                                                <Form.Label>Waktu Pengiriman</Form.Label>
                                                <Form.Control
                                                    required
                                                    type='time'
                                                    value={kirim}
                                                    onChange={ (e) => setKirim(e.target.value) }
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
                                            />
                                        </Form.Group>
                                        </div>
                                    </div>
                                    <div className="d-flex py-3 flex-column flex-lg-row">
                                        <Button type="submit">Submit form</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </Form>
            </Container>
        </div>
        {isLoading ? <LoadingPage/> : ""}
        </>
    )
}
