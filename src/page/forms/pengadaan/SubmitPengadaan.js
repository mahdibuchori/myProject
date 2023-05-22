import React, {useEffect, useState} from 'react';
import './pengadaan.css';
import Swal from "sweetalert2";
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import { Breadcrumb, Button, Card, Col, Form, Modal } from 'react-bootstrap';

import useAuthStore, { selectUser } from '../../../store/authLogin';

export const SubmitPengadaan = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userData = useAuthStore(selectUser);

    const [tgl, setTgl] = useState('');
    const [ tibar, setTibar ] = useState('');
    const [ materil, setMateril ] = useState('');

    const [ stock, setStock ] = useState();
    const [ order, setOrder ] = useState();
    const [ satuan, setSatuan ] = useState('');
    const [ spesifikasi, setSpesifikasi ] = useState('');
    
    const [inputList, setInputList] = useState([]);
    const [selectedcourse, setselectedCourse] = useState([]);
    const [listData, setListData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [dataReady, setDataReady] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    
    useEffect(() => {
        const createUniq = () => {
            let d = new Date();
            let b = d.toLocaleDateString("id-ID", {day: '2-digit', month: 'long', year: 'numeric'});
            setTgl(b);
        }
        createUniq()
    }, []);

    useEffect(() => {
        setIsLoading(true);
        if(location.state === null) {
            backhome(`/main/${userData.user_divisi}/Pengadaan`);
            Swal.fire('Info','Harap kembali ke halaman permintaan data tidak lengkap', 'info');
            setIsLoading(false);
        }
        else{
            setMateril(location.state.data.material[0].material);
            setTibar(location.state.data.material[0].tipe);
            setSatuan(location.state.data.qty_pengadaan[0].satuan);
            setStock(location.state.data.qty_pengadaan[0].stock);
            setOrder(location.state.data.qty_pengadaan[0].order);
            setSpesifikasi(location.state.data.spesifikasi);
            setInputList(location.state.data.parsial_data);
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect (() => {
        if(!dataReady) return;
        const gntiDta = async () =>{
            console.log(listData)
            setDataReady(false);
        } 

        gntiDta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dataReady])

    const handleSubmit =async (event) => {
        event.preventDefault();
        if(String(location.state.data.status).toUpperCase() === "VERIFIKASI"){
            if(selectedcourse.length === 0){
                Swal.fire('Info','Harap pilih parsial tanggal','info');
            }
            else{
                savePengadaan();
            }
        }
        else{
            Swal.fire('info','Tidak dapat melanjutkan untuk pembuatan PO, data pengadaan belum terverifikasi','warning')
        }
    };

    const savePengadaan = async () =>{
        let data = selectedcourse;
        const sum = data.reduce((accumulator, object) => {
            return parseFloat(accumulator) + parseFloat(object.qty);
            }, 0);
        console.log(sum)
        let file = {
            id_Pengadaan : location.state.data.id_Pengadaan,
            t_pengadaan : tgl,
            user : [{
                pemohon : location.state.data.user[0].pemohon,
                jabatan : location.state.data.user[0].jabatan,
                divisi : location.state.data.user[0].divisi,
                plan : location.state.data.user[0].plan,
            }],
            status : location.state.data.status,
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
            parsial_data : selectedcourse,
            sumParsi : sum, 
            nopo : "",
        }
        navigate(`/main/${userData.user_divisi}/Pengadaan/NewCreate`,{state:{
            data : file
          }});
        
    }

    const handlecheckbox = (e) => {
        let temp = selectedcourse;
        if(e.target.checked===false){
          temp = temp.filter((a) => {
            return a !== inputList[e.target.value];
          });
          console.log(temp)
        }  
        
        let data = inputList[e.target.value];
        
        e.target.checked
          ? setselectedCourse([...selectedcourse, data ])
          : setselectedCourse([...temp]);
    };

    const handleUpdate = (e) =>{
        let listDatas = [];
        for(let x = 0; x < inputList.length; x++){
            if(inputList[x].po === ""){
                console.log("")
            }
            else{
                listDatas.push(inputList[x].po)
            }
        }
        const unique1 = [...new Set(listDatas)];
        setListData(unique1);
        handleShow();
    }

    

    const backhome = (e) =>{
        navigate(e);
    }
    return (
        <>
        <div className='pengadaan'>
            <div className='pengadaan-item-top'>
                <div>
                    <Breadcrumb>
                    <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => backhome(`/main/${userData.user_divisi}/Pengadaan`)}>Pengadaan</Breadcrumb.Item>
                    <Breadcrumb.Item active>Create PO</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <div className='pengadaan-item-create'>
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
                                            value={location.state.data.id_Pengadaan}
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
                                            value={location.state.data.t_pengadaan}
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
                                            value={location.state.data.user[0].pemohon}
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
                                            value={location.state.data.user[0].jabatan}
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
                                            value={location.state.data.user[0].plan}
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
                                            value={location.state.data.status}
                                            disabled
                                        />
                                    </Form.Group>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-8 mb-1">
                        <Card className="mb-1">
                            <Card.Body>
                                <div className="row p-1">
                                    <div className='col-lg-3'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Tipe Material</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                value={tibar}
                                                disabled = {true}
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
                                                value={materil}
                                                disabled
                                                required
                                            />
                                        </Form.Group>
                                    </div>

                                </div>
                                <div className="row p-1">
                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Jumlah Stok</Form.Label>
                                            <Form.Control 
                                                    required
                                                    type="number"
                                                    value={stock}
                                                    disabled={true}
                                                />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom02">
                                            <Form.Label>Jumlah Order</Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                value={order}
                                                disabled={true}
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-4'>
                                        <Form.Group as={Col} controlId="validationCustom02">
                                            <Form.Label>Satuan</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                value={satuan}
                                                disabled={true}
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="row p-1">
                                    <Form.Group as={Col} controlId="formGridArea">
                                        <Form.Label>Spesifikasi</Form.Label>
                                        <Form.Control 
                                            as="textarea" 
                                            aria-label="With textarea" 
                                            value={spesifikasi}
                                            rows={2}
                                            disabled
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Harap Masukan Spesifikasi Data Pengadaan barang
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                            </Card.Body>
                        </Card>
                        
                        <h5 className='mt-1'>Parsial Data Kedatangan & Qty Material</h5>
                        {inputList.map((x, i) => {
                            let cara = true;
                            if(x.po === ""){
                                cara = false;
                            }
                            return(
                                <Card className="mb-2" >
                                    <Card.Body>
                                        <div className="form-check">
                                            <input 
                                                className="form-check-input"
                                                type="checkbox" 
                                                value={i}
                                                disabled={cara}
                                                onClick={handlecheckbox}
                                            />
                                            <label className="form-check-label" for="flexCheckDefault">
                                                Parsial Ke-{i+1}
                                            </label>
                                        </div>
                                        <div className="row">
                                            <div className='col-lg-4'>
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Tanggal Kirim</Form.Label>
                                                    <Form.Control
                                                    required
                                                    name="tglDatang"
                                                    type="date"
                                                    placeholder="Tanggal Kirim"
                                                    value={x.tglDatang}
                                                    className="m-0"
                                                    disabled
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
                                                    disabled
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className='col-lg-4'>
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>No PO</Form.Label>
                                                    <Form.Control
                                                    required
                                                    name="po"
                                                    type="text"
                                                    placeholder="No PO"
                                                    value={x.po}
                                                    disabled
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>
                                        <div className="row p-1">
                                            <Form.Group as={Col} controlId="formGridArea">
                                                <Form.Control 
                                                    as="textarea" 
                                                    aria-label="With textarea" 
                                                    value={x.expro}
                                                    rows={1}
                                                    disabled
                                                    required
                                                />
                                            </Form.Group>
                                        </div>
                                </Card.Body>
                                </Card>
                            )
                        })}
                        <div style={{display: 'flex', justifyContent:'flex-end', width: '100'}}>
                            <Button 
                                type="submit"
                                variant="outline-secondary"
                                style={{marginLeft : 20}}
                                onClick={handleUpdate}
                                >
                                Update PO
                            </Button>
                            <Button 
                                type="submit"
                                variant="outline-primary"
                                onClick={handleSubmit}
                                style={{marginLeft : 20}}>
                                Create PO
                            </Button>
                        </div> 
                    </div>
                </div>
            </div>
        
        </div>

        <Modal show={show} onHide={handleClose} animation={true} centered>
            <Modal.Header>
            <Modal.Title>List PO Update</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {listData.map(function(element){
                    return (
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" value={element}/>
                            <label class="form-check-label" for="flexRadioDefault1">
                                {element}
                            </label>
                        </div>
                    )
                })}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>

        {isLoading ? <LoadingPage /> : ""}
        
        </>
    )
}
