import React, { useState, useEffect } from 'react';
import './okp.css';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { API_GSHEET } from '../../../apis/apisData';
import { API_AUTH } from '../../../apis/apisData';
import CreatableSelect from 'react-select/creatable';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import { Breadcrumb, Button, Card, Col, Form, Stack, Tab, Tabs } from 'react-bootstrap';

import useAuthStore, { selectUser } from '../../../store/authLogin';
import useBomStore, {selectBom, selectFetchBom, selectBomReady} from '../../../store/listBom';
import useOkpStore, {selectFalseSaveOkp} from '../../../store/dataOkp';

export const UpdateOkp = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const userData = useAuthStore(selectUser);
    const onBom = useBomStore(selectFetchBom);
    const dataBom = useBomStore(selectBom);
    const bomReady = useBomStore(selectBomReady);

    // const saveOkp = useOkpStore(selectSveOKP);
    // const fetchSaveOKP = useOkpStore(selectFetchSaveOKP);
    // const saveReady = useOkpStore(selectSaveReady);
    const falseSaveOkp = useOkpStore(selectFalseSaveOkp);

    // const noteOKP = useOkpStore(selectNoteOKP);
    // const fetchNoteOKP = useOkpStore(selectFetchNoteOKP);
    // const noteReady = useOkpStore(selectNoteReady);
    // const falseNoteOkp = useOkpStore(selectFalseNoteOkp);
    
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
    const [devHome, setdDevHome] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [isTrue, setIsTrue] = useState(true);
    const [validated, setValidated] = useState(false);
    
    useEffect(() => {
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
            setdDevHome(1);
        }
        else{
            setFileOkp(true);
            setFileNote(false);
            setdDevHome(2);
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
        setdDevHome(1);
        setIsLoading(false);
        setIsTrue(false)
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
            setdDevHome(2);
            setNoProduk(location.state.data.no)
            setNoteData(location.state.data.note)
            // setFileNote(false);
        }
        console.log(devHome)

    }

    const handleSelectChange = (e) => {
        console.log(e)
        const item = dataBom.filter(x => x.deskripsi_item.toUpperCase() === e.value.toUpperCase())
        console.log(item)
        const idTang = tglOkp.split("/");
        let nos = "";

        if(parseInt(no) < 10){
            nos = "0"+no;
        }
        else{
            nos = no
        }
        const tgl = idTang[0];
        const bln = idTang[1]
        const th = idTang[2].substring(2);
        const kose = "OKP"+item[0]?.id_item+th+bln+tgl+nos;

        setId(kose);
        // setRevisiProd(item[0]?.revisi);
        setVarian(item[0]?.varian);
        console.log(item)
        setSelectItemRev([])
        let modifiedArr = item.map(function(element){
            return { value: element.revisi, label: element.revisi };
        });
        console.log(modifiedArr)
        setSelectItemRev(modifiedArr)
        setRevisiProd(modifiedArr[0])
        setIsTrue(false)
    };

    const handleSubmit =async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          setValidated(true);
        }
        else{
            console.log("batch : "+batch)
            if(batch === ""){
                Swal.fire('Info','Qty batch tidak boleh kosong','warning');
            }
            else{
                const splitOkp = tglOkp.split("/");
                const splitProd = tglProd.split("/");
                let tglOK = splitOkp[2]+'/'+splitOkp[1]+'/'+splitOkp[0];
                let tglPro = splitProd[2]+'/'+splitProd[1]+'/'+splitProd[0];
                let revLama = `${location.state.data.revisi}`;
                const item = selectItemRev.filter(x => x.value.toUpperCase() === revisiProd.value.toUpperCase());
                const items = selectItemRev.filter(x => x.value.toUpperCase() === revLama.toUpperCase());
                const nMaterial = produk[0]?.value;
                setIsLoading(true);
                // await falseSaveOkp();
                // await fetchSaveOKP(tglOK,tglPro,revisi,no,id,produk[0]?.value,varian,revisiProd?.value,batch);
                const next = await API_GSHEET.get(`exec?tipe=saveOKP&date=${tglPro}&tOkp=${tglOK}&rev=${revisi}&no=${no}&idOKP=${id}&produk=${nMaterial}&batch=${batch}&varian=${varian}&revisi=${revisiProd.value}&sheet`);
                if(next.data.data.length === 0){
                    Swal.fire("Info","Harap ulangi proses penyimpanan data","info");
                    await falseSaveOkp();
                    setIsLoading(false);
                }   
                else{
                    if(next.data.data[0].info === "Tersimpan"){
                        if(item.length === 0 && items.length === 0){
                            Swal.fire('Saved!Tanpa Simpan di db', backhome(`/main/${userData.user_divisi}/OKP`), 'success');
                            setIsLoading(false);
                        }
                        else if(item.length === 1 && items.length === 0){
                            savePermintaan(tglOK);
                            await falseSaveOkp();
                        }
                        else{
                            updatePermintaan(tglOK);
                            await falseSaveOkp();
                        }
                    }
                    else{
                        Swal.fire("Info","Harap ulangi proses penyimpanan data","info");
                        await falseSaveOkp();
                        setIsLoading(false);
                    }
                } 
            }
        }
    };

    const savePermintaan = async (tglOK) =>{
        const item = dataBom.filter(x => x.deskripsi_item.toUpperCase() === produk[0]?.value.toUpperCase());
        console.log(item[0]?.list_material.length);
        if(item.length === 0){
            Swal.fire("Info","Harap ulangi proses penyimpanan data","info");
        }
        else{
            setIsLoading(true)
            let tData = item[0]?.list_material.length;
            for(let x  = 0 ; x <tData ; x++) {
                let qtyPermint = [{ jmlEstimasi: "0", JmlPermintaan: "0", JmlPengeluaran: "0" }];
                if(item[0]?.revisi.toUpperCase() === revisiProd?.value.toUpperCase()){
                    let totalQty = parseFloat(item[0]?.list_material[x].qty) * batch; 
                    parseFloat(totalQty).toFixed(2);
                    qtyPermint = [{ jmlEstimasi: String(totalQty), JmlPermintaan: "0", JmlPengeluaran: "0" }];
                }
                else{
                    qtyPermint = [{ jmlEstimasi: "0", JmlPermintaan: "0", JmlPengeluaran: "0" }];
                }
                
                try {
                    await API_AUTH.put(`/permintaan`, {
                        'okp': okp,
                        'tokp' : tglOK, 
                        'nama_item' : item[0]?.list_material[x].material,
                        'jml_item' : qtyPermint,
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
            Swal.fire('Saved!', backhome(`/main/${userData.user_divisi}/OKP`), 'success');
            setIsLoading(false)
        }

    }

    const updatePermintaan = async (tglOK) =>{
        const item = dataBom.filter(x => x.deskripsi_item.toUpperCase() === produk[0]?.value.toUpperCase());
        console.log(item[0]?.list_material.length);
        if(item.length === 0){
            Swal.fire("Info","Harap ulangi proses penyimpanan data","info");
        }
        else{
            let tData = item[0]?.list_material.length;
            let revLama = `${location.state.data.revisi}`;
            let batchLama = `${location.state.data.batch}`;

            let proses = [];
            let proses1 = [];

            for(let x  = 0 ; x <tData ; x++) {
                if(item[0]?.revisi.toUpperCase() === revLama.toUpperCase()){
                    let lamaBatch = parseFloat(batchLama)
                    let totalQty = parseFloat(item[0]?.list_material[x].qty) * lamaBatch; 
                    
                    proses.push({
                        'item' : item[0]?.list_material[x].material,
                        'satuan' : item[0]?.list_material[x].satuan,
                        'tipe' : item[0]?.list_material[x].tipe,
                        'qtyAwal' : parseFloat(totalQty).toFixed(3),
                        'qtyAkhir' : 0
                    })
                }

                if(item[0]?.revisi.toUpperCase() === revisiProd?.value.toUpperCase()){
                    let totalQty = parseFloat(item[0]?.list_material[x].qty) * batch; 
                    parseFloat(totalQty).toFixed(2);
                    proses1.push({
                        'item' : item[0]?.list_material[x].material,
                        'satuan' : item[0]?.list_material[x].satuan,
                        'tipe' : item[0]?.list_material[x].tipe,
                        'qtyAwal' : 0,
                        'qtyAkhir' : parseFloat(totalQty).toFixed(3)
                    })
                }
            }

            /* proses.push({
                'item' : "item1",
                'satuan' : "Kg",
                'tipe' : "Inggredient",
                'qtyAwal' : 100,
                'qtyAkhir' : 0
            })
            proses1.push({
                'item' : "item2",
                'satuan' : "Kg",
                'tipe' : "Inggredient",
                'qtyAwal' : 0,
                'qtyAkhir' : 101
            }) */

            let gabung = proses.concat(proses1);
            let resultArray = [];
           
            gabung.map((item) =>{
                if(resultArray.find((object) => {
                    if(object.item === item.item){
                        object.qtyAkhir = item.qtyAkhir;
                        object.satuan = item.satuan;
                        object.tipe = item.tipe;
                        return true
                    }
                    else{
                        return false
                    }
                })){
                    return true
                }
                else{
                    return resultArray.push({
                        'item' : item.item,
                        'satuan' : item.satuan,
                        'tipe' : item.tipe,
                        'qtyAwal' : item.qtyAwal,
                        'qtyAkhir' : item.qtyAkhir,
                    });
                }
            })

            for(let x  = 0 ; x <resultArray.length ; x++) {
                try {
                    await API_AUTH.put(`/upermintaan`, {
                    'okp': okp,
                    'tokp' : tglOK, 
                    'nama_item' : resultArray[x].item,
                    'jml_Awal' : `${resultArray[x].qtyAwal}`,
                    'jml_Akhir' : `${resultArray[x].qtyAkhir}`,
                    'satuan' : resultArray[x].satuan,
                    "status_item" : "",
                    "pemohon" : "",
                    "pemverifikasi" : "",
                    "pengirim" : "",
                    "list_data" : [],
                    "tipe" : resultArray[x].tipe,
                    "plan": userData.user_plan,
                });
                } catch (error) {
                    console.log(error.message)
                }
            }
            console.log(resultArray)
            Swal.fire('Saved!', backhome(`/main/${userData.user_divisi}/OKP`), 'success');
            setIsLoading(false)

            
            
        }
    }

    const saveNote = async (e) =>{
        e.preventDefault();

        const splitOkp = tglOkp.split("/");
        const splitProd = tglProd.split("/");
        let tglOK = splitOkp[2]+'/'+splitOkp[1]+'/'+splitOkp[0];
        let tglPro = splitProd[2]+'/'+splitProd[1]+'/'+splitProd[0];
        
        let resNo = "";
        let resNoLama = "";
        let resNote = "";
        let resNoteLama = "";
        
        resNo = `${noProduk}`.replace(/&/g, "kodeDan");
        resNo = resNo.replace(/!/g, "kodeSeru");
        resNo = resNo.replace(/#/g, "kodePagar");
        resNo = resNo.replace(/@/g, "kodeAdd");
        resNo = resNo.replace(/%/g, "kodePersen");
        resNo = resNo.replace(/,/g, "kodeKoma");

        let noAw = `${location.state.data.no}`;
        console.log(noAw)
        resNoLama = noAw.replace(/&/g, "kodeDan");
        resNoLama = resNoLama.replace(/!/g, "kodeSeru");
        resNoLama = resNoLama.replace(/#/g, "kodePagar");
        resNoLama = resNoLama.replace(/@/g, "kodeAdd");
        resNoLama = resNoLama.replace(/%/g, "kodePersen");
        resNoLama = resNoLama.replace(/,/g, "kodeKoma");

        resNote =  `${noteData}`.replace(/&/g, "kodeDan");
        resNote = resNote.replace(/!/g, "kodeSeru");
        resNote = resNote.replace(/#/g, "kodePagar");
        resNote = resNote.replace(/@/g, "kodeAdd");
        resNote = resNote.replace(/%/g, "kodePersen");
        resNote = resNote.replace(/,/g, "kodeKoma");
        
        let awst = `${location.state.data.note}`;
        resNoteLama =  awst.replace(/&/g, "kodeDan");
        resNoteLama = resNoteLama.replace(/!/g, "kodeSeru");
        resNoteLama = resNoteLama.replace(/#/g, "kodePagar");
        resNoteLama = resNoteLama.replace(/@/g, "kodeAdd");
        resNoteLama = resNoteLama.replace(/%/g, "kodePersen");
        resNoteLama = resNoteLama.replace(/,/g, "kodeKoma");
        
        if(resNote === "" || resNote === null || resNote === undefined){
            Swal.fire('Info','Harap isi keterangan note','warning')
        }
        else{
            console.log({"tglOK" : tglOK,
            "tglPro" : tglPro,
            "revisi": revisi,
            "resNo" : resNo,
            "resNote" : resNote,
            "resNoLama" : resNoLama,
            "resNoteBaru" : resNoteLama})
            setIsLoading(true);
            // await falseNoteOkp();
            // await fetchNoteOKP(tglOK,tglPro,revisi,resNo,resNote,resNoLama,resNoteLama);
            await API_GSHEET.get(`exec?tipe=saveNoteOKP&date=${tglPro}&tOkp=${tglOK}&rev=${revisi}&no=${resNo}&note=${resNote}&noLama=${resNoLama}&noteLama=${resNoteLama}&sheet&tRev`);
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
                    <Breadcrumb.Item active>Update</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="bg-light  ms-auto"></div>
            <div className="bg-light ">
                <Button variant="outline-primary"  style={{marginRight: 10}} onClick={() => backhome(`/main/${userData.user_divisi}/OKP`)}><i className="bi bi-backspace"></i> Kembali</Button>
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
            eventKey={devHome}
            transition={true}
            className="mb-3"
        >
            <Tab eventKey={1} title="OKP" disabled={fileOkp}>
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
                                                handleSelectChange(e)
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
                                            isDisabled={isTrue}
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
                            <Button type="submit" variant="outline-primary" className='mt-1'><i class="bi bi-send"></i>&nbsp;Submit</Button>
                        </div>
                    </div>
                    
                    
                </Form>
            </Tab>

            <Tab eventKey={2} title="Note" disabled={fileNote}>
                <Form noValidate onSubmit={saveNote}>
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
                                            onChange={(e) =>setNoProduk(e.target.value)}
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
                                        onChange={(e) =>setNoteData(e.target.value)}
                                    />
                                </Form.Group>
                                </div>
                            </Card>
                        </div>
                        <div className="col-md-6">
                            <Button type="submit" variant="outline-primary" className='mt-1'><i class="bi bi-send"></i>&nbsp;Submit</Button>
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
