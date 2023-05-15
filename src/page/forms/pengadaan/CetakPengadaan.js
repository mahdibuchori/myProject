// import React, {useEffect, useState} from 'react';
// import { Breadcrumb } from 'react-bootstrap';
// import { useLocation, useNavigate } from 'react-router-dom';
// import useAuthStore, { selectUser } from '../../../store/authLogin';
// import { formatInTimeZone } from 'date-fns-tz';
// import id from 'date-fns/locale/id';

// import dagsap from '../../../assets/img/dee.png';

// import { PDFViewer } from "@react-pdf/renderer";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   Image,
//   StyleSheet
// } from "@react-pdf/renderer";

// const styles = StyleSheet.create({
//     page: {
//         padding: '5px',
//         alignItems: 'center',
//         textAlign: 'center'
//     },
//     table: {
//       width: '100%',
//     },
//     image: {
//       width: '30',
//       height: '30'
//     },
//     row: {
//       display: 'flex',
//       flexDirection: 'row',
//       backgroundColor: 'white',
//       fontSize: '8px',
//       border: '0.5px solid black',
//       borderRight: '0.5px solid black'
//     },
//     header: {
//         fontSize: '8px',
//         backgroundColor: '#999',
//         paddingTop: 2,
//     },
//     header1: {
//         borderBottom: '0.5px solid black',
//         fontSize: '8px',
//         fontWeight: 'bold',
//         paddingTop: 2
//     },
//     spasi:{
//       marginTop: '3px',
//       fontSize: '8px',
//       border: 'none',
//       textAlign: 'left',
//       fontWeight: 'bold'
//     },
//     spasi1:{
//       fontSize: '5px',
//       border: 'none'
//     },
//     spasi2:{
//       marginTop: '3px',
//       fontSize: '6px',
//       border: 'none',
//       textAlign: 'left',
//       fontWeight: 'bold'
//     },
//     spasi3:{
//       marginTop: '3px',
//       fontSize: '8px',
//       border: 'none',
//       textAlign: 'left',
//       fontWeight: 'bold'
//     },
//     bold: {
//       fontWeight: 'bold',
//     },
//     row1: {
//       width: '5%',
//       borderRight: '0.5px solid black',
//       borderBottom: '0.5px solid black',
//       paddingTop: 2
//     },
//     row2: {
//       width: '20%',
//       borderRight: '0.5px solid black',
//       borderBottom: '0.5px solid black',
//       paddingTop: 2
//     },
//     row3: {
//       width: '10%',
//       borderRight: '0.5px solid black',
//       borderBottom: '0.5px solid black',
//       paddingTop: 2,
//     },
//     row4: {
//       width: '15%',
//       borderRight: '0.5px solid black',
//       borderBottom: '0.5px solid black',
//       paddingTop: 2
//     },
//     row5: {
//       width: '25%',
//       borderRight: '0.5px solid black',
//       borderBottom: '0.5px solid black',
//       height: 15,
//       paddingTop: 2
//     },
//     row6: {
//       width: '35%',
//       borderRight: '0.5px solid black',
//       borderBottom: '0.5px solid black',
//       height: 15,
//       paddingTop: 2
//     },
//     row7: {
//       width: '40%',
//       borderRight: '0.5px solid black',
//       borderBottom: '0.5px solid black',
//       paddingTop: 2
//     },
//     row8: {
//       width: '12%',
//       borderRight: '0.5px solid black',
//       borderBottom: '0.5px solid black',
//       paddingTop: 2
//     },
//     row9: {
//       width: '3%',
//       borderRight: '0.5px solid black',
//       borderBottom: '0.5px solid black',
//       paddingTop: 2
//     },
// })

// export const CetakPengadaan = () => {
//     const userData = useAuthStore(selectUser);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [list, setList] = useState([]);
//     const [img, setImg] = useState([])

//     const dataPengadaan = location.state.data;

