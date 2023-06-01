import React, { useState, useEffect, useCallback } from 'react';
import './permintaan.css';
import Swal from "sweetalert2";
import id from 'date-fns/locale/id';
import Select from'../../../component/Select';
import { formatInTimeZone } from 'date-fns-tz';
import { API_AUTH } from '../../../apis/apisData';

import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Container, Form, Stack } from 'react-bootstrap';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';

import useAuthStore, { selectUser } from '../../../store/authLogin';
import { FileTipe } from '../../../datafile/FileSelect';
import useMaterialStore, { selectMaterial, selectFetchMaterial } from '../../../store/listBarang';
import usePermintaanStore, { selectPermintaan, selectFetchPermintaan } from '../../../store/dataPermintaan';

export const InputPermintaan = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const userData = useAuthStore(selectUser);

    const newMaterial = useMaterialStore(selectMaterial);
    const fetchMaterial = useMaterialStore(selectFetchMaterial);

    const onPermintaan = usePermintaanStore(selectFetchPermintaan);
    const dataPermintaan = usePermintaanStore(selectPermintaan);

    const [idPermintaan, setIdPermintaan] = useState("");
    const [ okp, setOkp ] = useState('');
    const [tglTerima, setTglTerima] = useState("");
    const [estimasi, setEstimasi] = useState("");
    const [pengajuan, setPengajuan] = useState(0);
    const [satuan, setSatuan] = useState("");
    const [kirim, setKirim] = useState("");
    const [keterangan, setKeterangan] = useState("");
    
    const [fileNab, setFileNab] = useState([]);
    const [fileBar, setFileBar] = useState([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [dataReady, setDataReady] = useState(false);
    const [validated, setValidated] = useState(false);

    const [form, setForm] = useState({
        cekTipe: null,
        cekItem: null,
    });

    const onValidate = (value, name) => {
        setError((prev) => ({
            ...prev,
            [name]: { ...prev[name], errorMsg: value },
        }));
    };

    const [error, setError] = useState({
        cekTipe: {
            isReq: true,
            errorMsg: '',
            onValidateFunc: onValidate,
        },
        cekItem: {
            isReq: true,
            errorMsg: '',
            onValidateFunc: onValidate,
        }
    });

    useEffect(() => {
        setIsLoading(true);
        if(location.state === null) {
            backhome(`/main/${userData.user_divisi}/Permintaan`);
            Swal.fire('Info','Harap kembali ke halaman permintaan data tidak lengkap', 'info')
        };
        cekData()
        
        setIsLoading(false);
        console.log(location.state.tanggal);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect (() => {
        if(!dataReady) return;
        const gntiDta = async () =>{
            try {
                setIsLoading(true);
                setFileBar([])
                const newFileNab = fileNab.filter(x => x.tipe_barng === form.cekTipe);
                setFileBar(newFileNab)
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Pengambilan Data Pengadaan Gagal!',
                footer: error
                })
            }
            setDataReady(false);
        } 

        gntiDta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dataReady]);

    const cekData = async() =>{
        setIsLoading(true);
        await fetchMaterial()
        await onPermintaan(`${location.state.tanggal}`);
        setIsLoading(false)
        testData()
    }

    const testData = () =>{
        setTglTerima(`${location.state.tanggal}`);
        const xsd = Math.random().toString(36).slice(-4);
        let pPlan = "";
        if(userData.user_plan.toUpperCase() === "SENTUL"){
            pPlan = "STL"
        }
        else if(userData.user_plan.toUpperCase() === "BANTUL"){
            pPlan = "BTL"
        }
        else{
            pPlan =""
        }
        let modifiedArr = newMaterial.map(function(element){
            return { value: element.item, label: element.item, tipe_barng: element.tipe_barng, saldo: element.saldo_akhir, unit: element.unit };
        });
        setFileNab(modifiedArr);
        
        console.log(newMaterial)
        console.log(dataPermintaan)
        console.log(modifiedArr)
        if(dataPermintaan.length > 0){
            setOkp(dataPermintaan[0]?.id_okp);
            setIdPermintaan(`PERNEW/${xsd}/${dataPermintaan[0].id_okp}/${pPlan}`);
        }
        else{
            let bln = formatInTimeZone(new Date(), 'Asia/Jakarta', 'MM', { locale: id });
            let tahu = formatInTimeZone(new Date(), 'Asia/Jakarta', 'yyyy', { locale: id });
            setIdPermintaan(`PERNEW/${xsd}/DEE/${bln}/${tahu}/${pPlan}`);
            setOkp("----");
            setEstimasi("0");
        }
    }

    const onHandleChange = useCallback((value, name) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(name);
        console.log(value);
        if(name === "cekTipe"){
            setDataReady(true)
            // const newFileNab = fileNab.filter(x => x.tipe_barng === value);
            // setFileBar(newFileNab);
            // console.log(newFileNab);
        }
        else if(name === "cekItem" && value != null){
            cekNilaiItem(value)
            // const newFileNab = fileBar.filter(x => x.value === value);
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form]);

    const cekNilaiItem = (value) =>{
        const newFileNab = newMaterial.filter(x => x.item === value && x.tipe_barng === form.cekTipe);
        Swal.fire('Info',`Sisa qty item ${newFileNab[0].saldo_akhir} ${newFileNab[0].unit}`,'info')
        setSatuan(newFileNab[0].unit)
    }

    const validateForm = () => {
        let isInvalid = false;
        
        Object.keys(error).forEach((x) => {
            const errObj = error[x];
            if (errObj.errorMsg) {
            isInvalid = true;
            } else if (errObj.isReq && !form[x]) {
            isInvalid = true;
            onValidate(true, x);
            }
        });
        return !isInvalid;
    };

    const handleSubmit =(event) => {
        const cekForm = event.currentTarget;
        const submitForm = cekForm.checkValidity()
        event.preventDefault();
        const isValid = validateForm();
        console.log(submitForm)
        console.log(isValid)
        if(submitForm === false && !isValid === false){
            event.stopPropagation();
            setValidated(true);
            // return false;
        }
        else{
            const newFileNab = newMaterial.filter(x => x.item === form.cekItem && x.tipe_barng === form.cekTipe);
            console.log(newFileNab.length)
            if(newFileNab.length > 0){
                saveData()
            }
            else{
                Swal.fire('Info','Tipe item dan nama item tidak sesuai','success')
            }
            
        }
    
        
    };

    const saveData = async () =>{
        setIsLoading(true);
        let qtyPermint = [{ jmlEstimasi: "0", JmlPermintaan: pengajuan, JmlPengeluaran: "0" }];
        let waktu = [{jamPermintaan: kirim, jamVerify: "", jamPengiriman: ""}];
        try {
            const next = await API_AUTH.post(`/permintaan`, {
                "id" : idPermintaan,
                "okp" : okp,
                "tPermintaan" : tglTerima,
                "pemohon" : userData.user_name,
                "divisi" : userData.user_divisi,
                "tipe" : form.cekTipe,
                "item" : form.cekItem,
                "estimasi" : estimasi,
                "pengajuan" : qtyPermint,
                "satuan" : satuan,
                "waktu" : waktu,
                "keterangan" : keterangan,
                "plan" : userData.user_plan
            });
            // Swal.fire('Info',`${next.data}`,'success')
            // console.log(next)
            Swal.fire(`${next.data.success}`, backhome(`/main/${userData.user_divisi}/Permintaan`), 'success');
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
                            <Breadcrumb.Item active>Create</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="bg-light border ms-auto"></div>
                    <div className="vr" />
                    <div className="bg-light border">
                        <Button variant="primary"  style={{marginRight: 10}} onClick={() => backhome(`/main/${userData.user_divisi}/OKP`)}><i class="bi bi-backspace"></i> Kembali</Button>
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
                                            <Form.Label>Id Permintaan</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={idPermintaan}
                                                disabled
                                            />
                                        </Form.Group>
                                    </div>
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
                                                <Select
                                                    title={"tipe"}
                                                    name={"cekTipe"}
                                                    value={form.cekTipe}
                                                    options={FileTipe}
                                                    onChangeFunc={onHandleChange}
                                                    {...error.cekTipe}
                                                />
                                            </Form.Group>
                                        </div>

                                        <div className='col-lg-6'>
                                            <Form.Group as={Col} controlId="validationCustom02">
                                                <Form.Label>Nama Item</Form.Label>
                                                <Select
                                                    title={"item"}
                                                    name={"cekItem"}
                                                    value={form.cekItem}
                                                    options={fileBar}
                                                    onChangeFunc={onHandleChange}
                                                    isDisabled
                                                    {...error.cekItem}
                                                />
                                                
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
                                                        type='text'
                                                        value={satuan}
                                                        disabled
                                                        // onChange={ (e) => setKirim(e.target.value) }
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
