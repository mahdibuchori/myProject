import React, { useState, useEffect } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import './formProses.css';
import Swal from "sweetalert2";
import Select from 'react-select';
import id from 'date-fns/locale/id';
import { formatInTimeZone } from 'date-fns-tz';
import { API_AUTH } from '../../../apis/apisData';
import { NumericFormat } from 'react-number-format';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import { Accordion, Breadcrumb, Button, Card, Col, Container, FloatingLabel, Form, InputGroup, Modal, Row, Stack } from 'react-bootstrap';
import useProviderStore, {selectProvider, selectFetchProvider, selectProviderReady} from '../../../store/listProvider';
import useTallyStore, { selectTally, selectFetchTally, selectTallyReady, selectFalseTally } from '../../../store/ListTally';

export const CreateFormproses = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const userData = useAuthStore(selectUser);
    const newProvider = useProviderStore(selectProvider);
    const fetchProvider = useProviderStore(selectFetchProvider);
    const providerReady = useProviderStore(selectProviderReady);
    
    const tallyData = useTallyStore(selectTally);
    const fetchTally = useTallyStore(selectFetchTally);
    const tallyReady = useTallyStore(selectTallyReady);
    const tallyFalse = useTallyStore(selectFalseTally);

    const [show, setShow] = useState(false);
    const [swaping, setSwaping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dataReady, setDataReady] = useState(false);
    const [showTally, setShowTally] = useState(false);
    const [sheetReady, setSheetReady] = useState(false);
    const [bagKarungCo, setBagKarungCo] = useState(false);
    const [selectedTally, setSelectedTally] = useState(false);

    const [provider, setProvider] = useState([]);
    const [lotTally, setLotTally] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [inputList, setInputList] = useState([]);
    const [dataTally, setDataTally] = useState([]);
    const [selectedcourse, setselectedCourse] = useState([]);
    
    /* Awal */
    const [pltAwal, setPltAwal] = useState("");
    const [tingAwal, setTingAwal] = useState("");
    const [barAwal, setBarAwal] = useState("");
    const [sisaAwal, setSisaAwal] = useState("");
    const [pecAwal, setpecAwal] = useState("");
    /* Akhir */
    const [pltAkhir, setPltAkhir] = useState("");
    const [tingAkhir, setTingAkhir] = useState("");
    const [barAkhir, setBarAkhir] = useState("");
    const [sisaAkhir, setSisaAkhir] = useState("");
    const [pecAkhir, setpecAkhir] = useState("");

    const [notallyLot, setNotallyLot] = useState("");
    const [bulan, setBulan] = useState();
    const [kode, setKode] = useState('');
    const [noLot, setNoLot] = useState("");
    const [pengajuan, setPengajuan] = useState("");
    const [selected, setSelected] = useState("environment");

    const [karung, setKarung] = useState(0);
    const [qtyTally, setQtyTally] = useState(0);
    const [qtyBag, setQtyBag] = useState(0);
    const [qtyTotal, setQtyTotal] = useState(0);

    useEffect(() => {
        const createUniq = () => {
            let bln = formatInTimeZone(new Date(), 'Asia/Jakarta', 'MM', { locale: id });
            let tahu = formatInTimeZone(new Date(), 'Asia/Jakarta', 'yy', { locale: id });
            const xsd = Math.random().toString(36).slice(-4);
            setKode("FPC"+xsd.toUpperCase()+bln+tahu);
        }
        createUniq()
    }, []);

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
        if (!tallyReady) return;
        readTally()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tallyReady]);

    useEffect(() => {
        setIsLoading(true);
        if(location.state === null) {
            backhome(`/main/${userData.user_divisi}/Permintaan`);
            Swal.fire('Info','Harap kembali ke halaman permintaan data tidak lengkap', 'info')
        };
        
        cekData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect (() => {
        if(!dataReady) return;
        const gntiDta = async () =>{
            let bag = qtyBag;
            let pAwal,tAwal,bAwal,sAwal,pcAwal = 0;
            let pAkhir,tAkhir,bAkhir,sAkhir,pcAkhir = 0;
            if(pltAwal === ""){pAwal = 0}else{pAwal = pltAwal};
            if(tingAwal === ""){tAwal = 0}else{tAwal = tingAwal};
            if(barAwal === ""){bAwal = 0}else{bAwal = barAwal};
            if(sisaAwal === ""){sAwal = 0}else{sAwal = sisaAwal};
            if(pecAwal === ""){pcAwal = 0}else{pcAwal = pecAwal};
            if(pltAkhir === ""){pAkhir = 0}else{pAkhir = pltAkhir};
            if(tingAkhir === ""){tAkhir = 0}else{tAkhir = tingAkhir};
            if(barAkhir === ""){bAkhir = 0}else{bAkhir = barAkhir};
            if(sisaAkhir === ""){sAkhir = 0}else{sAkhir = sisaAkhir};
            if(pecAkhir === ""){pcAkhir = 0}else{pcAkhir = pecAkhir};

            const totalAwal = parseFloat(pAwal)*((parseFloat(tAwal)*parseFloat(bAwal))+parseFloat(sAwal))+parseFloat(pcAwal);
            const totalAkhir = parseFloat(pAkhir)*((parseFloat(tAkhir)*parseFloat(bAkhir))+parseFloat(sAkhir))+parseFloat(pcAkhir);
            const hasil = (totalAwal - totalAkhir)*bag;
            if(qtyTally === 0){
                setQtyTotal(hasil)
            }
            else{
                setQtyTotal(qtyTally)
            }
            
            setDataReady(false);
        } 

        gntiDta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dataReady])

    useEffect (() => {
        if(!sheetReady) return;
        const gntiDta = async () =>{
            Swal.fire('info',`${bulan}`,'info')
            setLotTally(null)
            setIsLoading(true);
            await tallyFalse();
            await fetchTally(bulan,`${location.state.data.nama_item}`,userData.user_plan, kode);
            setIsLoading(false); 
            setSheetReady(false);
        } 

        gntiDta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[sheetReady])
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleShowTally = () => {
        if(selectedcourse.length > 0){
            setSelectedTally(true)
            const newTally = inputList;
            newTally.sort((a, b) => parseInt(b.noTally) - parseInt(a.noTally));
            const perChunk = 5; 
            const result = newTally.reduce((resultArray, item, index) => { 
                const chunkIndex = Math.floor(index/perChunk)
            
                if(!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [] // start a new chunk
                }
            
                resultArray[chunkIndex].push(item);
            
                return resultArray
            }, []);
            setDataTally(result)
        }
        else{

        }
        setShowTally(true)
    };
    const handleCloseTally = () => {
        setBulan();
        setInputList([]);
        setDataTally([]);
        setselectedCourse([]);
        setNotallyLot("")
        setKarung(0);
        setQtyTally(0);
        setSupplier(null);
        setNoLot('')
        setSelectedTally(false);
        setShowTally(false);
        setBagKarungCo(false);
    };
    const handleCancelTally = () => {
        setBulan();
        setInputList([]);
        setDataTally([]);
        setselectedCourse([]);
        setNotallyLot("")
        setKarung(0);
        setQtyTally(0);
        setSupplier(null);
        setNoLot('')
        setSelectedTally(false);
        setBagKarungCo(false);
    };

    const  handleScan = (data) => {
        
        if (data) {
        if(data === ""){
            handleClose()
            Swal.fire('Oppss..','Data tidak ditemukan','warning');
        }
        else{
            handleClose()
            Swal.fire('Info',`Data ditemukan ${data}`,'warning');
        }
        }
    };
    
    const handleError = err => {
        // alert(err);
    };

    const cekData = () =>{
        let nPengajuan = 0;
        if(location.state.data.jml_item[0]?.JmlPermintaan === null || location.state.data.jml_item[0]?.JmlPermintaan === 0){
            nPengajuan = 0;
        }
        else{
            nPengajuan = (parseFloat(location.state.data.jml_item[0]?.JmlPermintaan) * 1000) /1000;
        }
        setPengajuan(nPengajuan);
        setIsLoading(false);
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

    const getTally =async () =>{
        handleShowTally()
    }

    const readTally = () =>{
        console.log(tallyData)
        if(tallyData.length === 0){

        }
        else{
            const newTally = tallyData.map(e => {
                let qty = 0;
                if(e.status === "Terpakai"){
                    qty = 0;
                }
                else{
                    qty = parseFloat(e.qty_tally);
                }
                return ({
                    id_tally : e.id_tally,	
                    no_tally : e.no_tally,
                    bulan_tahun : e.bulan_tahun,
                    item : e.item,
                    unit : e.unit,	
                    no_lot : e.no_lot,
                    qty_tally : qty,
                    status : e.status,
                    supplier : e.supplier,	
                    tgl_tally : e.tgl_tally,	
                    petugas_tally : e.petugas_tally,	
                    tgl_input : e.tgl_input,
                    petugas_input : e.petugas_input,	
                    tambahan : e.tambahan,
                    id_formproses : e.id_formproses,
                    potong_karung : e.potong_karung,	
                    plan : e.plan,	
                    keterangan : e.keterangan,
                });
            });
            const endresult = Object.values(newTally.reduce((value, object) => {
                if (value[object.no_tally]) {
                    value[object.no_tally].qty_tally += object.qty_tally; 
              
              } else {
                  value[object.no_tally] = { ...object};
                }
                return value;
            }, {}));
            let modifiedArr = endresult.map(function(element){
                let tall =  parseFloat(element.qty_tally).toFixed(2)
                let qty = (tall* 1000) / 1000;
                return { value: element.no_tally, label: `${element.no_lot} (${qty}) ${element.supplier}`, no_tally: element.no_tally, supplier : element.supplier, qty_tally : qty, no_lot : element.no_lot};
            });
            
            setLotTally(modifiedArr);
        }
    }

    const cekTally = (e) => {
        setDataTally([]);
        setInputList();
        
        const tally = tallyData.map(e => {
            let qty = 0;
            if(e.status === "Terpakai"){
                qty = 0;
            }
            else{
                qty = parseFloat(e.qty_tally);
            }
            const d = new Date(e.tambahan)
            return ({
                id_tally : e.id_tally,	
                no_tally : e.no_tally,
                bulan_tahun : e.bulan_tahun,
                item : e.item,
                unit : e.unit,	
                no_lot : e.no_lot,
                qty_tally : qty,
                status : e.status,
                supplier : e.supplier,	
                tgl_tally : e.tgl_tally,	
                petugas_tally : e.petugas_tally,	
                tgl_input : e.tgl_input,
                petugas_input : e.petugas_input,	
                tambahan : d,
                id_formproses : e.id_formproses,
                potong_karung : e.potong_karung,	
                plan : e.plan,	
                keterangan : e.keterangan,
            })
        });
        tally.sort(function(a,b){
            return new Date(a.tambahan) - new Date(b.tambahan)
          })
        console.log(tally)
        /* const tally = tallyData.map(e => {
            let qty = 0;
            if(e.status === "Terpakai"){
                qty = 0;
            }
            else{
                qty = parseFloat(e.qty_tally);
            }
            let no = e.id_tally.split("-");
            return ({
                noTally : parseInt(no[1]),
                id_tally : e.id_tally,	
                no_tally : e.no_tally,
                bulan_tahun : e.bulan_tahun,
                item : e.item,
                unit : e.unit,	
                no_lot : e.no_lot,
                qty_tally : qty,
                status : e.status,
                supplier : e.supplier,	
                tgl_tally : e.tgl_tally,	
                petugas_tally : e.petugas_tally,	
                tgl_input : e.tgl_input,
                petugas_input : e.petugas_input,	
                tambahan : e.tambahan,
                id_formproses : e.id_formproses,
                potong_karung : e.potong_karung,	
                plan : e.plan,	
                keterangan : e.keterangan,
            });
        }); */
        const newTally = tally.filter(x => x.no_tally === `${e.value}`);
        const tallys = newTally.map((e, i) => {
            return(
                {
                    noTally : i+1,
                    id_tally : e.id_tally,	
                    no_tally : e.no_tally,
                    bulan_tahun : e.bulan_tahun,
                    item : e.item,
                    unit : e.unit,	
                    no_lot : e.no_lot,
                    qty_tally : e.qty_tally,
                    status : e.status,
                    supplier : e.supplier,	
                    tgl_tally : e.tgl_tally,	
                    petugas_tally : e.petugas_tally,	
                    tgl_input : e.tgl_input,
                    petugas_input : e.petugas_input,	
                    tambahan : e.tambahan,
                    id_formproses : e.id_formproses,
                    potong_karung : e.potong_karung,	
                    plan : e.plan,	
                    keterangan : e.keterangan,
                    checked : false
                }
            )
        });
        tallys.sort((a, b) => parseInt(b.noTally) - parseInt(a.noTally));
        setInputList(tallys.sort((a, b) => parseInt(b.noTally) - parseInt(a.noTally)))
        const perChunk = 5; 

        const result = tallys.reduce((resultArray, item, index) => { 
            const chunkIndex = Math.floor(index/perChunk)
          
            if(!resultArray[chunkIndex]) {
              resultArray[chunkIndex] = [] // start a new chunk
            }
          
            resultArray[chunkIndex].push(item);
          
            return resultArray
        }, []);
        setDataTally(result)
    }

    const handlecheckbox = (e) => {
        let temp = selectedcourse;
        const indexs = inputList.findIndex(product => product.noTally === parseInt(e.target.value));
        let data = inputList[indexs];
        if(e.target.checked===false){
            temp = temp.filter((a) => {
                return a !== inputList[indexs];
            });
            let jumKarung = selectedcourse.length - 1;
            let jumTally = parseFloat(qtyTally) - (parseFloat(data.qty_tally) - parseFloat(data.potong_karung));
            setKarung(jumKarung);
            setQtyTally(jumTally.toFixed(2));
            if(jumKarung === 0){
                setSelectedTally(false)
            }
            else{
                setSelectedTally(true)
            }
        } 
        else if(e.target.checked === true){
            let jumKarung = selectedcourse.length + 1;
            let jumTally = parseFloat(qtyTally) + (parseFloat(data.qty_tally) - parseFloat(data.potong_karung));
            setKarung(jumKarung);
            setQtyTally(jumTally.toFixed(2));
            if(jumTally > parseFloat(pengajuan)){Swal.fire('Info','Total Tally Melebihi Permintaan','warning')}
            if(jumKarung > 0){
                setSelectedTally(true)
            }
            else{
                setSelectedTally(false)
            }
        }
        else{
            Swal.fire('Info','Data tidak ditemukan','error');
        } 
        
        e.target.checked
            ? setselectedCourse([...selectedcourse, data ])
            : setselectedCourse([...temp]);
        
        data.checked = e.target.checked
    };

    const handleSave =async () =>{
        if(noLot === null || noLot === undefined || noLot === ""){
            Swal.fire('Info','Harap isi no lot barang','warning');
        }
        if(supplier === null || supplier === undefined ||supplier.length === 0){
            Swal.fire('Info','Pilih nama eksternal provider','warning');
        }
        else if(pltAwal === "" || tingAwal === "" || barAwal === "" || sisaAwal === "" || pecAwal === "" ){
            Swal.fire('Info','harap lengkapi data qty awal','warning');
        }
        else if(pltAkhir === "" || tingAkhir === "" || barAkhir === "" || sisaAkhir === "" || pecAkhir === "" ){
            Swal.fire('Info','harap lengkapi data qty akhir','warning');
        }
        else if(qtyTotal === ""){
            Swal.fire('Info','harap cek ulang data qty total','warning');
        }
        else{
            let qtyAwal = (parseFloat(pltAwal) * ((parseFloat (tingAwal) * parseFloat(barAwal)) + parseFloat(sisaAwal))) + parseFloat(pecAwal);
            let qtyAkhir = (parseFloat(pltAkhir) * ((parseFloat (tingAkhir) * parseFloat(barAkhir)) + parseFloat(sisaAkhir))) + parseFloat(pecAkhir);
            let totalQty = parseFloat(qtyAwal - qtyAkhir).toFixed(2);
            let hslAk = totalQty * 1000 / 1000;

            let qtyAll = 0;
            if( qtyTotal === null || qtyTotal === undefined || qtyTotal === ""){
                qtyAll = 0;
            }
            else{
                qtyAll = qtyTotal
                
            }
            let data = [{
                kode : kode,
                noOKp : location.state.data.id_okp,
                id_permintaan : location.state.data.id_permintaan,
                item : location.state.data.nama_item,
                qtyBag : qtyBag,
                qtyTotal : qtyAll,
                noLot : noLot,
                supplier : `${supplier.value}`,
                pltAwal : pltAwal,
                tingAwal : tingAwal,
                barAwal : barAwal,
                sisaAwal : sisaAwal,
                pecAwal : pecAwal,
                pltAkhir : pltAkhir,
                tingAkhir : tingAkhir,
                barAkhir : barAkhir,
                sisaAkhir : sisaAkhir,
                pecAkhir : pecAkhir,
                qtyAwal : qtyAwal,
                qtyAkhir : qtyAkhir,
                totalQty : hslAk,
                user : userData.user_name,
                plan : userData.user_plan,
                dataTally : selectedcourse,
            }]
            console.log(data)
            try {
                setIsLoading(true)
                const next = await API_AUTH.put(`/prosesform/${kode}`, {
                    kode : kode,
                    noOKp : location.state.data.id_okp,
                    id_permintaan : location.state.data.id_permintaan,
                    item : location.state.data.nama_item,
                    qtyBag : String(qtyBag),
                    qtyTotal : String(qtyAll),
                    noLot : noLot,
                    supplier : `${supplier.value}`,
                    pltAwal : pltAwal,
                    tingAwal : tingAwal,
                    barAwal : barAwal,
                    sisaAwal : sisaAwal,
                    pecAwal : pecAwal,
                    pltAkhir : pltAkhir,
                    tingAkhir : tingAkhir,
                    barAkhir : barAkhir,
                    sisaAkhir : sisaAkhir,
                    pecAkhir : pecAkhir,
                    qtyAwal : String(qtyAwal),
                    qtyAkhir : String(qtyAkhir),
                    totalQty : String(hslAk),
                    user : userData.user_name,
                    plan : userData.user_plan,
                    dataTally : selectedcourse,
                });
                console.log(next.data.message)
                Swal.fire('Success',`${next.data.message}`,'success');
                setIsLoading(false)
            } catch (error) {
                Swal.fire('Opps..',`${error.response.data.message}`,'error');
                console.log(error.response.data.message)
                setIsLoading(false)
            }

            /* {
                kode: 'FPCYUV90623',
                noOKp: '02/OKP/PPIC/DEE/IV/2023',
                id_permintaan: 'PER/f63v/02/OKP/PPIC/DEE/IV/2023/STL',
                item: 'M4',
                qtyBag: 0,
                qtyTotal: 0,
                noLot: 'E-31-23',
                supplier: 'PT. CHAROEN POKPHAND INDONESIA',
                pltAwal: '2',
                tingAwal: '5',
                barAwal: '5',
                sisaAwal: '1',
                pecAwal: '0',
                pltAkhir: '1',
                tingAkhir: '5',
                barAkhir: '5',
                sisaAkhir: '0',
                pecAkhir: '20',
                qtyAwal: 52,
                qtyAkhir: 45,
                totalQty: 7,
                user: 'PPIC',
                plan: 'Sentul',
                dataTally: [
                  {
                    noTally: 50,
                    id_tally: '07AQ0623-50',
                    no_tally: 'M407AQ0623',
                    bulan_tahun: '2023-05',
                    item: 'M4',
                    unit: 'Kg',
                    no_lot: 'E-31-23',
                    qty_tally: 40.4,
                    status: '',
                    supplier: 'PT. CHAROEN POKPHAND INDONESIA',
                    tgl_tally: '2023-05-31',
                    petugas_tally: 'Muhamad Ikbal',
                    tgl_input: '',
                    petugas_input: '',
                    tambahan: '',
                    id_formproses: '',
                    potong_karung: '0.2',
                    plan: 'Sentul',
                    keterangan: [],
                    checked: true
                  },
                  {
                    noTally: 49,
                    id_tally: '07AQ0623-49',
                    no_tally: 'M407AQ0623',
                    bulan_tahun: '2023-05',
                    item: 'M4',
                    unit: 'Kg',
                    no_lot: 'E-31-23',
                    qty_tally: 40.31,
                    status: '',
                    supplier: 'PT. CHAROEN POKPHAND INDONESIA',
                    tgl_tally: '2023-05-31',
                    petugas_tally: 'Muhamad Ikbal',
                    tgl_input: '',
                    petugas_input: '',
                    tambahan: '',
                    id_formproses: '',
                    potong_karung: '0.2',
                    plan: 'Sentul',
                    keterangan: [],
                    checked: true
                  },
                  {
                    noTally: 48,
                    id_tally: '07AQ0623-48',
                    no_tally: 'M407AQ0623',
                    bulan_tahun: '2023-05',
                    item: 'M4',
                    unit: 'Kg',
                    no_lot: 'E-31-23',
                    qty_tally: 40.49,
                    status: '',
                    supplier: 'PT. CHAROEN POKPHAND INDONESIA',
                    tgl_tally: '2023-05-31',
                    petugas_tally: 'Muhamad Ikbal',
                    tgl_input: '',
                    petugas_input: '',
                    tambahan: '',
                    id_formproses: '',
                    potong_karung: '0.2',
                    plan: 'Sentul',
                    keterangan: [],
                    checked: true
                  },
                  {
                    noTally: 47,
                    id_tally: '07AQ0623-47',
                    no_tally: 'M407AQ0623',
                    bulan_tahun: '2023-05',
                    item: 'M4',
                    unit: 'Kg',
                    no_lot: 'E-31-23',
                    qty_tally: 40.53,
                    status: '',
                    supplier: 'PT. CHAROEN POKPHAND INDONESIA',
                    tgl_tally: '2023-05-31',
                    petugas_tally: 'Muhamad Ikbal',
                    tgl_input: '',
                    petugas_input: '',
                    tambahan: '',
                    id_formproses: '',
                    potong_karung: '0.2',
                    plan: 'Sentul',
                    keterangan: [],
                    checked: true
                  },
                  {
                    noTally: 46,
                    id_tally: '07AQ0623-46',
                    no_tally: 'M407AQ0623',
                    bulan_tahun: '2023-05',
                    item: 'M4',
                    unit: 'Kg',
                    no_lot: 'E-31-23',
                    qty_tally: 40.4,
                    status: '',
                    supplier: 'PT. CHAROEN POKPHAND INDONESIA',
                    tgl_tally: '2023-05-31',
                    petugas_tally: 'Muhamad Ikbal',
                    tgl_input: '',
                    petugas_input: '',
                    tambahan: '',
                    id_formproses: '',
                    potong_karung: '0.2',
                    plan: 'Sentul',
                    keterangan: [],
                    checked: true
                  }
                ]
              } */
        }
    }

    const handleSaveTally = () =>{
        const filterEp = provider.filter(x => x.value === notallyLot.supplier);
        setNoLot(notallyLot.no_lot);
        setQtyTotal(qtyTally)
        setSupplier(filterEp[0]);
        setShowTally(false);
        setBagKarungCo(true);
    }

    const backhome = (e) =>{
        navigate(e);
    }

    const retPreview = () =>{
        navigate(`/main/${userData.user_divisi}/Permintaan/View`,{state:{
            data : location.state.data
          }});
    }

    return (
        <>
        <div className='formprosesSet'>
            <div>
                <Stack direction="horizontal" gap={3}>
                    <div className="bg-light ">
                        <Breadcrumb>
                            <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}/Permintaan`)}>Permintaan</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={() =>retPreview()}>Preview</Breadcrumb.Item>
                            <Breadcrumb.Item active>Create Form Proses</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="bg-light border ms-auto"></div>
                    <div className="vr" />
                    <div className="bg-light border">
                        <Button variant="primary"  style={{marginRight: 10}} onClick={() => retPreview()}><i class="bi bi-backspace"></i> Kembali</Button>
                    </div>
                </Stack>
                <Container>
                    <Form>
                    <Row className='mt-2'>
                        <div className="col-md-3 mb-1">
                            <Accordion defaultActiveKey={['0','1']} alwaysOpen>
                                <Accordion.Item eventKey="0" className='mb-2 box-fp'>
                                    <Accordion.Header>Item</Accordion.Header>
                                    <Accordion.Body>
                                        <div className="row">
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Id Form Proses</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={kode}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="row">
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Nama Item</Form.Label>
                                                <Form.Control 
                                                    as="textarea" 
                                                    aria-label="With textarea" 
                                                    rows={1}
                                                    value = {location.state.data.nama_item}
                                                    // onChange = {e => setNamaBarang(e.target.value)}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </div>
                                    </Accordion.Body>                       
                                </Accordion.Item>
                                <Accordion.Item eventKey="1" className='mb-2 box-fp'>
                                    <Accordion.Header>Qty</Accordion.Header>
                                    <Accordion.Body>
                                        <div className="row">
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Qty Permintaan</Form.Label>
                                                <InputGroup>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        value={pengajuan}
                                                        disabled
                                                    />
                                                    <InputGroup.Text id="basic-addon2">{location.state.data.satuan}</InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </div>
                                        <div className="row">
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Qty Item /Bag</Form.Label>
                                                <InputGroup>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setQtyBag(e.target.value);
                                                            setDataReady(true)
                                                        }}
                                                        disabled={bagKarungCo}
                                                    />
                                                    <InputGroup.Text id="basic-addon2">{location.state.data.satuan}</InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </div>
                                        <div className="row">
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Qty Total</Form.Label>
                                                <InputGroup>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        value={qtyTotal}
                                                        disabled
                                                    />
                                                    <InputGroup.Text id="basic-addon2">{location.state.data.satuan}</InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </div>
                                    </Accordion.Body>                       
                                </Accordion.Item>
                                <Accordion.Item eventKey="2" className='mb-2 box-fp'>
                                    <Accordion.Header>Tallysheet</Accordion.Header>
                                    <Accordion.Body>
                                        <div className="row">
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Jumlah Karung</Form.Label>
                                                <InputGroup>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        value={karung}
                                                        thousandSeparator={true}
                                                        disabled
                                                    />
                                                    <InputGroup.Text id="basic-addon2">Pcs</InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </div>
                                        <div className="row">
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>Qty Pemakaian</Form.Label>
                                                <InputGroup>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        value={qtyTally}
                                                        disabled
                                                    />
                                                    <InputGroup.Text id="basic-addon2">Kg</InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </div>
                                        <Button variant="primary mt-2" onClick={(e)=>getTally(e)}>cek tally</Button>
                                    </Accordion.Body>                       
                                </Accordion.Item>
                            </Accordion>
                        </div>
                        <div className="col-md-7 mb-3">
                            <Accordion defaultActiveKey={['0','1','2']} alwaysOpen>
                                <Accordion.Item eventKey="0" className='mb-3 box-fp'>
                                    <Accordion.Header>No Lot & Eksternal Provider</Accordion.Header>
                                    <Accordion.Body>
                                    <div className="row mb-1">
                                        <div className='col-lg-4'>
                                            <Form.Group as={Col} controlId="validationCustom01">
                                                <Form.Label>No Lot</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={noLot}
                                                        onChange={(e)=>{setNoLot(String(e.target.value).toUpperCase())}}
                                                    />
                                                    <Button 
                                                        variant="outline-primary" 
                                                        id="button-addon2"
                                                        onClick={handleShow}
                                                    >
                                                        <i className="bi bi-qr-code-scan"></i>
                                                    </Button>
                                                </InputGroup>
                                                <Form.Control.Feedback type="invalid">Harap No Lot</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>

                                        <div className='col-lg-8'>
                                            <Form.Group as={Col} controlId="validationCustom02">
                                                <Form.Label>Eksternal Provider</Form.Label>
                                                <Select 
                                                    required
                                                    value={supplier}
                                                    onChange={(value) => {
                                                        setSupplier(value)
                                                    }}
                                                    options = {provider}
                                                    isSearchable = {true}
                                                    isClearable={true}
                                                />
                                                <Form.Control.Feedback type="invalid">Harap Input Nama karyawan</Form.Control.Feedback>
                                            </Form.Group>
                                        </div>
                                    </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1" className='mb-3 box-fp'>
                                    <Accordion.Header>Qty Awal & Qty Akhir</Accordion.Header>
                                    <Accordion.Body>
                                    <div className="row mb-1">
                                        <div className='col-lg-6' style={{borderRight: '1px solid black'}}>
                                            <h6>Qty Awal</h6>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Palet</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setPltAwal(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Tinggi</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setTingAwal(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Baris</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setBarAwal(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Sisa</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setSisaAwal(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row mb-2">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Pecahan</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setpecAwal(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                        </div>
                                        <div className='col-lg-6'>
                                            <h6>Qty Akhir</h6>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Palet</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setPltAkhir(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Tinggi</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setTingAkhir(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Baris</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setBarAkhir(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Sisa</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setSisaAkhir(e.target.value)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="row mb-2">
                                                <Form.Group as={Col} controlId="validationCustom01">
                                                    <Form.Label>Pecahan</Form.Label>
                                                    <NumericFormat 
                                                        customInput={Form.Control}
                                                        thousandSeparator={true}
                                                        onChange={(e)=>{
                                                            setpecAkhir(e.target.value)
                                                            setDataReady(true)
                                                        }}
                                                    />
                                                    <Form.Control.Feedback type="invalid">Harap Input NIK</Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                        </div>
                                    </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                        <div className="col-md-2 mb-5">
                            <Card className='mb-2'>
                                <Button 
                                    variant="outline-success"
                                    onClick={(e)=>handleSave(e)}
                                >
                                    <i className="bi bi-send me-2"></i>
                                    Simpan
                                </Button>
                            </Card>
                            <Card className='mb-2'>
                                <Button 
                                    variant="outline-danger"
                                    // onClick={(e)=>handlePengajuan(e)}
                                >
                                    <i className="bi bi-arrow-left-circle me-2"></i>
                                    Batal
                                </Button>
                            </Card>
                            
                        </div>
                    </Row>
                    
                    </Form>
                </Container>
            </div>
        </div>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header>
            <Modal.Title>Arahkan Kamera ke Qrcode</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{display: 'flex', justifyContent:'flex-end', width: '100'}}>
                {swaping ?
                    <Button 
                        variant="outline-primary"
                        onClick={(e)=> {
                                    setSwaping(false)
                                    setSelected("user")
                                }}
                        >
                        <i className="bi bi-arrow-clockwise"></i>
                        </Button>
                :
                    <Button 
                        variant="outline-danger"
                        onClick={(e)=> {
                            setSwaping(true)
                            setSelected("environment")
                        }}
                        >
                        <i className="bi bi-arrow-counterclockwise"></i>
                        </Button>
                }
                </div>
                <QrScanner
                    onDecode={(result) => handleScan(result)}
                    onError={(error) => handleError(error.message)}
                    constraints={{ facingMode: selected }}
                    delay={1000}
                    style={{ width: '100px' }}
                />
            </Modal.Body>
        </Modal>

        <Modal show={showTally} size="lg">
            <Modal.Header>
                <div class="row">
                    <div class="col-lg-4">
                        <Form.Group as={Col}>
                            <h6>Qty Permintaan</h6>
                            <InputGroup>
                                <NumericFormat 
                                    customInput={Form.Control}
                                    thousandSeparator={true}
                                    value={pengajuan}
                                    disabled
                                />
                                <InputGroup.Text id="basic-addon2">{location.state.data.satuan}</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </div>
                    <div class="col-lg-4">
                        <Form.Group as={Col}>
                            <h6>Bulan/Tahun</h6>
                            <Form.Control
                                type="month"
                                value={bulan}
                                min="2020-08"
                                onChange={(e) =>{
                                    setKarung(0);
                                    setQtyTally(0);
                                    setDataTally([]);
                                    setselectedCourse([]);
                                    setBulan(e.target.value);
                                    setLotTally(null);
                                    setNotallyLot("");
                                    setSheetReady(true);
                                    setSelectedTally(false)
                                }}
                            />
                        </Form.Group>
                    </div>
                    <div class="col-lg-4">
                        <Form.Group as={Col}>
                            <h6>No. Lot</h6>
                            <Select 
                                required
                                value={notallyLot}
                                onChange={(value) => {
                                    setDataTally([]);
                                    setselectedCourse([]);
                                    setNotallyLot(value);
                                    cekTally(value);
                                    setKarung(0);
                                    setQtyTally(0);
                                    
                                }}
                                options = {lotTally}
                                isSearchable = {true}
                                isDisabled ={selectedTally}
                                isClearable
                            />
                        </Form.Group>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
            <>
                <Row className='mb-3'>
                    <Col>
                    <FloatingLabel
                        label="Karung Terpakai"
                        className="mb-1 box-fp"
                        
                        style={{alignItems: 'right'}}
                    >
                        <NumericFormat 
                            customInput={Form.Control}
                            thousandSeparator={true}
                            value={karung}
                            disabled
                        />
                    </FloatingLabel>       
                    </Col>
                    <Col>
                    <FloatingLabel
                        label="Total Pemakaian"
                        className="mb-1"
                    >
                    <NumericFormat 
                        customInput={Form.Control}
                        thousandSeparator={true}
                        value={qtyTally}
                        disabled
                    />
                    </FloatingLabel> 
                    </Col>
                </Row>               
                <div className="cards-wrapper">
                    {dataTally.map((x, i) => {
                        let nilai = dataTally[i];
                        console.log(nilai)
                        return(
                            <div>
                                {nilai.map((x, i) => {
                                    return(
                                        <Card className='mb-2' style={{ width: '11rem', height: '3,5rem' }}>
                                            <Card.Body>
                                            <Row>
                                                <Col xs={4}>{nilai[i].noTally}.</Col>
                                                <Col xs={5}>{nilai[i].qty_tally}</Col>
                                                <Col xs={3}>
                                                    <input 
                                                        className="form-check-input"
                                                        type="checkbox" 
                                                        name={nilai[i].noTally}
                                                        value={nilai[i].noTally}
                                                        onClick={(e) =>handlecheckbox(e)}
                                                        defaultChecked={nilai[i].checked}
                                                    />
                                                </Col>
                                            </Row>
                                            </Card.Body>
                                        </Card>
                                    )
                                })}
                                
                            </div>
                        )
                    })}
                </div>
            </>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseTally}>
                    Keluar
                </Button>
                <Button variant="danger" onClick={handleCancelTally}>
                    Batal
                </Button>
                <Button variant="primary" onClick={handleSaveTally}>
                    Simpan
                </Button>
            </Modal.Footer>
        </Modal>
        {isLoading ? <LoadingPage/> : ""}
        </>
    )
}