//     useEffect(()=>{
//       const listData = location.state.data;
//       setList([
//         {
//           pengesahan : "Tanggal",
//           diajukan : formatInTimeZone(new Date( listData[0].t_pengadaan ), 'Asia/Jakarta', 'dd/MM/yyyy', { locale: id }),
//           disetujui : formatInTimeZone(new Date( listData[0].t_pengadaan ), 'Asia/Jakarta', 'dd/MM/yyyy', { locale: id }),
//           register : formatInTimeZone(new Date( listData[0].t_pengadaan ), 'Asia/Jakarta', 'dd/MM/yyyy', { locale: id }),
//         },
//         {
//           pengesahan : "Nama",
//           diajukan : listData[0].pemohon,
//           disetujui : "Rusli Adna",
//           register : "Endang Wahyu W" 
//         },
//         {
//           pengesahan : "Jabatan",
//           diajukan : listData[0].jabatan,
//           disetujui : "Plan Manager",
//           register : "Supervisor" 
//         },
//         {
//           pengesahan : "Departemen",
//           diajukan : listData[0].divisi,
//           disetujui : "",
//           register : "Purchasing" 
//         },
//       ])
//       setImg([
//         {
//           pengesahan : "Tanda tangan",
//           diajukan : `http://api.qrserver.com/v1/create-qr-code/?data=${listData[0].pemohon}`,
//           disetujui : `http://api.qrserver.com/v1/create-qr-code/?data=Rusli Adna`,
//           register : `http://api.qrserver.com/v1/create-qr-code/?data=Endang Wahyu W`
//         }
//       ])
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     },[])

//     const backhome = (e) =>{
//         navigate(e)
//     }
//   return (
//     <div className='pengadaan'>
//         <div className='pengadaan-item-top'>
//             <div>
//                 <Breadcrumb>
//                 <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
//                 <Breadcrumb.Item onClick={() => backhome(`/main/${userData.user_divisi}/Pengadaan`)}>Pengadaan</Breadcrumb.Item>
//                 <Breadcrumb.Item active>Preview</Breadcrumb.Item>
//                 </Breadcrumb>
//             </div>
//         </div>

//         <PDFViewer style={{height: '80vh',padding:8}}>
//             <Document>
//               <Page size="A4" style={[styles.page,{background: 'white'}]}>
//                 <View style={styles.table}>
//                     <Text style={styles.spasi}> </Text>
//                     <View style={styles.row}>
//                       <View style={[styles.row5, {  height: 60,alignItems : 'center',padding: 3 }]}>
//                         <Image style={[styles.row5, {  height: 60,width: 70, border: 'none' }]} src={dagsap}/>
//                         <Text style={styles.spasi2}>PT DAGSAP ENDURA EATORE</Text>
//                       </View>

//                       <View style={[styles.row7, {  height: 60,alignItems : 'center',padding: 8 }]}>
//                         <Text style={{ textAlign: 'center', fontSize: '13',paddingTop: 13 }}>PERMINTAAN PENGADAAN</Text>
//                       </View>
                      
//                       <View style={[styles.row8, { height: 60,padding: 2 }]}>
//                         <Text style={[styles.spasi3, { height: 15 }]}>Nomor Dokumen</Text>
//                         <Text style={[styles.spasi3, { height: 15 }]}>Revisi</Text>
//                         <Text style={[styles.spasi3, { height: 15 }]}>Tanggal Efektif</Text>
//                         <Text style={[styles.spasi3, { height: 15 }]}>Halaman</Text>
//                       </View>

//                       <View style={[styles.row9, { height: 60,alignItems : 'center',padding: 2 }]}>
//                         <Text style={[styles.spasi3, { height: 15 }]}>:</Text>
//                         <Text style={[styles.spasi3, { height: 15 }]}>:</Text>
//                         <Text style={[styles.spasi3, { height: 15 }]}>:</Text>
//                         <Text style={[styles.spasi3, { height: 15 }]}>:</Text>
//                       </View>

//                       <View style={[styles.row2, { height: 60,padding: 2 }]}>
//                         <Text style={[styles.spasi3, { height: 15 }]}>FRM.PUR.02.01</Text>
//                         <Text style={[styles.spasi3, { height: 15 }]}>00</Text>
//                         <Text style={[styles.spasi3, { height: 15 }]}>06 Mei 2013</Text>
//                         <Text style={[styles.spasi3, { height: 15 }]}>1 dari 1</Text>
//                       </View>
                    
//                     </View>
//                     <Text style={styles.spasi}> </Text>

//                     <View style={[styles.row, styles.header, styles.bold]}>
//                         <Text style={styles.row1}>No</Text>
//                         <Text style={styles.row2}>Nama Material (kode)</Text>
//                         <Text style={styles.row3}>Stok Ditangan</Text>
//                         <Text style={styles.row3}>Jumlah Order</Text>
//                         <Text style={styles.row3}>Tgl.Terima</Text>
//                         <Text style={styles.row3}>Supplier</Text>
//                         <Text style={styles.row4}>Harga Satuan</Text>
//                         <Text style={styles.row2}>Keterangan</Text>
//                     </View>

