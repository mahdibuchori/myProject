import React, {useEffect, useState} from 'react';
import './pengadaan.css';
import Swal from "sweetalert2";
import Select from 'react-select';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_AUTH } from '../../../apis/apisData';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import { Breadcrumb, Button, Card, Col, Form } from 'react-bootstrap';

import useAuthStore, { selectUser } from '../../../store/authLogin';
import { FileTipe, FileSatuan ,FileBarang } from '../../../datafile/FileSelect';
import useMaterialStore, { selectMaterial, selectFetchMaterial, selectMaterialReady } from '../../../store/listBarang';

export const UpdatePengadaan = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userData = useAuthStore(selectUser);

    const newMaterial = useMaterialStore(selectMaterial);
    const fetchMaterial = useMaterialStore(selectFetchMaterial);
    const materialReady = useMaterialStore(selectMaterialReady);

    const [tgl, setTgl] = useState('');
    const [ tibar, setTibar ] = useState('');
    const [ materil, setMateril ] = useState('');
    const [fileNab, setFileNab] = useState(FileBarang);

    const [ stock, setStock ] = useState();
    const [ order, setOrder ] = useState();
    const [ satuan, setSatuan ] = useState('');
    const [ spesifikasi, setSpesifikasi ] = useState('');
    
    const [fileBar, setFileBar] = useState([]);
    const [inputList, setInputList] = useState([]);

    const [validated, setValidated] = useState(false);
    const [ ekstra, setEkstra ] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dataReady, setDataReady] = useState(false);
    const [hilang, setHilang] = useState('none');

    useEffect(() => {
        const cekMaterial = async () =>{
            try {
                await fetchMaterial();
            } catch (error) {
                console.log(error)
            }
        }
        cekMaterial();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {
        if (!materialReady) return;
    }, [materialReady]);

    useEffect(() => {
        const createUniq = () => {
            let d = new Date();
            let b = d.toLocaleDateString("id-ID", {day: '2-digit', month: 'long', year: 'numeric'});
            setTgl(b);
        }
        createUniq()
    }, []);

    useEffect(() => {
        const getBarang = async () => {
            try {
                let modifiedArr = newMaterial.map(function(element){
                    return { value: element.item, label: element.item, tipe_barng: element.tipe_barng, saldo: element.saldo_akhir, unit: element.unit };
                });
                setFileNab(modifiedArr);
            } catch (error) {
                console.log(error);
            }
        }
        getBarang();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    useEffect (() => {
        if(!dataReady) return;
        const gntiDta = async () =>{
            try {
                if(tibar.value.toUpperCase() === "LAIN-LAIN"){
                    setEkstra(true);
                    setMateril(location.state.data.material[0].material)
                }
                else{setEkstra(false);}
                setIsLoading(true);
                const newFileNab = fileNab.filter(x => x.tipe_barng === tibar.value);
                setFileBar(newFileNab);
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
    },[dataReady])


    const cekData = () =>{
        const data = FileTipe.filter(x => x.value.toUpperCase() === String(location.state.data.material[0].tipe).toUpperCase());
        const satus = FileSatuan.filter(x => x.value.toUpperCase() === String(location.state.data.qty_pengadaan[0].satuan).toUpperCase());
        let isi = { value: location.state.data.material[0].material, label: location.state.data.material[0].material, tipe_barng: location.state.data.material[0].tipe, saldo: location.state.data.qty_pengadaan[0].stock, unit: location.state.data.qty_pengadaan[0].satuan };
        let isiValu = ""
        if(location.state.data.material[0].tipe === "Lain-Lain"){
            isiValu = location.state.data.material[0].material
        }
        else{
            isiValu = isi
        }
        setMateril(isiValu);
        setTibar(data[0]);
        setSatuan(satus[0]);
        setStock(location.state.data.qty_pengadaan[0].stock);
        setOrder(location.state.data.qty_pengadaan[0].order);
        setSpesifikasi(location.state.data.spesifikasi);
        setInputList(location.state.data.parsial_data);

        if(String(location.state.data.status).toUpperCase() === "PENGAJUAN"){
            if(String(location.state.data.user[0].pemohon).toUpperCase() === String(userData.user_name).toUpperCase()){
                setHilang('block');
            }
            else{
                setHilang('none');
            }
            
        }
        else if(String(location.state.data.status).toUpperCase() === "REVISI"){
            if(location.state.data.user[0].pemohon === userData.user_name){
                setHilang('block');
            }
            else{
                setHilang('none');
            }
        }
        else if(String(location.state.data.status).toUpperCase() === "VERIFIKASI"){}
        else if(String(location.state.data.status).toUpperCase() === "SELESAI"){}
        setDataReady(true)
        setIsLoading(false)
    }

    const setGanti = (dt) =>{
        const results =  FileSatuan.filter(element => {
            return  element.value === dt.unit
          });
        setSatuan(results[0])
        setStock(dt.saldo)
    }

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const newState = JSON.parse(JSON.stringify(inputList));
        const list = [...newState];
        list[index][name] = value;
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
                if(tibar.value === "Lain-Lain"){
                    setIsLoading(true);
                    savePengadaan();
                }
                else{
                    const newFileNab = newMaterial.filter(x => x.tipe_barng === tibar.value && x.item === materil.value);
                    if(newFileNab.length > 0){
                        setIsLoading(true);
                        savePengadaan();
                    }
                    else{
                        Swal.fire('Info','Tipe item dan nama item tidak sesuai','success')
                    }
                }
                
            }
            
        }
    
        
        
        
    };

    const savePengadaan = async () =>{
        try {
            const date = new Date();
            let mm = parseInt(date.getMonth()) + 1;
            let yy = date.getFullYear();
            let bulan = String(mm).padStart(2, '0');
            console.log(materil)
            let tpItem = ""
            if(tibar.value === "Lain-Lain"){
                tpItem = materil
            }
            else{
                tpItem = materil.label
            }
            let newStatus = "";
            if(location.state.data.status === "Revisi"){
                newStatus = "Pengajuan"
            }
            else{
                newStatus = location.state.data.status
            }
            
            const next = await API_AUTH.put(`/updatePengadaan`, {
                id_Pengadaan : location.state.data.id_Pengadaan,
                t_pengadaan : tgl,
                user : [{
                    pemohon : location.state.data.user[0].pemohon,
                    jabatan : location.state.data.user[0].jabatan,
                    divisi : location.state.data.user[0].divisi,
                    plan : location.state.data.user[0].plan,
                }],
                status : newStatus,
                material : [{
                    tipe : tibar.value,
                    material : tpItem
                }],
                qty_pengadaan : [{
                    stock : stock,
                    order : order,
                    satuan : satuan.value
                }],
                spesifikasi : spesifikasi,
                parsial_data : inputList,
                tgl_verify : "",
                tgl_approve : "",
                filter_bulan : `${yy}-${bulan}`,
            });
            
            Swal.fire(`${next.data.success}`, backhome(`/main/${userData.user_divisi}/Pengadaan`), 'success');
            setIsLoading(false);
        } catch (error) {
            console.log(error)
            Swal.fire('Info', `${error.response.data.message}`, 'warning');
            setIsLoading(false);
        }
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
                <Breadcrumb.Item active>Update</Breadcrumb.Item>
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
                        <Card className="mb-4">
                            <Card.Body>
                                <div className="row p-2">
                                    <div className='col-lg-6'>
                                        <Form.Group as={Col} controlId="validationCustom01">
                                            <Form.Label>Tipe Material</Form.Label>
                                            <Select 
                                                required
                                                onChange={(value) => {
                                                    setTibar(value)
                                                    setDataReady(true)
                                                }}
                                                value={tibar}
                                                options = {FileTipe}
                                                isSearchable = {false}
                                                isDisabled
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className='col-lg-6'>
                                        <Form.Group as={Col} controlId="validationCustom02">
                                            <Form.Label>Nama Material</Form.Label>
                                            {ekstra ? 
                                                <Form.Control 
                                                    type="text"
                                                    placeholder="Nama Material"
                                                    value={materil}
                                                    onChange={(e) => {
                                                        
                                                        setMateril(e.target.value)
                                                    }}
                                                    required
                                                />
                                                :
                                                <Select 
                                                    className = "formSelect"
                                                    options = {fileBar}
                                                    value= {materil}
                                                    onChange={(value) => {
                                                        setGanti(value);
                                                        setMateril(value);
                                                    }}
                                                    isSearchable = {true}
                                                />
                                            }
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
                                            {ekstra ? 
                                                <Form.Control 
                                                    required
                                                    type="number"
                                                    value={stock}
                                                    onChange={(e) => {
                                                        setStock(e.target.value)
                                                    }}
                                                    disabled={false}
                                                />
                                                :
                                                <Form.Control 
                                                    required
                                                    type="number"
                                                    value={stock}
                                                    onChange={(e) => {
                                                        setStock(e.target.value)
                                                    }}
                                                    disabled={true}
                                                />
                                            }
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
                                            <Select 
                                                required
                                                value={satuan}
                                                options = {FileSatuan}
                                                onChange={(value) => {setSatuan(value)}}
                                                isSearchable = {true}
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
                                            value={spesifikasi}
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
                                              defaultValue={x.tglDatang}
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
                                              defaultValue={x.qty}
                                              onChange={(e) => handleInputChange(e, i)}
                                            />
                                          </Form.Group>
                                        </div>

                                        <div className='col-lg-3'>
                                          <Form.Group as={Col} controlId="validationCustom02">
                                            <Form.Label>Action</Form.Label>
                                            <div style={{display: "flex",visibility: hilang}}>
                                              {inputList.length !== 1 && (
                                                <Button variant="primary" onClick={() => handleRemoveClick(i)} style={{height: "35px", display: hilang}}>
                                                  <i className="bi bi-trash"></i>&nbsp;Hapus
                                                </Button>
                                              )}
                                              {inputList.length - 1 === i && (
                                                <Button variant="success" onClick={() => handleAddClick(i)} style={{height: "35px", marginLeft: "10px", display: hilang}}><i className="bi bi-plus-square"></i>&nbsp;Add</Button>
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
                            <Button type="submit" style={{display: hilang}}>Submit form</Button>
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
