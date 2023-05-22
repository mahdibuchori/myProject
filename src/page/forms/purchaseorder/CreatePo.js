import React, {useEffect, useState} from 'react';
import './orderpurchase.css';
import Swal from "sweetalert2";
import Select from 'react-select';
import id from 'date-fns/locale/id';
import { formatInTimeZone } from 'date-fns-tz';
import { NumericFormat } from 'react-number-format';
import { useNavigate, useLocation } from 'react-router-dom';
// import { API_AUTH } from '../../../apis/apisData';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import { Breadcrumb, Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { FilePajak } from '../../../datafile/FileSelect';


import useAuthStore, { selectUser } from '../../../store/authLogin';
import useProviderStore, {selectProvider, selectFetchProvider, selectProviderReady} from '../../../store/listProvider';
import { API_AUTH } from '../../../apis/apisData';

export const CreatePo = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userData = useAuthStore(selectUser);
    const newProvider = useProviderStore(selectProvider);
    const fetchProvider = useProviderStore(selectFetchProvider);
    const providerReady = useProviderStore(selectProviderReady);

    const [noPo, setNoPo] = useState('');
    const [suplier, setSuplier] = useState([]);
    const [tglPo, setTglPo] = useState('');
    const [tglKirim, setTglKirim] = useState('');
    const [namaBarang, setNamaBarang] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [tukar, setTukar] = useState('');
    const [syarat, setSyarat] = useState('');
    const [hargaSatuan, setHargaSatuan] = useState(0);
    const [diskon, setDiskon] = useState(0);
    const [pajak, setPajak] = useState([]);
    const [pph, setPph] = useState(0);
    const [ppn, setPpn] = useState(0);
    const [jumSub, setJumSub] = useState(0);
    const [ktsDipesan, setKtsDipesan] = useState(location.state.data.sumParsi);
    
    const [inputList, setInputList] = useState([]);
    const [provider, setProvider] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [dataReady, setDataReady] = useState(false);
    const [checkData, setCheckData] = useState(false);
    const [provideStatus, setProvideStatus] = useState(false);

    useEffect(() => {   
        fetchProvider();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsLoading(true);
        if (!providerReady) return;
        onProviderReady();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providerReady]);

    useEffect(() => {
        setIsLoading(true);
        if(location.state === null) {
            backhome(`/main/${userData.user_divisi}/Pengadaan`);
            Swal.fire('Info','Harap kembali ke halaman permintaan data tidak lengkap', 'info');
        }
        else{
            cekData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect (() => {
        if(!dataReady) return;
        const gntiDta = async () =>{
            console.log("cek")
            setDataReady(false);
        } 

        gntiDta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dataReady])

    const cekData = () => {
        let bln = formatInTimeZone(new Date(), 'Asia/Jakarta', 'MM', { locale: id });
        let thn = formatInTimeZone(new Date(), 'Asia/Jakarta', 'yy', { locale: id });
        let tahun = formatInTimeZone(new Date(), 'Asia/Jakarta', 'yyyy', { locale: id });
        let hari = formatInTimeZone(new Date(), 'Asia/Jakarta', 'dd', { locale: id });

        let logo = "PU";
        if(String(userData.user_plan).toUpperCase() === "SENTUL"){
            logo = "PO";
        }
        else if(String(userData.user_plan).toUpperCase() === "SENTUL"){
            logo = "YPO";
        }
        else{
            logo = "PU";
        }

        setNoPo(`${logo}${thn}${bln}`)
        setTglPo(`${tahun}-${bln}-${hari}`)
        setInputList(location.state.data.parsial_data);
        let data = location.state.data.parsial_data;
        console.log(data)
        const sum = data.reduce((accumulator, object) => {
            return parseFloat(accumulator) + parseFloat(object.qty);
          }, 0);
          console.log(sum)
        const date = data.sort((a,b) =>  new Date(a.tglDatang) - new Date(b.tglDatang));

        setKtsDipesan(location.state.data.sumParsi);
        setTglKirim(date[0].tglDatang);

        setDataReady(true);
        setIsLoading(false)
    }

    const onProviderReady = () =>{
        const results =  newProvider.filter(element => {
            return  element.nama_provider
        });
        results.sort((a, b) => a.nama_provider.localeCompare(b.nama_provider));

        let modifiedArr = results.map(function(element){
            return { value: element.nama_provider, label: element.nama_provider, id_provider: element.id_provider, nilai_tukar : element.nilai_tukar, syarat_bayar : element.syarat_bayar };
        });
        setProvider(modifiedArr);
    }

    const cekHarga = (e,idx) => {
        if(idx === "harga"){
            const subtotal = parseFloat(ktsDipesan) * parseFloat(e.value);
            if(!subtotal){
                setJumSub(0)
            }
            else{
                let coverDiskon = 0;
                if(diskon === ""){
                    coverDiskon = 0;
                }
                else{
                    coverDiskon = parseFloat(diskon);
                }
                const nDiskon = (coverDiskon / 100) * subtotal;
                const total = subtotal - nDiskon
                setJumSub(total)
            }
        }
        else{
            let hSatuan = 0;
            if(hargaSatuan === ""){
                hSatuan = 0
            }
            else{
                hSatuan = parseFloat(hargaSatuan);
            }
            const subtotal = parseFloat(ktsDipesan) * hSatuan;
            if(!subtotal){
                setJumSub(0);
            }
            else{
                let coverDiskon = 0;
                if(e.value === ""){
                    coverDiskon = 0;
                }
                else{
                    coverDiskon = parseFloat(e.value);
                }
                const nDiskon = (coverDiskon / 100) * subtotal;
                const total = subtotal - nDiskon
                setJumSub(total)
            }
            
        }
    }

    const cekPajak = (e) =>{
        console.log(e)
        let totalSub = 0;
        if(jumSub === ""){
            totalSub = 0
        }
        else{
            totalSub =parseFloat(jumSub);
        }

        let nPpn = (parseFloat(e.ppn) / 100) * totalSub;
        let nPph = (parseFloat(e.pph) / 100) * totalSub;

        setPpn(nPpn);
        setPph(nPph)
        console.log(nPpn)
        console.log(nPph)
    }

    const cekNoPo = async () =>{
        try {
            if(noPo.length < 9){
                Swal.fire('Info','Harap lengkapi no PO','warning');
                // setSuplier([{value: "", label: element.nama_provider, id_provider: element.id_provider, nilai_tukar : element.nilai_tukar, syarat_bayar : element.syarat_bayar}])
            }
            else{
                const cek = await API_AUTH.get(`/cekPO/${noPo}`);
                console.log(cek)
                if(!cek.data){
                    setProvideStatus(false);
                }
                else{
                    let tglA = [tglPo, cek.data.tgl_po];
                    let tglB = [tglKirim, cek.data.tgl_kirim];
                    let filterProvider = provider.filter(x => x.value.toUpperCase() === cek.data.dataPO[0].provider);  
                    
                    const dateA = tglA.sort((a,b) =>  new Date(a) - new Date(b));
                    const dateB = tglB.sort((a,b) =>  new Date(a) - new Date(b));

                    setTglPo(dateA[0]);
                    setTglKirim(dateB[0]);
                    setSuplier(filterProvider);
                    setTukar(cek.data.tukar);
                    setSyarat(cek.data.pembayaran);
                    setProvideStatus(true)
                }
                setCheckData(true)
            }
            
            
        } catch (error) {
            console.log(error)
            Swal.fire('Info', `${error.response.data.message}`, 'warning');
            setIsLoading(false);
        }
    }

    const savePO = async(e) =>{
        let exProv = "";
        if(!suplier.value){
            exProv = suplier[0].value;
        }
        else{
            exProv = suplier.value;
        }
        if(!checkData){
            Swal.fire('Info','No Po belum di registerasi','warning');
        }
        else if(noPo.length < 9){
            Swal.fire('Info','Harap lengkapi no PO','warning');
        }
        else if (!exProv){
            Swal.fire('Info','Harap pilih eksternal provider','warning');
        }
        else if (!tglPo){
            Swal.fire('Info','Tanggal PO tidak boleh kosong','warning');
        }
        else if (!tglKirim){
            Swal.fire('Info','Tanggal kirim tidak boleh kosong','warning');
        }
        else if (!namaBarang){
            Swal.fire('Info','Nama item barang tidak boleh kosong','warning');
        }
        else if (!hargaSatuan){
            Swal.fire('Info','Harga satuan barang tidak boleh kosong','warning');
        }
        else{
            let listDatang = inputList.map(function(element){
                return { tglDatang: element.tglDatang, qty: element.qty };
            });
            setIsLoading(true)
            try {
                const date = new Date();
                let mm = parseInt(date.getMonth()) + 1;
                let yy = date.getFullYear();
                let bulan = String(mm).padStart(2, '0');
                const xsd = Math.random().toString(36).slice(-4);

                const next = await API_AUTH.post(`/purchase`, {
                    id_po : noPo,
                    tgl_po : tglPo,
                    tgl_kirim : tglKirim,
                    status : "Belum Diajukan",
                    dataPO : [{
                        id_pengadaan : location.state.data.id_Pengadaan,
                        po_id : `${noPo}-${xsd}`,
                        namaBarang : namaBarang,
                        jumlah : ktsDipesan,
                        provider : exProv,
                        unit : location.state.data.qty_pengadaan[0].satuan,
                        diskon : diskon,
                        jumlahHarga : hargaSatuan,
                        pajak : pajak.value,
                        ppn : ppn,
                        pph : pph,
                        subTotal : jumSub,
                        div : deskripsi,
                        parsial : listDatang
                    }],
                    syarat : syarat,
                    tukar : tukar,
                    plan : userData.user_plan,
                    filter_bulan : `${yy}-${bulan}`,
                });
                Swal.fire(`${next.data.success}`, backhome(`/main/${userData.user_divisi}/Pengadaan`), 'success');
                setIsLoading(false)
            } catch (error) {
                Swal.fire('Error',`${error.response.data.message}`,'warning');
                setIsLoading(false);
            }
        }
    }

    const backhome = (e) =>{
        navigate(e);
    }
  return (
    <>
    <div className='orderpurchase'>
        <div className='orderpurchase-item-top'>
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
                    <Card className='mb-2'>
                        <Card.Body>
                            <div className="row p-1">
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Kode Item</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        aria-label="With textarea" 
                                        value={location.state.data.material[0].material}
                                        rows={1}
                                        disabled
                                    />
                                </Form.Group>
                            </div>
                            <div className="row p-1">
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>NO PO</Form.Label>
                                    <InputGroup className="mb-1">
                                        <Form.Control
                                            required
                                            type="text"
                                            placeholder="Masukan No PO"
                                            value={noPo}
                                            onChange = {e => {
                                                setNoPo(e.target.value);
                                                setSuplier([]);
                                                setTukar('');
                                                setSyarat('');
                                                setCheckData(false)
                                                setProvideStatus(false);
                                            }}
                                        />
                                        {checkData ?  
                                            <Button variant="outline-success" id="button-addon1">
                                                <i className="bi bi-shield-fill-check"></i>
                                            </Button>
                                            : 
                                            <Button variant="outline-danger" id="button-addon2" onClick={cekNoPo}>
                                                <i className="bi bi-shield-fill-x"></i>
                                            </Button>
                                        }
                                    </InputGroup>
                                </Form.Group>
                            </div>
                            <div className="row p-1">
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>EksternalProvider</Form.Label>
                                    <Select 
                                        required
                                        value={suplier}
                                        onChange={(value) => {
                                            setSuplier(value)
                                            setTukar(value.nilai_tukar);
                                            setSyarat(value.syarat_bayar);
                                        }}
                                        options = {provider}
                                        isSearchable = {true}
                                        isDisabled = {provideStatus}
                                    />
                                </Form.Group>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className='mb-1'>
                        <Card.Body>
                            <div className="row p-1">
                                <Form.Group as={Col} controlId="validationCustom01">
                                    <Form.Label>Nilai Tukar</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        defaultValue={tukar}
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
                                        value={syarat}
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
                                        defaultValue={tglPo}
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
                                        value={tglKirim}
                                        onChange = { e => setTglKirim(e.target.value)}
                                        disabled
                                    />
                                </Form.Group>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-md-8 mb-1">
                    <Card className="mb-2">
                        <div className="row p-2">
                            <Form.Group as={Col} controlId="formGridArea">
                                <Form.Label>Nama Item</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    aria-label="With textarea" 
                                    rows={1}
                                    value = {namaBarang}
                                    onChange = {e => setNamaBarang(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Harap Masukan Nama Item
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="row p-2">
                            <Form.Group as={Col} controlId="formGridArea">
                                <Form.Label>Deskripsi</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    aria-label="With textarea" 
                                    rows={1}
                                    value = {deskripsi}
                                    onChange = {e => setDeskripsi(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Harap Masukan Deskripsi
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    </Card>
                    <Card className="mb-2">
                        <Card.Body>
                            <div className="row p-1">
                                <div className='col-lg-4'>
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Qty Pemesanan</Form.Label>
                                        
                                        <InputGroup className="mb-3">
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                value={ktsDipesan}
                                                onChange ={e => setKtsDipesan(e.value)}
                                                disabled
                                            />
                                            <InputGroup.Text id="basic-addon2">{location.state.data.qty_pengadaan[0].satuan}</InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                </div>
                                <div className='col-lg-4'>
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Harga Satuan</Form.Label>
                                        <NumericFormat 
                                            customInput={Form.Control}
                                            thousandSeparator={true}
                                            onValueChange ={e => {
                                                cekHarga(e,'harga');
                                                setHargaSatuan(e.value)
                                            }}
                                        />
                                    </Form.Group>
                                </div>
                                <div className='col-lg-4'>
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Diskon</Form.Label>
                                        <InputGroup className="mb-3">
                                            <NumericFormat 
                                                customInput={Form.Control}
                                                thousandSeparator={true}
                                                onValueChange ={e => {
                                                    cekHarga(e,"diskon");
                                                    setDiskon(e.value)
                                                }}
                                            />
                                            <InputGroup.Text id="basic-addon2">%</InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                </div>

                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="mb-2">
                        <Card.Body>
                            <div className="row p-1">
                                <div className='col-lg-4'>
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>Pajak</Form.Label>
                                        <Select 
                                            className = "formSelect"
                                            options = {FilePajak}
                                            value = {pajak}
                                            onChange={(value) => {
                                                cekPajak(value)
                                                setPajak(value);
                                                
                                            }}
                                            isSearchable = {true}
                                        />
                                    </Form.Group>
                                </div>
                                <div className='col-lg-4'>
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>PPn</Form.Label>
                                        <NumericFormat 
                                            customInput = {Form.Control}
                                            thousandSeparator = {true}
                                            value = {ppn}
                                            disabled
                                        />
                                    </Form.Group>
                                </div>
                                <div className='col-lg-4'>
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label>PPh</Form.Label>
                                        <NumericFormat 
                                            customInput= {Form.Control}
                                            thousandSeparator= {true}
                                            value= {pph}
                                            disabled
                                        />
                                    </Form.Group>
                                </div>

                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="mb-2">
                        <Card.Body>
                            <div className="row p-1">
                                <div className='col-lg-8'>
                                    <div style={{display: 'flex', justifyContent:'flex-end', width: '100'}}>
                                        <h6>Total Sub</h6>
                                    </div> 
                                </div>
                                <div className='col-lg-4'>
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <NumericFormat 
                                            customInput={Form.Control}
                                            thousandSeparator={true}
                                            value={jumSub}
                                            disabled
                                        />
                                    </Form.Group>
                                </div>

                            </div>
                        </Card.Body>
                    </Card>
                    
                    <h6 className='mt-1'>Parsial Data Kedatangan</h6>
                    <Row xs={1} md={2} className="g-4">
                    {inputList.map((x, i) => {
                        return(
                            <Col>
                                <Card className="mb-2" >
                                    <Card.Body>
                                        <div className="form-check">
                                            <label className="form-check-label" for="flexCheckDefault">
                                                Parsial Ke-{i+1}
                                            </label>
                                        </div>
                                        <div className="row p-1">
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
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                    </Row>
                    <div style={{display: 'flex', justifyContent:'flex-end', width: '100'}}>
                        <Button 
                            type = "submit"
                            variant = "outline-primary"
                            style = {{marginLeft : 20}}
                            onClick = {(e) => savePO()}
                        >
                            Create PO
                        </Button>
                    </div> 
                </div>
            </div>
        </div>
    </div>

    {isLoading ? <LoadingPage /> : ""}
    </>
  )
}
