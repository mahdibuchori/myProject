import React, {useEffect, useState} from 'react';
import './dataSparepart.css';
import Swal from "sweetalert2";
import id from 'date-fns/locale/id';
import { formatInTimeZone } from 'date-fns-tz';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_AUTH } from '../../../apis/apisData';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import { Breadcrumb, Button, Card, Col, Form } from 'react-bootstrap';

import useAuthStore, { selectUser } from '../../../store/authLogin';
import usePartStore, { selectPartID, selectFetchPartID, selectPartReadyID, selectFalsePartID } from '../../../store/ListPart';

export const PengajuanPart = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const status = 'Pengajuan';
    const tibar = 'Lain-Lain'
    const userData = useAuthStore(selectUser);
    const onPart = usePartStore(selectFetchPartID);
    const dataPart = usePartStore(selectPartID);
    const partReady = usePartStore(selectPartReadyID);
    const partFalse = usePartStore(selectFalsePartID);

    const [kode, setKode] = useState('');
    const [tgl, setTgl] = useState('');

    const [ materil, setMateril ] = useState('');

    const [ stock, setStock ] = useState();
    const [ order, setOrder ] = useState();
    const [ satuan, setSatuan ] = useState('');
    const [ spesifikasi, setSpesifikasi ] = useState('');
    
    const [inputList, setInputList] = useState([{ tglDatang: '', qty: '', expro: '', po: '', noAkun: '' }]);
    
    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const createUniq = () => {
            let bln = formatInTimeZone(new Date(), 'Asia/Jakarta', 'MM', { locale: id });
            let tahu = formatInTimeZone(new Date(), 'Asia/Jakarta', 'yy', { locale: id });
            const xsd = Math.random().toString(36).slice(-4);
            let d = new Date();
            let b = d.toLocaleDateString("id-ID", {day: '2-digit', month: 'long', year: 'numeric'});
            setTgl(b);
            setKode(xsd.toUpperCase()+bln+tahu);
        }
        createUniq()
    }, []);

    useEffect(() => {
        // setIsLoading(true);
        if (!partReady) return;
        cekDataUpdate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [partReady]);

    useEffect(() => {
        setIsLoading(true);
        if(location.state === null) {
            backhome(`/main/${userData.user_divisi}/Pengadaan`);
            Swal.fire('Info','Harap kembali ke halaman permintaan data tidak lengkap', 'info')
        }
        else{
            cekData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cekData = async () =>{
        const idOrder = location.state.data.id_pengajuan;
        if(!idOrder){
            backhome(`/main/${userData.user_divisi}/Pengadaan`);
            Swal.fire('Info','Harap kembali ke halaman permintaan data tidak lengkap', 'info')
        }
        else{
            setIsLoading(true);
            await partFalse()
            await onPart(idOrder,userData.user_plan);
        }
        setIsLoading(false)
    }

    const cekDataUpdate = async () =>{
        console.log(userData)
        setMateril(dataPart.nama_item);
        setStock(dataPart.stok);
        setOrder(dataPart.qty_order);
        setSatuan(dataPart.unit);
        setSpesifikasi(dataPart.keterangan)
        setIsLoading(false)
    }

    const handleSubmit =async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        console.log(form.checkValidity());
        if(tibar === "" || tibar === null){
            Swal.fire('Info','Harap pilih tipe barang','warning')
        }
        else if(materil === "" || materil === null){
            Swal.fire('Info','Harap isikan nama material','warning')
        }
        else if(satuan === "" || satuan === null){
            Swal.fire('Info','Harap isikan satuan material','warning')
        }
        else if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          setValidated(true);
        }
        else{
            if(materil === "" || materil === null){
                Swal.fire('Info','Harap isikan nama material','warning')
            }
            else if(satuan === "" || satuan === null){
                Swal.fire('Info','Harap isikan satuan material','warning')
            }
            else{
                setIsLoading(true);
                savePengadaan();
            }
            
        }
        
    };

    const savePengadaan = async () =>{
        try {
            const date = new Date();
            let mm = parseInt(date.getMonth()) + 1;
            let yy = date.getFullYear();
            let bulan = String(mm).padStart(2, '0');
            console.log({
                id_item : location.state.data.id_item,
                id_order : location.state.data.id_pengajuan,
                nama_item : materil,
                id_Pengadaan : kode,
                t_pengadaan : tgl,
                user : [{
                    pemohon : userData.user_name,
                    jabatan : userData.user_status,
                    divisi : userData.user_divisi,
                    plan : userData.user_plan,
                }],
                status : status,
                material : [{
                    tipe : tibar,
                    material : materil
                }],
                qty_pengadaan : [{
                    stock : stock,
                    order : order,
                    satuan : satuan
                }],
                spesifikasi : spesifikasi,
                parsial_data : inputList,
                tgl_verify : "",
                tgl_approve : ""
            })
            const next = await API_AUTH.post(`/verifyPart`, {
                id_item : location.state.data.id_item,
                id_order : location.state.data.id_pengajuan,
                nama_item : materil,
                id_Pengadaan : kode,
                t_pengadaan : tgl,
                user : [{
                    pemohon : userData.user_name,
                    jabatan : userData.user_status,
                    divisi : userData.user_divisi,
                    plan : userData.user_plan,
                }],
                status : status,
                material : [{
                    tipe : tibar,
                    material : materil
                }],
                qty_pengadaan : [{
                    stock : stock,
                    order : order,
                    satuan : satuan
                }],
                spesifikasi : spesifikasi,
                parsial_data : inputList,
                tgl_verify : "",
                tgl_approve : "",
                filter_bulan : `${yy}-${bulan}`,
            });
            Swal.fire(`${next.data.success}`, backhome(`/main/${userData.user_divisi}/Sparepart`), 'success');
            setIsLoading(false);
        } catch (error) {
            Swal.fire('Info', `${error.response.data.message}`, 'warning');
            setIsLoading(false);
        }
    }

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value.toUpperCase();
        setInputList(list);
    };
    
    const handleRemoveClick = (index) => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    const handleAddClick = () => {
        setInputList([...inputList, { tglDatang: '', qty: '', expro: '', po: '', noAkun: '' }]);
    };

    const backhome = (e) =>{
        navigate(e)
    }
    return (
        <>
        <div className='dataspare'>
            <div className='dataspare-item-top'>
                <div>
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                        <Breadcrumb.Item onClick={() => backhome(`/main/${userData.user_divisi}/Sparepart`)}>Table Spare Part</Breadcrumb.Item>
                        <Breadcrumb.Item active>Create Pengadaan</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <div className='pengadaan-item-create'>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-4 mb-1">
                            <Card className='mb-1'>
                                <Card.Body>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Kode</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Id Pengadaan"
                                                value={kode}
                                                disabled = {true}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Tanggal Pengadaan</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Tanggal Pengadaan"
                                                value={tgl}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    {/**/}
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Nama</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                value={userData.user_name}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Jabatan</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                value={userData.user_status}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Plan</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Plan"
                                                className='btn btn-primary mb-1'
                                                value={userData.user_plan}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Status Pengadaan</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Status Pengadaan"
                                                className='btn btn-danger mb-1'
                                                value={status}
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
                                        <div className='col-lg-3'>
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Tipe Material</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    value={tibar}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </div>

                                        <div className='col-lg-9'>
                                            <Form.Group as={Col} controlId="validationCustom02">
                                                <Form.Label>Nama Material</Form.Label>
                                                <Form.Control 
                                                    as="textarea" 
                                                    aria-label="With textarea" 
                                                    rows={1}
                                                    disabled
                                                    value={materil}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Harap masukan nama material
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row p-2">
                                        <div className='col-lg-4'>
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Jumlah Stok</Form.Label>
                                                <Form.Control 
                                                        required
                                                        type="number"
                                                        value={stock}
                                                        disabled={false}
                                                    />
                                                <Form.Control.Feedback type="invalid">
                                                    Harap Input Jumlah Stok
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className='col-lg-4'>
                                            <Form.Group as={Col} controlId="validationCustom02">
                                                <Form.Label>Jumlah Order</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="number"
                                                    value={order}
                                                    onChange={(e) => {
                                                        setOrder(e.target.value)
                                                    }}
                                                />
                                                <Form.Control.Feedback type="invalid">Harap Input Qty Pengajuan</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className='col-lg-4'>
                                            <Form.Group as={Col} controlId="validationCustom02">
                                                <Form.Label>Satuan</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    value={satuan}
                                                    disabled
                                                />
                                                <Form.Control.Feedback type="invalid">Harap Input Qty Pengajuan</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className="row p-2">
                                        <Form.Group as={Col} controlId="formGridArea">
                                            <Form.Label>Spesifikasi</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                aria-label="With textarea" 
                                                placeholder='Harap isikan merk, ukuran, dan data yang lengkap'
                                                defaultValue={spesifikasi}
                                                onChange={(e) => {
                                                    setSpesifikasi(e.target.value)
                                                }}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Harap Masukan Spesifikasi Data Pengadaan barang
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className="mb-2">
                                <Card.Body>
                                    <h4 className='mt-2'>Parsial Data Kedatangan & Qty Material</h4>
                                    {inputList.map((x, i) => {
                                        return(
                                        <div className="row mt-2">
                                            <h6>Parsial Ke-{i+1}</h6>
                
                                            <div className='col-lg-5'>
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Tanggal Kirim</Form.Label>
                                                <Form.Control
                                                required
                                                name="tglDatang"
                                                type="date"
                                                placeholder="Tanggal Kirim"
                                                value={x.tglDatang}
                                                onChange={(e) => handleInputChange(e, i)}
                                                />
                                            </Form.Group>
                                            </div>
                                            
                                            <div className='col-lg-4'>
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Qty</Form.Label>
                                                <Form.Control
                                                required
                                                name="qty"
                                                type="number"
                                                placeholder="qty"
                                                value={x.qty}
                                                onChange={(e) => handleInputChange(e, i)}
                                                />
                                            </Form.Group>
                                            </div>

                                            <div className='col-lg-3'>
                                            <Form.Group as={Col} controlId="validationCustom02">
                                                <Form.Label>Action</Form.Label>
                                                <div style={{display: "flex"}}>
                                                {inputList.length !== 1 && (
                                                    <Button variant="primary" onClick={() => handleRemoveClick(i)} style={{height: "35px"}}>
                                                    <i className="bi bi-trash"></i>&nbsp;Hapus
                                                    </Button>
                                                )}
                                                {inputList.length - 1 === i && (
                                                    <Button variant="success" onClick={() => handleAddClick(i)} style={{height: "35px", marginLeft: "10px"}}><i className="bi bi-plus-square"></i>&nbsp;Add</Button>
                                                )}
                                                </div>
                                            </Form.Group>
                                            </div>
                                            
                                        </div>
                                        )
                                    })}
                                </Card.Body>
                            </Card>
                            <div style={{display: 'flex', justifyContent:'flex-end', width: '100'}}>
                                <Button type="submit">Submit form</Button>
                            </div> 
                        </div>
                    </div>
                </Form>
            </div>
        
        </div>

        {isLoading ? <LoadingPage /> : ""}
        
        </>
    )
}
