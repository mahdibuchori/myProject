import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore, { selectUser } from '../../../store/authLogin';
// import { formatInTimeZone } from 'date-fns-tz';
// import id from 'date-fns/locale/id';
import './okp.css'
import dagsap from '../../../assets/img/dee.png';

import { PDFViewer } from "@react-pdf/renderer";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: '5px',
        alignItems: 'center',
        textAlign: 'center'
    },
    table: {
      width: '100%',
    },
    image: {
      width: '30',
      height: '30'
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: 'white',
      fontSize: '8px',
      border: '0.5px solid black',
      borderRight: '0.5px solid black'
    },
    header: {
        fontSize: '8px',
        backgroundColor: '#999',
        paddingTop: 2,
    },
    header1: {
        borderBottom: '0.5px solid black',
        fontSize: '8px',
        fontWeight: 'bold',
        paddingTop: 2
    },
    spasi:{
      marginTop: '3px',
      fontSize: '8px',
      border: 'none',
      textAlign: 'left',
      fontWeight: 'bold'
    },
    spasi1:{
      fontSize: '5px',
      border: 'none'
    },
    spasi2:{
      marginTop: '3px',
      fontSize: '6px',
      border: 'none',
      textAlign: 'left',
      fontWeight: 'bold'
    },
    spasi3:{
      marginTop: '3px',
      fontSize: '8px',
      border: 'none',
      textAlign: 'left',
      fontWeight: 'bold'
    },
    bold: {
      fontWeight: 'bold',
    },
    row1: {
      width: '5%',
      borderRight: '0.5px solid black',
      borderBottom: '0.5px solid black',
      paddingTop: 2
    },
    row2: {
      width: '20%',
      borderRight: '0.5px solid black',
      borderBottom: '0.5px solid black',
      paddingTop: 2
    },
    row3: {
      width: '10%',
      borderRight: '0.5px solid black',
      borderBottom: '0.5px solid black',
      paddingTop: 2,
    },
    row4: {
      width: '15%',
      borderRight: '0.5px solid black',
      borderBottom: '0.5px solid black',
      paddingTop: 2
    },
    row5: {
      width: '25%',
      borderRight: '0.5px solid black',
      borderBottom: '0.5px solid black',
      height: 15,
      paddingTop: 2
    },
    row6: {
      width: '35%',
      borderRight: '0.5px solid black',
      borderBottom: '0.5px solid black',
      height: 15,
      paddingTop: 2
    },
    row7: {
      width: '40%',
      borderRight: '0.5px solid black',
      borderBottom: '0.5px solid black',
      paddingTop: 2
    },
    row8: {
      width: '12%',
      borderRight: '0.5px solid black',
      borderBottom: '0.5px solid black',
      paddingTop: 2
    },
    row9: {
      width: '3%',
      borderRight: '0.5px solid black',
      borderBottom: '0.5px solid black',
      paddingTop: 2
    },
    
    rows: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        fontSize: '8px',
    },
    row10: {
        width: '7%',
        paddingTop: 2
    },
    row11: {
    width: '2%',
    paddingTop: 2
    },
    row12: {
    width: '16%',
    paddingTop: 2
    },
    row13: {
      width: '40%',
      paddingTop: 2
    },
    row14: {
      width: '10%',
      paddingTop: 2
    },
    row15: {
      width: '30%',
      borderRight: '0.5px solid black',
      borderBottom: '0.5px solid black',
      paddingTop: 2
    },
    row16: {
      width: '75%',
      borderRight: '0.5px solid black',
      borderBottom: '0.5px solid black',
      paddingTop: 2
    },
    row17: {
      width: '5%',
      paddingTop: 2,
      border: '1px solid white'
    },
})

