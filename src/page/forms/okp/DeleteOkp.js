import React, { useState, useEffect } from 'react';
import './okp.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import { Breadcrumb, Button, Card, Col, Form, Stack, Tab, Tabs } from 'react-bootstrap';

import useAuthStore, { selectUser } from '../../../store/authLogin';
import useBomStore, {selectBom, selectFetchBom, selectBomReady} from '../../../store/listBom';
import useOkpStore, {selectDeleteOKP,selectFetchDelOKP,selectFalseDelOkp,selectFetchDelNote,selectFalseDeleteNote} from '../../../store/dataOkp';


export const DeleteOkp = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const userData = useAuthStore(selectUser);
    const onBom = useBomStore(selectFetchBom);
    const dataBom = useBomStore(selectBom);
    const bomReady = useBomStore(selectBomReady);

    const deleteOkp = useOkpStore(selectDeleteOKP);
    const fetchDeleteOKP = useOkpStore(selectFetchDelOKP);
    // const deleteReady = useOkpStore(selectDelReady);
    const falseDeleteOkp = useOkpStore(selectFalseDelOkp);

    // const noteOKP = useOkpStore(selectDeleteNote);
    const fetchNoteDeleteOKP = useOkpStore(selectFetchDelNote);
    // const noteReady = useOkpStore(selectDeleNotReady);
    const falseNoteDeleteOkp = useOkpStore(selectFalseDeleteNote);
    
    const [fileOkp, setFileOkp] = useState(false);
    const [fileNote, setFileNote] = useState(false);

    const [okp, setOkp] = useState('');
    const [tglOkp, setTglOkp] = useState('');
    const [tglProd, setTglProd] = useState('');
    const [tglRevisi, setTglRevisi] = useState('');
    const [revisi, setRevisi] = useState('');
    
    const [no, setNo] = useState('');
    // const [panjangNote, setPanjangNote] = useState('');
    const [id, setId] = useState('');
    const [produk, setProduk] = useState([]);
    const [varian, setVarian] = useState('');
    
    const [revisiProd, setRevisiProd] = useState([]);
    const [batch, setBatch] = useState(0);
    const [selectItem, setSelectItem] = useState([]);
    const [selectItemRev, setSelectItemRev] = useState([]);

    const [noProduk, setNoProduk] = useState('');
    const [noteData, setNoteData] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isTrue, setIsTrue] = useState(true);
    const [validated, setValidated] = useState(false);
    
    useEffect(() => {
        console.log(isTrue)
        setIsLoading(true);
        if(location.state === null) Swal.fire('Info','Harap kembali ke halaman okp data tidak lengkap', 'info');
        console.log(location.state)
        setOkp(location.state.okp);
        setTglOkp(location.state.selectTgl);
        setTglProd(location.state.produksi);
        setRevisi(location.state.revisiOK);
        setTglRevisi(location.state.tglRevisi);
        let sinyal = location.state.setData;
        if(sinyal === "updateOKP"){
            setFileOkp(false);
            setFileNote(true);
        }
        else{
            setFileOkp(true);
            setFileNote(false);
        }
        cekData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {   
        onBom()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsLoading(true);
        if (!bomReady) return;
        cekData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bomReady]);

    const cekData = () =>{
        setIsLoading(false);
        setIsTrue(false)
        console.log(dataBom);
    
        let sinyal = location.state.setData;
        if(sinyal === "updateOKP"){
            let modifiedArr = dataBom.map(function(element){
                return { value: element.deskripsi_item.toUpperCase(), label: element.deskripsi_item.toUpperCase() };
            });
            const item = modifiedArr.filter(x => x.value.toUpperCase() === location.state.data.produk.toUpperCase());
    
            setSelectItemRev([])
            const items = dataBom.filter(x => x.deskripsi_item.toUpperCase() === location.state.data.produk.toUpperCase())
            let modifiedArr1= items.map(function(element){
                return { value: element.revisi, label: element.revisi };
            });
            setSelectItemRev(modifiedArr1);
    
            setProduk(item);
            setSelectItem(modifiedArr)
            setNo(location.state.data.no);
            setId(location.state.data.kodeOKP)
            setVarian(location.state.data.varian)
            setBatch(location.state.data.batch)
            setRevisiProd({'value': `${location.state.data.revisi}`,'label': `${location.state.data.revisi}` })
        }
        else{
            setNoProduk(location.state.data.no)
            setNoteData(location.state.data.note)
            // setFileNote(false);
        }
    }

    const handleSubmit =async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          setValidated(true);
        }
        else{
            let sinyal = location.state.setData;
            if(sinyal === "updateOKP"){
                if(batch === ""){
                    Swal.fire('Info','Qty batch tidak boleh kosong','warning');
                }
                else{
                    const splitOkp = tglOkp.split("/");
                    const splitProd = tglProd.split("/");
                    let tglOK = splitOkp[2]+'/'+splitOkp[1]+'/'+splitOkp[0];
                    let tglPro = splitProd[2]+'/'+splitProd[1]+'/'+splitProd[0];
                    let revLama = `${location.state.data.revisi}`;
                    const items = selectItemRev.filter(x => x.value.toUpperCase() === revLama.toUpperCase());
                    console.log(items)
                    setIsLoading(true);
                    await falseDeleteOkp();
                    await fetchDeleteOKP(tglOK,tglPro,revisi,no);
                    
                    if(deleteOkp?.data.length === 0){
                        Swal.fire("Info","Harap ulangi proses penyimpanan data","info");
                        await falseDeleteOkp();
                        setIsLoading(false);
                    }   
                    else{
                        if(deleteOkp?.data[0].info === "Berhasil Dihapus"){
                            if(items.length === 0){
                                Swal.fire('Saved!Hapus Tanpa Simpan di db', backhome(`/main/${userData.user_divisi}/OKP`), 'success');
                                setIsLoading(false);
                            }
                            else{
                                deletePermintaan(tglOK);
                                await falseDeleteOkp();
                                console.log("delete okp");
                            }
                        }
                        else{
                            Swal.fire("Info","Harap ulangi proses penyimpanan data","info");
                            await falseDeleteOkp();
                            setIsLoading(false);
                        }
                    } 
                }
            }
            else{
                Swal.fire('info','Harap Tab Note','info')
            }
        }
    };
    const deletePermintaan = async (tglOK) =>{
        const item = dataBom.filter(x => x.deskripsi_item.toUpperCase() === produk[0]?.value.toUpperCase());
        console.log(item[0]?.list_material);
        // Swal.fire('Saved!Hapus Tanpa Simpan di db', backhome(`/main/${userData.user_divisi}/OKP`), 'success');
        setIsLoading(false);
        if(item.length === 0){
            Swal.fire("Info","Harap ulangi proses penyimpanan data","info");
        }
        else{
            let tData = item[0]?.list_material.length;
            let revLama = `${location.state.data.revisi}`;
            let batchLama = `${location.state.data.batch}`;
            let proses = [];
            for(let x  = 0 ; x <tData ; x++) {
                if(item[0]?.revisi.toUpperCase() === revLama.toUpperCase()){
                    let lamaBatch = parseFloat(batchLama)
                    let totalQty = parseFloat(item[0]?.list_material[x].qty) * lamaBatch; 
                    
                    proses.push({
                        'okp': okp,
                        'tokp' : tglOK, 
                        'nama_item' : item[0]?.list_material[x].material,
                        'jml_Awal' : parseFloat(totalQty).toFixed(3),
                        'jml_Akhir' : "0",
                        'satuan' : item[0]?.list_material[x].satuan,
                        "status_item" : "",
                        "pemohon" : "",
                        "pemverifikasi" : "",
                        "pengirim" : "",
                        "list_data" : [],
                        "tipe" : item[0]?.list_material[x].tipe,
                        "plan": userData.user_plan,
                    })
                    try {
                        await axios.put(`http://localhost:8081/dpanel/upermintaan`, {
                            'okp': okp,
                            'tokp' : tglOK, 
                            'nama_item' : item[0]?.list_material[x].material,
                            'jml_Awal' : parseFloat(totalQty).toFixed(3),
                            'jml_Akhir' : "0",
                            'satuan' : item[0]?.list_material[x].satuan,
                            "status_item" : "",
                            "pemohon" : "",
                            "pemverifikasi" : "",
                            "pengirim" : "",
                            "list_data" : [],
                            "tipe" : item[0]?.list_material[x].tipe,
                            "plan": userData.user_plan,
                    });
                    } catch (error) {
                        console.log(error.message)
                    }
                }


                
            }
            console.log(proses)
            Swal.fire('Saved!', backhome(`/main/${userData.user_divisi}/OKP`), 'success');
            setIsLoading(false)

            
            
        }
    }

    const handleDelete = async (e) =>{
        e.preventDefault();
        const splitOkp = tglOkp.split("/");
        const splitProd = tglProd.split("/");
        let tglOK = splitOkp[2]+'/'+splitOkp[1]+'/'+splitOkp[0];
        let tglPro = splitProd[2]+'/'+splitProd[1]+'/'+splitProd[0];
        // let revLama = `${location.state.data.revisi}`;

        let resNo = "";
        // let resNoLama = "";
        let resNote = "";
        // let resNoteLama = "";
        let noAw = `${location.state.data.no}`;
        resNo = `${noAw}`.replace(/&/g, "kodeDan");
        resNo = resNo.replace(/!/g, "kodeSeru");
        resNo = resNo.replace(/#/g, "kodePagar");
        resNo = resNo.replace(/@/g, "kodeAdd");
        resNo = resNo.replace(/%/g, "kodePersen");
        resNo = resNo.replace(/,/g, "kodeKoma");

        let awst = `${location.state.data.note}`;
        resNote =  `${awst}`.replace(/&/g, "kodeDan");
        resNote = resNote.replace(/!/g, "kodeSeru");
        resNote = resNote.replace(/#/g, "kodePagar");
        resNote = resNote.replace(/@/g, "kodeAdd");
        resNote = resNote.replace(/%/g, "kodePersen");
        resNote = resNote.replace(/,/g, "kodeKoma");

        
        if(resNote === "" || resNote === null || resNote === undefined){
            Swal.fire('Info','Harap isi keterangan note','warning')
        }
        else{
            setIsLoading(true);
            await falseNoteDeleteOkp();
            await fetchNoteDeleteOKP(tglOK,tglPro,revisi,resNo,resNote);
            Swal.fire('Saved!', backhome(`/main/${userData.user_divisi}/OKP`), 'success');
            setIsLoading(false);
        }
    }

    const backhome = (e) =>{
        navigate(e);
    }
  return (
    <>
    <div className='okpSet'>
        <Stack direction="horizontal" gap={3}>
            <div className="bg-light ">
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}/OKP`)}>OKP</Breadcrumb.Item>
                    <Breadcrumb.Item active>Delete</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="bg-light  ms-auto"></div>
            <div className="bg-light ">
                <Button variant="outline-primary"  style={{marginRight: 10}} onClick={() => backhome(`/main/${userData.user_divisi}/OKP`)}><i class="bi bi-backspace"></i> Kembali</Button>
            </div>
        </Stack>

        <div className="row mt-3">
            <div className='col-lg-4'>
                <Card className='mb-4'>
                    <Card.Body>
                        <h3 class="h6">No. OKP</h3>
                        <h6>{okp}</h6>
                    </Card.Body>
                </Card>
            </div>
            <div className="col-md-8">
                <Card className='mb-1'>
                    <div className="row p-2">
                        <div className='col-lg-6'>
                            <Form.Group as={Col} controlId="validationCustom01">
                                <Form.Label>Tgl OKP</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={tglOkp}
                                    disabled
                                />
                            </Form.Group>
                        </div>

                        <div className='col-lg-6'>
                            <Form.Group as={Col} controlId="validationCustom02">
                                <Form.Label>Tgl Produksi</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={tglProd}
                                    disabled
                                />
                            </Form.Group>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className='col-lg-6'>
                            <Form.Group as={Col} controlId="validationCustom01">
                                <Form.Label>Tgl Revisi</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={tglRevisi}
                                    disabled
                                />
                            </Form.Group>
                        </div>

                        <div className='col-lg-6 mb-1'>
                            <Form.Group as={Col} controlId="validationCustom02">
                                <Form.Label>Revisi</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={revisi}
                                    disabled
                                />
                            </Form.Group>
                        </div>
                    </div>
                </Card>
            </div>
        </div>

        <Tabs
            defaultActiveKey={'home'}
            transition={true}
            className="mb-3"
        >
            <Tab eventKey="home" title="OKP" disabled={fileOkp}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-1">
                            <Card className='mb-1'>
                                <div className="row p-2">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>No OKP</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={no}
                                            disabled
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">ID OKP tidak terbaca harap ulangi proses</Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="row p-2">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Produk</Form.Label>
                                        <Select
                                            title={"produk"}
                                            name={"produk"}
                                            value={produk}
                                            options={selectItem}
                                            onChange={(e) => {
                                                setProduk(e)
                                                // handleSelectChange(e)
                                            }}
                                            isDisabled
                                        />
                                    </Form.Group>
                                </div>
                                <div className="row p-2">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Kode</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={id}
                                            disabled
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">Kode produk tidak terbaca harap ulangi proses pilih produk</Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="row p-2">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Varian</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={varian}
                                            required
                                            disabled
                                        />
                                        <Form.Control.Feedback type="invalid">varian produk tidak terbaca harap ulangi proses pilih produk</Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                            </Card>
                        </div>
                        <div className="col-md-6 mb-5">
                            <Card className='mb-1'>
                                <div className="row p-2">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Revisi</Form.Label>
                                        <CreatableSelect 
                                            value={revisiProd}
                                            options={selectItemRev}
                                            onChange={(e) => {
                                                setRevisiProd(e)
                                            }}
                                            isDisabled
                                            isClearable 
                                        />
                                    </Form.Group>
                                </div>
                                <div className="row p-2">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Jumlah(Batch)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={batch}
                                            onChange={(e) =>setBatch(e.target.value)}
                                            disabled
                                        />
                                        <Form.Control.Feedback type="invalid">Harap Input Qty Batch</Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="row p-2">
                                    <div className='col-lg-2'></div>
                                    <div className='col-lg-10 mb-1'>
                                        
                                    </div>
                                </div>
                            </Card>
                            <Button type="submit" variant="outline-danger" className='mt-1'><i className="bi bi-trash"></i>&nbsp;Delete</Button>
                        </div>
                    </div>
                    
                    
                </Form>
            </Tab>

            <Tab eventKey="profile" title="Note" disabled={fileNote}>
                <Form noValidate onSubmit={handleDelete}>
                    <div className="row">
                        <div className="col-md-6">
                            <Card className='mb-1'>
                                <div className="row p-2">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>No Produk</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            value={noProduk}
                                            // onChange={(e) =>setNoProduk(e.target.value)}
                                            disabled
                                        />
                                    </Form.Group>
                                </div>
                                <div className="row p-2">
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Note</Form.Label>
                                    <Form.Control
                                        required
                                        as="textarea" 
                                        aria-label="With textarea" 
                                        rows={5}
                                        value={noteData}
                                        // onChange={(e) =>setNoteData(e.target.value)}
                                        disabled
                                    />
                                </Form.Group>
                                </div>
                            </Card>
                        </div>
                        <div className="col-md-6">
                            <Button type="submit" variant="outline-danger" className='mt-1'><i className="bi bi-trash"></i>&nbsp;Delete</Button>
                        </div>
                    </div>
                </Form>
            </Tab>

        </Tabs>
        
    </div>
    {isLoading ? <LoadingPage/> : ""}
    </>
  )
}
