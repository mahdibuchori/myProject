import React, { useEffect, useState } from 'react';
import './orderpurchase.css';
import Swal from "sweetalert2";
import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Stack } from 'react-bootstrap';
import { PDFViewer } from "@react-pdf/renderer";
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet
} from "@react-pdf/renderer";

import useAuthStore, { selectUser } from '../../../store/authLogin';
import useProviderStore, {selectProvider, selectFetchProvider, selectProviderReady} from '../../../store/listProvider';
// selectFalseProvider
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        margin : '10mm',
        border: 'none'
    },
    image: {
        width: '30',
        height: '30'
    },
    row: {
        width : '190mm',
        display: 'flex',
        flexDirection: 'row',
        // backgroundColor: 'white',
        fontSize: '8px',
        padding : 0,
        // border: '0.5px solid black',
    },
    border: {
        border : '0.3mm solid black',
        backgroundColor : 'white',
        margin: 0,
    },
    fontBold :{
        fontWeight : 'bold',
    }
  });

export const PreviewPoPdf = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userData = useAuthStore(selectUser);
    const newProvider = useProviderStore(selectProvider);
    const fetchProvider = useProviderStore(selectFetchProvider);
    // const falseProvider = useProviderStore(selectFalseProvider);
    const providerReady = useProviderStore(selectProviderReady);
    const [list, setList] = useState([]);
    const [listPar, setListPar] = useState([]);
    const [nopo, setNopo] = useState('');
    const [kirim, setKirim] = useState('');
    const [tglPo, setTglPo] = useState('');
    const [bayar, setBayar] = useState('');
    const [tukar, setTukar] = useState('');
    const [provider, setProvider] = useState('');
    const [alamat, setAlamat] = useState('');
    const [note, setNote] = useState('');
    const [totalPpn, setTotalPpn] = useState(0);
    const [totalPph, setTotalPph] = useState(0);
    const [totalPesan, setTotalPesan] = useState(0);
    const [totalSub, setTotalSub] = useState(0);
    const [bantar, setBantar] = useState(0);
    const [diskon, setDiskon] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [dtPar, setDtPar] = useState(false);
    const [dtNote, setDtNote] = useState(false);
    const [stAppro, setStAppro] = useState(false);
    const [stVeri, setStVeri] = useState(false);
    const bulan = ['','Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    // const [picPo, setPicPo] = useState("");
    useEffect(() => {
        setIsLoading(true);
        if(location.state === null) {
            backhome(`/main/${userData.user_divisi}/Purchasing`);
            Swal.fire('Info','Harap kembali ke halaman permintaan data tidak lengkap', 'info')
        }
        else{
            cekData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {   
        fetchProvider();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsLoading(true);
        if (!providerReady) return;
        cekData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providerReady]);

    const cekData = () =>{
        if(location.state.note.length > 0){setDtNote(true)};
        if(location.state.parsial.length > 0){setDtPar(true)};
        if(location.state.data.status === "Approved"){
            setStAppro(true);
            setStVeri(true);
        }
        else if(location.state.data.status === "Verifikasi"){
            setStVeri(true);
            setStAppro(false);
        }
        else{
            setStAppro(false);
            setStVeri(false)
        }
        let supplier = location.state.data.dataPO[0].provider
        let tPO = location.state.data.tgl_po.split("-");
        let tKrm = location.state.data.tgl_kirim.split("-");
        let almtPro = newProvider.filter(x=> x.nama_provider === supplier)
        console.log(newProvider)
        const sumPPn = location.state.data.dataPO.reduce((accumulator, value) => {
        return accumulator + value.ppn;
        }, 0);
        const sumPPh = location.state.data.dataPO.reduce((accumulator, value) => {
        return accumulator + value.pph;
        }, 0);
        setNopo(location.state.data.id_po);
        setTglPo(`${tPO[2]} ${bulan[parseInt(tPO[1])]} ${tPO[0]}`);
        setKirim(`${tKrm[2]} ${bulan[parseInt(tKrm[1])]} ${tKrm[0]}`);
        setBayar(location.state.data.pembayaran);
        setTukar(location.state.data.tukar);
        setAlamat(almtPro[0].almt_provider);
        setProvider(supplier);
        setTotalPpn(parseFloat(sumPPn).toFixed(2));
        setTotalPph(parseFloat(sumPPh).toFixed(2));
        setTotalPesan(parseFloat(location.state.data.total).toFixed(2));
        setBantar(parseFloat(location.state.data.bAntar).toFixed(2));
        setDiskon(parseFloat(location.state.data.diskon).toFixed(2));
        setTotalSub(parseFloat(location.state.data.totalSub).toFixed(2));
        setNote(location.state.note);
        setList(location.state.data.dataPO);
        setListPar(location.state.parsial);
        
        setIsLoading(false);
    }

    const backhome = (e) =>{
        navigate(e);
    }
  return (
    <>
        <div className='orderpurchase'>
            <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
                <div className="bg-light">
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={() => backhome(`/main/${userData.user_divisi}/Purchasing`)}>ListPO</Breadcrumb.Item>
                            <Breadcrumb.Item active>Preview</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="ms-auto"></div>
                <div className="bg-light">
                </div>
            </Stack>

            <PDFViewer style={{height: '80vh',padding:8}}>
                <Document>
                    <Page size="A4" style={styles.page}>
                        <View>
                            <View style={styles.row}>
                                <View style={{ width: '75mm', height: "25mm",padding: 0}}>
                                    <Text style={[styles.fontBold,styles.border,{height: '5mm',textAlign: 'center',padding:2, fontSize: "8px"}]}>
                                        PT DAGSAP ENDURA EATORE
                                    </Text>

                                    <Text style={[styles.fontBold,styles.border,{height: '19.5mm',fontSize: "8px", padding : 3, marginTop: '0.5mm'}]}>Jl. Cahaya Raya Kav H-3 Kawasan Industri Sentul Bogor Ph. 62-2187920420, Fax. 62-21-87920409</Text>
                                </View>

                                <View style={{ width: '75mm', height: "25mm",marginLeft: '7mm' ,padding: 0}}>
                                    <Text style={{marginTop: 3, fontSize: '14', textDecoration : 'underline' }}>
                                    Pesanan Pembelian
                                    </Text>
                                </View>

                                <View style={{ width: '25mm', height: "25mm",marginLeft: '8mm' ,padding: 0}}>
                                    <Image style={{width: '24mm', height:'24mm'}} src={`https://api.qrserver.com/v1/create-qr-code/?&data=${nopo}`}/>  
                                </View>
                            </View>
                            <Text style={{fontSize: "8px"}}> </Text>
                            <View style={styles.row}>
                                <View style={{ width: '65mm', height: "25mm",padding: 0}}>
                                    <Text style={[styles.fontBold,styles.border,{height: '5mm',textAlign: 'center',padding:2.5, fontSize: "8px"}]}>
                                        {provider}
                                    </Text>

                                    <Text style={[styles.fontBold,styles.border,{height: '20mm',fontSize: "8px", padding : 3}]}>
                                        {alamat}
                                    </Text>
                                </View>
                                
                                <View style={{ width: '65mm', height: "25mm",padding: 0, marginLeft: '1mm'}}>
                                    <Text style={[styles.fontBold,styles.border,{height: '5mm',textAlign: 'center',padding:2, fontSize: "8px"}]}>
                                        Kirim Ke
                                    </Text>
                                    <Text style={[styles.fontBold,styles.border,{height : '7.4mm',marginBottom: '0.5mm' ,fontSize: "8px", padding : 2}]}>
                                        Jl. Cahaya Raya Kav H-3 Kawasan Industri Bogor
                                    </Text>
                                    <Text style={[styles.fontBold,styles.border,{height: '5mm',textAlign: 'center',padding:1, fontSize: "8px", marginTop: '1mm'}]}>
                                        Tanggal Kirim
                                    </Text>
                                    <Text style={[styles.fontBold,styles.border,{height: '7.4mm',fontSize: "8px", padding : 2,textAlign: 'center'}]}>
                                        {kirim}
                                    </Text>
                                </View>

                                <View style={{ width: '29mm', height: "25mm",padding: 0, marginLeft: '1mm'}}>
                                    <Text style={[styles.fontBold,styles.border,{height: '5mm',textAlign: 'center',padding:2, fontSize: "8px"}]}>
                                        Tgl PO
                                    </Text>
                                    <Text style={[styles.fontBold,styles.border,{height: '5mm',textAlign: 'center',padding:2, fontSize: "8px", marginBottom: '5mm'}]}>
                                        {tglPo}
                                    </Text>
                                    <Text style={[styles.fontBold,styles.border,{height: '5mm',textAlign: 'center',padding:2, fontSize: "8px"}]}>
                                        Syarat Pembayaran
                                    </Text>
                                    <Text style={[styles.fontBold,styles.border,{height: '5mm',textAlign: 'center',padding:2, fontSize: "8px"}]}>
                                        {bayar}
                                    </Text>
                                </View>

                                <View style={{ width: '29mm', height: "25mm",padding: 0, marginLeft: '1mm'}}>
                                    <Text style={[styles.fontBold,styles.border,{height: '5mm',textAlign: 'center',padding:2, fontSize: "8px"}]}>
                                        No. PO
                                    </Text>
                                    <Text style={[styles.fontBold,styles.border,{height: '5mm',textAlign: 'center',padding:2, fontSize: "8px", marginBottom: '5mm'}]}>
                                        {nopo}
                                    </Text>
                                    <Text style={[styles.fontBold,styles.border,{height: '5mm',textAlign: 'center',padding:2, fontSize: "8px"}]}>
                                        Nilai Tukar
                                    </Text>
                                    <Text style={[styles.fontBold,styles.border,{height: '5mm',textAlign: 'center',padding:2, fontSize: "8px"}]}>
                                        {tukar}
                                    </Text>
                                </View>
                            </View>
                            <Text style={{fontSize: "8px"}}> </Text>
                            <View style={[styles.row,{height: '5mm', textAlign: 'center'}]}>
                                <Text style={[styles.border,{width: '7mm', fontSize: "8px", padding: 2}]}>No</Text>
                                <Text style={[styles.border,{width: '63mm', fontSize: "8px", padding: 2}]}>Nama Barang</Text>
                                <Text style={[styles.border,{width: '19mm', fontSize: "8px", padding: 2}]}>Jumlah</Text>
                                <Text style={[styles.border,{width: '19mm', fontSize: "8px", padding: 2}]}>Satuan</Text>
                                <Text style={[styles.border,{width: '25mm', fontSize: "8px", padding: 2}]}>Harga Satuan</Text>
                                <Text style={[styles.border,{width: '19mm', fontSize: "8px", padding: 2}]}>% Diskon</Text>
                                <Text style={[styles.border,{width: '24mm', fontSize: "8px", padding: 2}]}>Jumlah Harga</Text>
                                <Text style={[styles.border,{width: '14mm', fontSize: "8px", padding: 2}]}>Div</Text>
                            </View>
                            
                            {list.map((row, i) => {
                                return(
                                    <View style={[styles.row,{textAlign: 'center'}]}>
                                        <Text style={[styles.border,{width: '7mm', padding: 3}]}>{i+1}</Text>
                                        <Text style={[styles.border,{width: '63mm', padding: 2, textAlign: 'left'}]}>{row.namaBarang}</Text>
                                        <Text style={[styles.border,{width: '19mm', padding: 2}]}>{String(row.jumlah).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                        <Text style={[styles.border,{width: '19mm', padding: 2}]}>{row.unit}</Text>
                                        <Text style={[styles.border,{width: '25mm', padding: 2}]}>{String(row.jumlahHarga).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                        <Text style={[styles.border,{width: '19mm', padding: 2}]}>{row.diskon}</Text>
                                        <Text style={[styles.border,{width: '24mm', padding: 2}]}>{String(row.subTotal).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                        <Text style={[styles.border,{width: '14mm', padding: 2}]}>{row.div}</Text>
                                    </View>
                                )
                            })
                            }
                            <Text style={{fontSize: "8px"}}> </Text>
                            <View style={[styles.row,{height: '45mm'}]}>
                                <View style={[{width : '127mm'}]}>
                                    <View style={[styles.border,{height: '14mm', padding: "2mm", marginBottom: '1mm'}]}>
                                        <Text>Keterangan</Text>
                                        <Text>Mohon Lampirkan PO & COA saat pengiriman Barang</Text>
                                        <Text>Persetujuan supplier mohon di ttd & cap perusahaan dan mohon di fax balik</Text>
                                    </View>
                                    <View style={[styles.row]}>
                                        <View style={[styles.row,{width: '60mm',height: '30mm', textAlign: 'center'}]}>
                                            <View style={[{width: '20mm', marginTop: '2mm'}]}>
                                                <Text>Disiapkan Oleh</Text>
                                                <Image style={{width: '16mm', height:'16mm', marginLeft : '2mm', marginTop: '2mm'}} src={`https://api.qrserver.com/v1/create-qr-code/?data=Endang W`}/> 
                                                <Text style={{marginTop: '2mm'}}>Endang W</Text>
                                            </View>
                                            <View style={[{width: '20mm', marginLeft : '1mm', marginTop: '2mm'}]}>
                                                <Text>Diperiksa Oleh</Text>
                                                {stVeri ?
                                                    <Image style={{width: '16mm', height:'16mm', marginLeft : '2mm', marginTop: '2mm'}} src={`https://api.qrserver.com/v1/create-qr-code/?data=Mawi Prabudi`}/> 
                                                    :
                                                    <Text style={{width: '16mm', height:'16mm', marginLeft : '2mm', marginTop: '2mm'}}> </Text>
                                                }
                                                <Text style={{marginTop: '2mm'}}>Mawi Prabudi</Text>
                                            </View>
                                            <View style={[{width: '20mm', marginLeft : '1mm', marginTop: '2mm'}]}>
                                                <Text>Disiapkan Oleh</Text>
                                                {stAppro ? 
                                                    <Image style={{width: '16mm', height:'16mm', marginLeft : '2mm', marginTop: '2mm'}} src={`https://api.qrserver.com/v1/create-qr-code/?data=Rusli Adna`}/> 
                                                    :
                                                    <Text style={{width: '16mm', height:'16mm', marginLeft : '2mm', marginTop: '2mm'}}> </Text>
                                                }
                                                <Text style={{marginTop: '2mm'}}>Rusli Adna</Text>
                                            </View>
                                        </View>
                                        <View style={{width: '65mm',height: '30mm', textAlign: 'center', marginLeft :'2mm'}}>
                                            <View style={[styles.border,{width: '65mm',height: '23mm'}]}>
                                                <Text style={[{width: '65mm',height: '8mm', padding: '2mm'}]}>
                                                    PERSETUJUAN SUPPLIER
                                                </Text>
                                                <Text style={[{width: '65mm',height: '8mm', padding: '2mm', textAlign: 'left'}]}>
                                                    Tanggal :
                                                </Text>
                                                <Text style={[{width: '65mm',height: '8mm', padding: '2mm'}]}>
                                                    Nama & Cap Perusahaan
                                                </Text>
                                            </View>
                                            <Text style={[styles.border,{width: '65mm',height: '8mm', padding: '2mm'}]}>Fax ke : 021-87920409</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.border,{width : '62mm', marginLeft: '1mm',textAlign: 'right' ,border: '0.3 solid blue'}]}>
                                    <View style={[styles.row,styles.fontBold]}>
                                        <Text style={[styles.border,{width : '31mm',height: '7.5mm', padding : '2mm'}]}>Total Sub :</Text>
                                        <Text style={[styles.border,{width : '31mm',height: '7.5mm', padding : '2mm'}]}>
                                        {String(totalSub).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Text>
                                    </View>
                                    <View style={[styles.row,styles.fontBold]}>
                                        <Text style={[styles.border,{width : '31mm',height: '7.5mm', padding : '2mm'}]}>Diskon :</Text>
                                        <Text style={[styles.border,{width : '31mm',height: '7.5mm', padding : '2mm'}]}>
                                        {String(diskon).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Text>
                                    </View>
                                    <View style={[styles.row,styles.fontBold]}>
                                        <Text style={[styles.border,{width : '31mm',height: '7.5mm', padding : '2mm'}]}>PPN-STANDAR :</Text>
                                        <Text style={[styles.border,{width : '31mm',height: '7.5mm', padding : '2mm'}]}>
                                        {String(totalPpn).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Text>
                                    </View>
                                    <View style={[styles.row,styles.fontBold]}>
                                        <Text style={[styles.border,{width : '31mm',height: '7.5mm', padding : '2mm'}]}> </Text>
                                        <Text style={[styles.border,{width : '31mm',height: '7.5mm', padding : '2mm'}]}>
                                        {String(totalPph).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Text>
                                    </View>
                                    <View style={[styles.row,styles.fontBold]}>
                                        <Text style={[styles.border,{width : '31mm',height: '7.5mm', padding : '2mm'}]}>B. Antar Taksir :</Text>
                                        <Text style={[styles.border,{width : '31mm',height: '7.5mm', padding : '2mm'}]}>
                                        {String(bantar).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Text>
                                    </View>
                                    <View style={[styles.row,styles.fontBold]}>
                                        <Text style={[styles.border,{width : '31mm',height: '7.5mm', padding : '2mm'}]}>Total Pesan :</Text>
                                        <Text style={[styles.border,{width : '31mm',height: '7.5mm', padding : '2mm'}]}>
                                        {String(totalPesan).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={{fontSize: "8px"}}> </Text>
                            <Text style={{fontSize: "8px"}}>Catatan</Text>
                            <Text style={{fontSize: "8px"}}>Pesanan pembelian ini dicetak secara komputerisasi</Text>
                            <Text style={{fontSize: "8px"}}>sehingga  tidak memerlukan tanda tangan</Text>
                            
                            <Text style={{fontSize: "16px"}}> </Text>
                            {dtPar ? 
                                <View>
                                    <Text style={{width: '190mm',fontSize: "8px",textAlign: 'center'}}>Jadwal Pengiriman Barang</Text>
                                    <Text style={{width: '120mm',fontSize: "8px",textAlign: 'center',marginLeft: '35mm',border: '0.3mm solid black'}}></Text>
                                    <View style={[styles.row,{width: '120mm',fontSize: "8px",textAlign: 'center',marginLeft: '35mm',marginTop: '1mm'}]}>
                                        <Text style={{width : '7mm', minHeight: '6mm'}}>No</Text>
                                        <Text style={{width : '63mm',minHeight: '6mm'}}>Nama Barang</Text>
                                        <Text style={{width : '30mm',minHeight: '6mm'}}>Tanggal Datang</Text>
                                        <Text style={{width : '20mm',minHeight: '6mm'}}>Qty</Text>
                                    </View>

                                    {listPar.map((row, i) => {
                                        let bulans = (row.tglDatang).split("-");
                                        let isi =(`${bulans[2]} ${bulan[parseInt(bulans[1])]} ${bulans[0]}`);
                                        return(
                                            <View style={[styles.row,{width: '120mm',fontSize: "8px",textAlign: 'center',marginLeft: '35mm'}]}>
                                                <Text style={[styles.border,{width : '7mm',minHeight: '6mm',padding: '1mm'}]}>
                                                    {i + 1}
                                                </Text>
                                                <Text style={[styles.border,{width : '63mm',minHeight: '6mm',padding: '1mm',textAlign: 'left'}]}>
                                                    {row.item}
                                                </Text>
                                                <Text style={[styles.border,{width : '30mm',minHeight: '6mm',padding: '1mm'}]}>
                                                    {isi}
                                                </Text>
                                                <Text style={[styles.border,{width : '20mm',minHeight: '6mm',padding: '1mm'}]}>
                                                    {row.qty}
                                                </Text>
                                            </View>
                                        )
                                    })
                                    }
                                </View>    
                            : 
                                <View>
                                    <Text></Text>
                                </View>
                        }
                            
                            <Text style={{fontSize: "16px"}}> </Text>
                            
                            {dtNote ?
                                <View>
                                <Text style={[styles.fontBold,{fontSize: "8px",marginBottom:'2mm'}]}>Note</Text>
                                <Text style={{fontSize: "8px",border: '0.3mm solid black', padding: '2mm'}}>{note}</Text>
                                </View>
                                 :
                                 <Text style={{fontSize: "16px"}}> </Text>
                            }
                        </View>
                    </Page>
                </Document>
            </PDFViewer>
        </div>

        {isLoading ? <LoadingPage /> : ""}
    </>
  )
}