export const CetakOkp = () => {
    const userData = useAuthStore(selectUser);
    const navigate = useNavigate();
    const location = useLocation();
    // const [list, setList] = useState([]);
    // const [img, setImg] = useState([]);
    // const [dataOKP, setDataOKP] = useState([]);
    const dataOKP = location.state.data;
    
    console.log(dataOKP)

    const backhome = (e) =>{
        navigate(e)
    }
  return (
    <div className='pengadaan'>
        <div className='pengadaan-item-top'>
            <div>
                <Breadcrumb>
                <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                <Breadcrumb.Item onClick={() => backhome(`/main/${userData.user_divisi}/OKP`)}>OKP</Breadcrumb.Item>
                <Breadcrumb.Item active>Preview</Breadcrumb.Item>
                </Breadcrumb>
            </div>
        </div>

        <PDFViewer style={{height: '80vh',padding:10}}>
            <Document>
              <Page size="A4" style={[styles.page,{background: 'red'}]}>
                <View style={styles.table}>
                    <Text style={styles.spasi}> </Text>

                    <View style={styles.row}>
                      <View style={[styles.row5, {  height: 60,alignItems : 'center',padding: 3 }]}>
                        <Image style={[styles.row5, {  height: 60,width: 70, border: 'none' }]} src={dagsap}/>
                        <Text style={styles.spasi2}>DAGSAP ENDURA EATORE</Text>
                      </View>

                      <View style={[styles.row7, {  height: 60,alignItems : 'center',padding: 8 }]}>
                        <Text style={{ textAlign: 'center', fontSize: '13',paddingTop: 13 }}>ORDER KERJA PRODUKSI(OKP)</Text>
                      </View>
                      
                      <View style={[styles.row8, { height: 60,padding: 2 }]}>
                        <Text style={[styles.spasi3, { height: 15 }]}>Nomor Dokumen</Text>
                        <Text style={[styles.spasi3, { height: 15 }]}>Revisi</Text>
                        <Text style={[styles.spasi3, { height: 15 }]}>Tanggal Efektif</Text>
                      </View>

                      <View style={[styles.row9, { height: 60,alignItems : 'center',padding: 2 }]}>
                        <Text style={[styles.spasi3, { height: 15 }]}>:</Text>
                        <Text style={[styles.spasi3, { height: 15 }]}>:</Text>
                        <Text style={[styles.spasi3, { height: 15 }]}>:</Text>
                      </View>

                      <View style={[styles.row2, { height: 60,padding: 2 }]}>
                        <Text style={[styles.spasi3, { height: 15 }]}>FRM.PPIC.01.01</Text>
                        <Text style={[styles.spasi3, { height: 15 }]}>01</Text>
                        <Text style={[styles.spasi3, { height: 15 }]}>11 Sept 2020</Text>
                      </View>
                    
                    </View>

                    <Text style={styles.spasi}> </Text>

                    <View style={styles.rows}>
                      <View style={[styles.row10, {  height: 60 }]}>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>No OKP</Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>Tanggal</Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>Revisi </Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>Tgl Revisi</Text>
                      </View>
                      <View style={[styles.row11, { height: 60,alignItems : 'center',padding: 2 }]}>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>:</Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>:</Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>:</Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>:</Text>
                      </View>
                      <View style={[styles.row12, {  height: 60 }]}>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>{dataOKP.okp[0].okp}</Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>{dataOKP.okp[0].tangOKP}</Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>{dataOKP.okp[0].revisi}</Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>{dataOKP.okp[0].tangRev}</Text>
                      </View>

                      <View style={[styles.row13, {  height: 60,alignItems : 'center',padding: 8 }]}>
                        <Text style={{ textAlign: 'center', fontSize: '13',paddingTop: 13 }}></Text>
                      </View>
                      
                      <View style={[styles.row14, { height: 60}]}>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>Tgl Produksi</Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>Shift</Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}></Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}></Text>
                      </View>

                      <View style={[styles.row11, { height: 60,alignItems : 'center',padding: 2 }]}>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>:</Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>:</Text>
                        <Text style={styles.spasi2}></Text>
                        <Text style={styles.spasi2}></Text>
                      </View>

                      <View style={[styles.row12, {  height: 60 }]}>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>{dataOKP.okp[0].tangProd}</Text>
                        <Text style={[styles.spasi2, {fontSize: '7.5px'}]}>1/2/3</Text>
                        <Text style={styles.spasi2}></Text>
                        <Text style={styles.spasi2}></Text>
                      </View>
                    
                    </View>

                    <Text style={styles.spasi}> </Text>

                    <View style={[styles.row, styles.bold]}>
                        <Text style={[styles.row1,{height: 15}]}>No</Text>
                        <Text style={[styles.row2,{height: 15}]}>KODE OKP</Text>
                        <Text style={[styles.row15,{height: 15}]}>Nama Produk</Text>
                        <Text style={[styles.row4,{height: 15}]}>Jumlah (batch)</Text>
                        <Text style={[styles.row4,{height: 15}]}>Varian Packing</Text>
                        <Text style={[styles.row4,{height: 15}]}>REVISI</Text>
                    </View>

                    
                    {dataOKP.dOKP.map((row, i) => (
                        <View key={i} style={styles.row} wrap={true}>
                          <View style={[styles.row1, {borderBottom:'none'}]}>
                            <Text style={{padding: 2, textAlign: 'center'}}>{row.no}</Text>
                          </View>
                          <View style={[styles.row2, {borderBottom:'none'}]}>
                            <Text style={{padding: 3, textAlign: 'left'}}>{row.kodeOKP}</Text>
                          </View>
                          <View style={[styles.row15, {borderBottom:'none'}]}>
                            <Text style={{padding: 2, textAlign: 'left'}}>{row.produk}</Text>
                          </View>
                          <View style={[styles.row4, {borderBottom:'none'}]}>
                            <Text style={{padding: 2, textAlign: 'center'}}>{row.batch}</Text>
                          </View>
                          <View style={[styles.row4, {borderBottom:'none'}]}>
                            <Text style={{padding: 2, textAlign: 'center'}}>{row.varian}</Text>
                          </View>
                          <View style={[styles.row4, {borderBottom:'none'}]}>
                            <Text style={{padding: 2, textAlign: 'center'}}>{row.revisi}</Text>  
                          </View>
                          
                        </View>
                    ))}
                    <View style={[styles.row, styles.bold]}>
                        <Text style={[styles.row5,{height: 15}]}>Jumlah</Text>
                        <Text style={[styles.row15,{height: 15}]}></Text>
                        <Text style={[styles.row4,{height: 15}]}>{dataOKP.okp[0].jumBarang}</Text>
                        <Text style={[styles.row4,{height: 15}]}></Text>
                        <Text style={[styles.row4,{height: 15}]}></Text>
                    </View>

                    {dataOKP.dNote.map((row, i) => (
                        <View key={i} style={styles.row} wrap={true}>
                          <View style={[styles.row17, {borderBottom:'none'}]}>
                            <Text style={{padding: 2, textAlign: 'center'}}></Text>
                          </View>
                          <View style={[styles.row2, {borderBottom:'none'}]}>
                            <Text style={{padding: 2, textAlign: 'center'}}>{row.no}</Text>
                          </View>
                          <View style={[styles.row16, {borderBottom:'none'}]}>
                            <Text style={{padding: 3, textAlign: 'left'}}>{row.note}</Text>
                          </View>
                        </View>
                    ))}

                    

                </View>
              </Page>
            </Document>
        </PDFViewer>
    </div>
  )
}