//                     <View style={[styles.row, styles.bold]}>
//                         <Text style={[styles.row1,{height: 15}]}>a</Text>
//                         <Text style={[styles.row2,{height: 15}]}>b</Text>
//                         <Text style={[styles.row3,{height: 15}]}>c</Text>
//                         <Text style={[styles.row3,{height: 15}]}>d</Text>
//                         <Text style={[styles.row3,{height: 15}]}>e</Text>
//                         <Text style={[styles.row3,{height: 15}]}>f</Text>
//                         <Text style={[styles.row4,{height: 15}]}>g</Text>
//                         <Text style={[styles.row2,{height: 15}]}>h</Text>
//                     </View>

//                     <Text style={styles.spasi1}> </Text>

//                     {dataPengadaan.map((row, i) => (
//                         <View key={i} style={styles.row} wrap={true}>
//                           <View style={[styles.row1, {borderBottom:'none'}]}>
//                             <Text style={{padding: 2, textAlign: 'center'}}>{i+1}</Text>
//                           </View>
//                           <View style={[styles.row2, {borderBottom:'none'}]}>
//                             <Text style={{padding: 3, textAlign: 'left'}}>{row.material}</Text>
//                           </View>
//                           <View style={[styles.row3, {borderBottom:'none'}]}>
//                             <Text style={{padding: 2, textAlign: 'center'}}>{row.stok}</Text>
//                           </View>
//                           <View style={[styles.row3, {borderBottom:'none'}]}>
//                             <Text style={{padding: 2, textAlign: 'center'}}>{row.order}</Text>
//                           </View>
//                           <View style={[styles.row3, {borderBottom:'none'}]}>
//                             <Text style={{padding: 2, textAlign: 'center'}}>{formatInTimeZone(new Date( row.t_terima ), 'Asia/Jakarta', 'dd/MM/yyyy', { locale: id })}</Text>
//                           </View>
//                           <View style={[styles.row3, {borderBottom:'none'}]}>
//                             <Text style={{padding: 2, textAlign: 'left'}}>{}</Text>  
//                           </View>
//                           <View style={[styles.row4, {borderBottom:'none'}]}>
//                             <Text style={{padding: 2, textAlign: 'left'}}>{}</Text>
//                           </View>
//                           <View style={[styles.row2, {borderBottom:'none'}]}>
//                             <Text style={{padding: 2, textAlign: 'left'}}>{row.keterangan}</Text>
//                           </View>
                          
//                         </View>
//                     ))}

//                     <Text style={styles.spasi}>Keterangan : Kolom (a) sampai dengan (e) diisi pemohon, kolom (f) dan (g) diisi purchasing</Text>

//                     <Text style={styles.spasi}> </Text>

//                     <View style={[styles.row, styles.header1, styles.bold]}>
//                         <Text style={styles.row5}>Pengesahan</Text>
//                         <Text style={styles.row2}>Diajukan</Text>
//                         <Text style={styles.row2}>Disetujui</Text>
//                         <Text style={styles.row6}>Registrasi Purchasing</Text>
//                     </View>

//                     {list.map((row, i) => (
//                       <View key={i} style={styles.row} wrap={true}>
//                         <Text style={[styles.row5, {borderBottom:'none'}]}>{row.pengesahan}</Text>
//                         <Text style={[styles.row2, {borderBottom:'none'}]}>{row.diajukan}</Text>
//                         <Text style={[styles.row2, {borderBottom:'none'}]}>{row.disetujui}</Text>
//                         <Text style={[styles.row6, {borderBottom:'none'}]}>{row.register}</Text>
//                       </View>
//                     ))}

//                     {img.map((row, i) => (
//                       <View style={styles.row}>
//                         <Text style={[styles.row5, {  height: 40,paddingTop: 15}]}>Tanda tangan</Text>
//                         <View style={[styles.row2, {  height: 40,alignItems : 'center',padding: 8 }]}>
//                           <Image style={[styles.row2, {  height: 40,width: 30 }]} src={row.diajukan}/>
//                         </View>
                        
//                         <View style={[styles.row2, {  height: 40,alignItems : 'center',padding: 8 }]}>
//                           <Image style={[styles.row2, {  height: 40,width: 30 }]} src={row.disetujui}/>
//                         </View>

                        
//                         <View style={[styles.row6, {  height: 40,alignItems : 'center',padding: 8 }]}>
//                           <Image style={[styles.row2, {  height: 40,width: 30 }]} src={row.register}/>
//                         </View>
                      
//                       </View>
//                     ))}

                    

//                 </View>
//               </Page>
//             </Document>
//         </PDFViewer>
//     </div>
//   )
// }
import React from 'react'

export const CetakPengadaan = () => {
  return (
    <div>CetakPengadaan</div>
  )
}
