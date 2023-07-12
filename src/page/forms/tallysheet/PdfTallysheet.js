import React, {useEffect, useState} from 'react';
import './tallysheet.css';
import { Breadcrumb, Stack } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore, { selectUser } from '../../../store/authLogin';

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

const BORDER_COLOR = '#bfbfbf';
const BORDER_STYLE = 'solid';

const styles = StyleSheet.create({
    body: {
      margin : '5mm'
    },
    table: { 
      width : '200mm',
      display : 'flex',
      flexDirection : 'row'
    }, 
    column: {
        display : 'flex',
        flexDirection : 'column'
    },
    row: {
        display : 'flex',
        flexDirection : 'row'
    },
    border : {
        borderStyle: BORDER_STYLE, 
        borderColor: BORDER_COLOR,
        borderWidth: 1, 
    },
    tableRow: {  
        flexDirection: "row" 
    }, 
    tableCol: {  
        borderStyle: BORDER_STYLE, 
        borderColor: BORDER_COLOR,
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0 
      },  
    tableCell: { 
    margin: 5, 
    fontSize: 10 
    }
    
    
});

export const PdfTallysheet = () => {
    const userData = useAuthStore(selectUser);
    const navigate = useNavigate();
    const location = useLocation();
    const [dataTally, setDataTally] = useState([]);

    const fileType =['Item', 'No.lot', 'Ext.Provider', 'No.', '1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', 'TTL'];


    useEffect (() => {
        const results = location.state.data.map(e => {
            const d = new Date(e.tambahan)
            return({ 
                id_tally : e.id_tally,		
                no_tally : e.no_tally,	
                bulan_tahun	: e.bulan_tahun,
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
                id_formproses : e.id_formproses,
                potong_karung : e.potong_karung,
                tambahan : d,
                srtJlan : e.srtJlan,
            })
            }    
        );
        results.sort(function(a,b){
            return new Date(a.tambahan) - new Date(b.tambahan)
        })

        for(let x =results.length; x < 320; x++){
            results.push({ 
                id_tally : '',		
                no_tally : '',	
                bulan_tahun	: '',
                item : '',	
                unit : '',
                no_lot : '',
                qty_tally : '0',
                status : '',
                supplier : '',
                tgl_tally : '',
                petugas_tally : '',
                tgl_input : '',
                petugas_input : '',
                id_formproses : '',
                potong_karung : '',
                tambahan : '',
                srtJlan : '',
            })
        }

        const perChunk = 10; 

        const result = results.reduce((resultArray, item, index) => { 
            const chunkIndex = Math.floor(index/perChunk)
          
            if(!resultArray[chunkIndex]) {
              resultArray[chunkIndex] = [] // start a new chunk
            }
          
            resultArray[chunkIndex].push(item);
            return resultArray
        }, []);
        setDataTally(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const backhome = (e) =>{
        navigate(e);
    }
    return (
        <>
            <div className='tallysheetSet'>
                <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
                    <div>
                        <Breadcrumb className="m-2">
                            <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                            <Breadcrumb.Item onClick={() => backhome(`/main/${userData.user_divisi}/Tallysheet`)}>List Tallysheet</Breadcrumb.Item>
                            <Breadcrumb.Item active>Create</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className=" ms-auto"></div>
                    <div className="vr" />
                    <div>
                    </div>
                </Stack>

                <PDFViewer style={{height: '80vh'}}>
                    <Document>
                        <Page style={styles.body}>
                            <View style={styles.table}> 
                                <View style={[styles.column,{width: '62mm'}]}>
                                    <View style={[styles.row,styles.border, {height: '13.5mm',width : '62mm'}]}>
                                        <Image style={{  height: '9.5mm',width: '50mm', border: 'none',marginLeft : '6.5mm',marginTop : '2mm' }} src={dagsap}/>
                                    </View>
                                    <View style={[styles.row,styles.border, {height: '5.5mm',width : '62mm',textAlign : 'center'}]}>
                                        <Text style={{fontSize : '7',textAlign: 'center',paddingTop: '2',marginLeft : '12.5mm'  }}>PT DAGSAP ENDURA EATORE</Text>
                                    </View>
                                </View>
                                <View style={[styles.column, styles.border, {width: '63mm',height : '19mm'}]}>
                                    <Text style={{fontSize : '14',textAlign: 'center', marginTop: '5mm'}}>TALLYSHEET</Text>
                                </View>
                                <View style={[styles.column, {width: '35mm'}]}>
                                    {['Nomor Dokumen','Revisi','Tanggal Efektif','Halaman',].map((variant) => (
                                        <View style={[styles.row,styles.border, {height: '4.75mm',width : '35mm',textAlign : 'center'}]}>
                                            <Text style={{fontSize : '7',textAlign: 'left',paddingLeft: '1mm', paddingTop: '1mm'}}>{variant}</Text>
                                        </View>
                                    ))}
                                </View>
                                <View style={[styles.column, styles.border, {width: '4mm',height : '19mm'}]}>
                                    {[':',':',':',':',].map((variant) => (
                                        <View style={[styles.row, {height: '4.75mm',width : '35mm',textAlign : 'center'}]}>
                                            <Text style={{fontSize : '7',textAlign: 'left',paddingLeft: '1mm', paddingTop: '1mm'}}>{variant}</Text>
                                        </View>
                                    ))}
                                </View>
                                <View style={[styles.column, {width: '35mm',height : '19mm'}]}>
                                    {['FRM.WHM.01.01','00','28 Februari 2017','1 dari 1',].map((variant) => (
                                        <View style={[styles.row,styles.border, {height: '4.75mm',width : '35mm',textAlign : 'center'}]}>
                                            <Text style={{fontSize : '7',textAlign: 'left',paddingLeft: '1mm', paddingTop: '1mm'}}>{variant}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={[styles.table, {textAlign: 'left',fontSize: '8',marginTop: '3mm'}]}>
                                <View style={[styles.row, {width: '100%'}]}>
                                    <Text style={{width: '20mm'}}>NO SJ</Text> 
                                    <Text style={{width: '4mm'}}>:</Text> 
                                    <Text style={{width: '38mm',borderBottom : '1px solid black'}}>
                                        {location.state.data[0].srtJlan}
                                    </Text> 
                                </View>
                                
                            </View> 

                            <View style={[styles.table, {textAlign: 'left',fontSize: '8',marginTop: '3mm'}]}>
                                <View style={[styles.row, {width: '100%'}]}>
                                    <Text style={{width: '20mm'}}>Tgl</Text> 
                                    <Text style={{width: '4mm'}}>:</Text> 
                                    <Text style={{width: '38mm',borderBottom : '1px solid black'}}>
                                    {location.state.data[0].tgl_tally}

                                    </Text> 
                                </View>
                            </View> 

                            {/* data table 1 */}
                            <View style={[styles.table, {marginTop : '5mm'}]}>
                                {[0,1,2,].map((a,b) => {
                                    let n = 4 * a;
                                    let ml = '';
                                    if(b > 0){ml ='2.5mm'}else{ml ='0mm'}
                                    return(
                                        <View>
                                            <View style={[styles.row, {width : '65mm',marginLeft : ml}]}>
                                                <View style={[styles.row]}>
                                                    <View style={[styles.column, {width : '13mm'}]}>
                                                        {fileType.map((variant) => (
                                                            <View style={[styles.border, {height : '4.5mm'}]}>
                                                                <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}>{variant}</Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </View>
                                                <View style={[styles.column]}>
                                                    <View style={[styles.column, {width : '52mm'}]}>
                                                        {['item','no_lot','supplier',].map((x,y) => {
                                                            if(dataTally.length === 0){
                                                                return(
                                                                    <View style={[styles.border, {width : '52mm',height: '4.5mm'}]}>
                                                                    <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}></Text>
                                                                    </View>
                                                                )
                                                            }
                                                            else{
                                                                let nilai = ''
                                                                if(y === 0){nilai = dataTally[n][0].item}
                                                                else if(y === 1){nilai = dataTally[n][0].no_lot}
                                                                else{nilai = dataTally[n][0].supplier}
                                                                return(
                                                                    <View style={[styles.border, {width : '52mm',height: '4.5mm'}]}>
                                                                    <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}>{nilai}</Text>
                                                                    </View>
                                                                )
                                                            }
                                                            
                                                        })}
                                                    </View>
                                                    <View style={[styles.row, styles, {width : '52mm',height: '4.5mm'}]}>
                                                        {['0','1','2','3',].map((x,y) => {
                                                            return(
                                                                <View style={[styles.row, styles.border, {width : '13mm',height: '4.5mm'}]}></View>
                                                            )
                                                        })}
                                                    </View>
                                                    <View style={[styles.row, {width : '52mm',height: '45mm'}]}>
                                                        {['0','1','2','3',].map((x,y) => {
                                                            return(
                                                                <View style={[styles.column,{textAlign: 'left',fontSize: '7',margin :'0'}]}>
                                                                {['0','1','2','3','4','5','6','7','8','9',].map((e,i) => {
                                                                    if(dataTally.length === 0){
                                                                        return(
                                                                            <View style={[styles.table, styles.border, {width: '13mm',height : '4.5mm'}]}>
                                                                                <Text style={{margin: '1'}}></Text> 
                                                                            </View>
                                                                        )
                                                                    }
                                                                    else{
                                                                        let nilai = "";
                                                                        const daya  = parseFloat(dataTally[y+n][i].qty_tally);
                                                                        if(daya === 0){nilai = ""}else{nilai = daya}
                                                                        return(
                                                                            <View style={[styles.table, styles.border, {width: '13mm',height : '4.5mm'}]}>
                                                                                <Text style={{margin: '1'}}>{nilai}</Text> 
                                                                            </View>
                                                                        )
                                                                    }
                                                                })}
                                                            </View>
                                                            )
                                                        }   
                                                        )}
                                                    </View>
                                                    <View style={[styles.row, styles, {width : '52mm',height: '4.5mm'}]}>
                                                        {[0,1,2,3,].map((variant) => {
                                                            if(dataTally.length === 0){
                                                                return(
                                                                    <View style={[styles.border, {height : '4.5mm',width : '13mm'}]}>
                                                                        <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}></Text>
                                                                    </View>
                                                                )
                                                            }
                                                            else{
                                                                const msgTotal = dataTally[variant+n].reduce(function(prev, cur) {
                                                                    let qty = parseFloat(cur.qty_tally)
                                                                    return (prev + qty)
                                                                }, 0);
                                                                let nilai = "";
                                                                let nilain = parseFloat(msgTotal).toFixed(2)
                                                                if(nilain === "0.00"){nilai = ""}else{nilai = nilain}
                                                                return(
                                                                    <View style={[styles.border, {height : '4.5mm',width : '13mm'}]}>
                                                                        <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}>{nilai}</Text>
                                                                    </View>
                                                                )
                                                            }
                                                        })}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}   
                            </View>
                            {/* data table 2 */}
                            <View style={[styles.table, {marginTop : '3mm'}]}>
                                {[3,4,5,].map((a,b) => {
                                    let n = 4 * a;
                                    let ml = '';
                                    if(b > 0){ml ='2.5mm'}else{ml ='0mm'}
                                    return(
                                        <View>
                                            <View style={[styles.row, {width : '65mm',marginLeft : ml}]}>
                                                <View style={[styles.row]}>
                                                    <View style={[styles.column, {width : '13mm'}]}>
                                                        {fileType.map((variant) => (
                                                            <View style={[styles.border, {height : '4.5mm'}]}>
                                                                <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}>{variant}</Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </View>
                                                <View style={[styles.column]}>
                                                    <View style={[styles.column, {width : '52mm'}]}>
                                                        {['item','no_lot','supplier',].map((x,y) => {
                                                            if(dataTally.length === 0){
                                                                return(
                                                                    <View style={[styles.border, {width : '52mm',height: '4.5mm'}]}>
                                                                    <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}></Text>
                                                                    </View>
                                                                )
                                                            }
                                                            else{
                                                                let nilai = ''
                                                                if(y === 0){nilai = dataTally[n][0].item}
                                                                else if(y === 1){nilai = dataTally[n][0].no_lot}
                                                                else{nilai = dataTally[n][0].supplier}
                                                                return(
                                                                    <View style={[styles.border, {width : '52mm',height: '4.5mm'}]}>
                                                                    <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}>{nilai}</Text>
                                                                    </View>
                                                                )
                                                            }
                                                            
                                                        })}
                                                    </View>
                                                    <View style={[styles.row, styles, {width : '52mm',height: '4.5mm'}]}>
                                                        {['0','1','2','3',].map((x,y) => {
                                                            return(
                                                                <View style={[styles.row, styles.border, {width : '13mm',height: '4.5mm'}]}></View>
                                                            )
                                                        })}
                                                    </View>
                                                    <View style={[styles.row, {width : '52mm',height: '45mm'}]}>
                                                        {['0','1','2','3',].map((x,y) => {
                                                            return(
                                                                <View style={[styles.column,{textAlign: 'left',fontSize: '7',margin :'0'}]}>
                                                                {['0','1','2','3','4','5','6','7','8','9',].map((e,i) => {
                                                                    if(dataTally.length === 0){
                                                                        return(
                                                                            <View style={[styles.table, styles.border, {width: '13mm',height : '4.5mm'}]}>
                                                                                <Text style={{margin: '1'}}></Text> 
                                                                            </View>
                                                                        )
                                                                    }
                                                                    else{
                                                                        let nilai = "";
                                                                        const daya  = parseFloat(dataTally[y+n][i].qty_tally);
                                                                        if(daya === 0){nilai = ""}else{nilai = daya}
                                                                        return(
                                                                            <View style={[styles.table, styles.border, {width: '13mm',height : '4.5mm'}]}>
                                                                                <Text style={{margin: '1'}}>{nilai}</Text> 
                                                                            </View>
                                                                        )
                                                                    }
                                                                })}
                                                            </View>
                                                            )
                                                        }   
                                                        )}
                                                    </View>
                                                    <View style={[styles.row, styles, {width : '52mm',height: '4.5mm'}]}>
                                                        {[0,1,2,3,].map((variant) => {
                                                            if(dataTally.length === 0){
                                                                return(
                                                                    <View style={[styles.border, {height : '4.5mm',width : '13mm'}]}>
                                                                        <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}></Text>
                                                                    </View>
                                                                )
                                                            }
                                                            else{
                                                                const msgTotal = dataTally[variant+n].reduce(function(prev, cur) {
                                                                    let qty = parseFloat(cur.qty_tally)
                                                                    return (prev + qty)
                                                                }, 0);
                                                                let nilai = "";
                                                                let nilain = parseFloat(msgTotal).toFixed(2)
                                                                if(nilain === "0.00"){nilai = ""}else{nilai = nilain}
                                                                return(
                                                                    <View style={[styles.border, {height : '4.5mm',width : '13mm'}]}>
                                                                        <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}>{nilai}</Text>
                                                                    </View>
                                                                )
                                                            }
                                                        })}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}   
                            </View>
                            {/* data table 3 */}
                            <View style={[styles.table, {marginTop : '3mm'}]}>
                                {[6,7,8,].map((a,b) => {
                                    let n = 4 * a;
                                    let ml = '';
                                    if(b > 0){ml ='2.5mm'}else{ml ='0mm'}
                                    if(a <8){
                                        return(
                                            <View>
                                                <View style={[styles.row, {width : '65mm',marginLeft : ml}]}>
                                                    <View style={[styles.row]}>
                                                        <View style={[styles.column, {width : '13mm'}]}>
                                                            {fileType.map((variant) => (
                                                                <View style={[styles.border, {height : '4.5mm'}]}>
                                                                    <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}>{variant}</Text>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    </View>
                                                    <View style={[styles.column]}>
                                                        <View style={[styles.column, {width : '52mm'}]}>
                                                            {['item','no_lot','supplier',].map((x,y) => {
                                                                if(dataTally.length === 0){
                                                                    return(
                                                                        <View style={[styles.border, {width : '52mm',height: '4.5mm'}]}>
                                                                        <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}></Text>
                                                                        </View>
                                                                    )
                                                                }
                                                                else{
                                                                    let nilai = ''
                                                                    if(y === 0){nilai = dataTally[n][0].item}
                                                                    else if(y === 1){nilai = dataTally[n][0].no_lot}
                                                                    else{nilai = dataTally[n][0].supplier}
                                                                    return(
                                                                        <View style={[styles.border, {width : '52mm',height: '4.5mm'}]}>
                                                                        <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}>{nilai}</Text>
                                                                        </View>
                                                                    )
                                                                }
                                                                
                                                            })}
                                                        </View>
                                                        <View style={[styles.row, styles, {width : '52mm',height: '4.5mm'}]}>
                                                            {['0','1','2','3',].map((x,y) => {
                                                                return(
                                                                    <View style={[styles.row, styles.border, {width : '13mm',height: '4.5mm'}]}></View>
                                                                )
                                                            })}
                                                        </View>
                                                        <View style={[styles.row, {width : '52mm',height: '45mm'}]}>
                                                            {['0','1','2','3',].map((x,y) => {
                                                                return(
                                                                    <View style={[styles.column,{textAlign: 'left',fontSize: '7',margin :'0'}]}>
                                                                    {['0','1','2','3','4','5','6','7','8','9',].map((e,i) => {
                                                                        if(dataTally.length === 0){
                                                                            return(
                                                                                <View style={[styles.table, styles.border, {width: '13mm',height : '4.5mm'}]}>
                                                                                    <Text style={{margin: '1'}}></Text> 
                                                                                </View>
                                                                            )
                                                                        }
                                                                        else{
                                                                            let nilai = "";
                                                                            const daya  = parseFloat(dataTally[y+n][i].qty_tally);
                                                                            if(daya === 0){nilai = ""}else{nilai = daya}
                                                                            return(
                                                                                <View style={[styles.table, styles.border, {width: '13mm',height : '4.5mm'}]}>
                                                                                    <Text style={{margin: '1'}}>{nilai}</Text> 
                                                                                </View>
                                                                            )
                                                                        }
                                                                    })}
                                                                </View>
                                                                )
                                                            }   
                                                            )}
                                                        </View>
                                                        <View style={[styles.row, styles, {width : '52mm',height: '4.5mm'}]}>
                                                            {[0,1,2,3,].map((variant) => {
                                                                if(dataTally.length === 0){
                                                                    return(
                                                                        <View style={[styles.border, {height : '4.5mm',width : '13mm'}]}>
                                                                            <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}></Text>
                                                                        </View>
                                                                    )
                                                                }
                                                                else{
                                                                    const msgTotal = dataTally[variant+n].reduce(function(prev, cur) {
                                                                        let qty = parseFloat(cur.qty_tally)
                                                                        return (prev + qty)
                                                                    }, 0);
                                                                    let nilai = "";
                                                                    let nilain = parseFloat(msgTotal).toFixed(2)
                                                                    if(nilain === "0.00"){nilai = ""}else{nilai = nilain}
                                                                    return(
                                                                        <View style={[styles.border, {height : '4.5mm',width : '13mm'}]}>
                                                                            <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}>{nilai}</Text>
                                                                        </View>
                                                                    )
                                                                }
                                                            })}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }
                                    else{
                                        return(
                                            <View style={[styles.row, {width : '65mm',marginLeft:'2.5mm'}]}>
                                                <View style={[styles.row, {width : '13mm'}]}>
                                                    <View style={[styles.column, {width : '13mm'}]}>
                                                    {fileType.map((variant) => (
                                                        <View style={[styles.border, {height : '4.5mm'}]}>
                                                            <Text style={{fontSize : '6.5',textAlign: 'left',paddingLeft: '1',paddingTop: '2'}}>{variant}</Text>
                                                        </View>
                                                    ))}
                                                    </View>
                                                </View>
                                                <View style={[styles.column, {width : '52mm'}]}>
                                                    <View style={[styles.column, {width : '52mm'}]}>
                                                        {['0','1','2',].map((x,y) => {
                                                            return(
                                                                <View style={[styles.border, {width : '52mm',height: '4.5mm'}]}></View>
                                                            )
                                                        })}
                                                    </View>
                                                    <View style={[styles.row, styles, {width : '52mm',height: '4.5mm'}]}>
                                                        {['0','1','2','3',].map((x,y) => {
                                                            return(
                                                                <View style={[styles.row, styles.border, {width : '13mm',height: '4.5mm'}]}>
                                                
                                                                </View>
                                                            )
                                                        })}
                                                    </View> 
                                                    <View style={[styles.column, {width : '52mm'}]}>
                                                        <View style={[styles.border, {width : '52mm',height: '4.5mm'}]}>
                                                        <Text style={{fontSize : '7',textAlign: 'left',paddingLeft: '13mm',paddingTop: '2'}}>POTONG KARUNG</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[styles.row, styles, {width : '52mm',height: '4.5mm'}]}>
                                                        {['0','1','2','3',].map((x,y) => {
                                                            if(dataTally.length === 0){
                                                                return(
                                                                    <View style={[styles.table, styles.border, {width: '13mm',height : '4.5mm'}]}>
                                                                        <Text style={{margin: '1'}}></Text> 
                                                                    </View>
                                                                )
                                                            }
                                                            else{
                                                                let pkar = location.state.data.length * parseFloat(location.state.data[0].potong_karung);
                                                                let nilPKar = parseFloat(location.state.data[0].potong_karung).toFixed(2);
                                                                let nilTot = parseFloat(pkar).toFixed(2);
                                                                let cNilai = parseFloat(nilPKar) * 1000/ 1000;
                                                                let cTotal = parseFloat(nilTot) * 1000/ 1000;
                                                                
                                                                let data = [location.state.data.length,'X',cNilai,cTotal]
                                                                return(
                                                                    <View style={[styles.table, styles.border, {width: '13mm',height : '4.5mm'}]}>
                                                                        <Text style={{fontSize : '7',textAlign: 'center',paddingTop: '2', marginLeft: '2'}}>{data[y]}</Text>
                                                                    </View>
                                                                )
                                                            }
                                                        })}
                                                    </View>
                                                    <View style={[styles.row, styles, {width : '52mm',height: '4.5mm'}]}>
                                                        {['0','1','2','3',].map((x,y) => {
                                                            return(
                                                                <View style={[styles.row, styles.border, {width : '13mm',height: '4.5mm'}]}>
                                                
                                                                </View>
                                                            )
                                                        })}
                                                    </View>
                                                    <View style={[styles.column, {width : '52mm'}]}>
                                                        <View style={[styles.border, {width : '52mm',height: '4.5mm'}]}>
                                                        <Text style={{fontSize : '7',textAlign: 'left',paddingLeft: '24mm',paddingTop: '2'}}>TOTAL</Text>
                                                        </View>
                                                    </View>
                                                    
                                                    <View style={[styles.row, styles, {width : '52mm',height: '4.5mm'}]}>
                                                        {['0','1','2','3',].map((x,y) => {
                                                            if(dataTally.length === 0){
                                                                return(
                                                                    <View style={[styles.table, styles.border, {width: '13mm',height : '4.5mm'}]}>
                                                                        <Text style={{margin: '1'}}></Text> 
                                                                    </View>
                                                                )
                                                            }
                                                            else{
                                                                const msgTotal = location.state.data.reduce(function(prev, cur) {
                                                                    let qty = parseFloat(cur.qty_tally)
                                                                    return (prev + qty)
                                                                }, 0);
                                                                let pkar = location.state.data.length * parseFloat(location.state.data[0].potong_karung);
                                                                let total = msgTotal - pkar;
                                                                let nilain = parseFloat(msgTotal).toFixed(2);
                                                                let nilPKar = parseFloat(pkar).toFixed(2);
                                                                let nilTot = parseFloat(total).toFixed(2);
                                                                
                                                                let cNilian = parseFloat(nilain) * 1000/ 1000;
                                                                let cPkar = parseFloat(nilPKar) * 1000/ 1000;
                                                                let cTotal = parseFloat(nilTot) * 1000/ 1000;
                                                                let data = [cNilian,'-',cPkar,cTotal]
                                                                return(
                                                                    <View style={[styles.table, styles.border, {width: '13mm',height : '4.5mm'}]}>
                                                                        <Text style={{fontSize : '7',textAlign: 'center',paddingTop: '2', marginLeft: '2'}}>{data[y]}</Text>
                                                                    </View>
                                                                )
                                                            }
                                                        })}
                                                    </View>
                                                    <View style={[styles.row, {width : '52mm',height: '30mm'}]}>
                                                        {['0','1','2','3',].map((x,y) => {
                                                            return(
                                                                <View style={[styles.column,{textAlign: 'left',fontSize: '7',margin :'0'}]}>
                                                                {['0','1','2','3','4','5',].map((e,i) => {
                                                                    return(
                                                                        <View style={[styles.table, styles.border, {width: '13mm',height : '4.5mm'}]}>
                                                                            <Text style={{margin: '1'}}></Text> 
                                                                        </View>
                                                                    )
                                                                })}
                                                            </View>
                                                            )
                                                        }   
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }
                                })}   
                            </View>
                            <Text style={{fontSize: '7',fontWeight:'bold'}}>Note : cantumkan tanggal dan nama, pada saat menanda tangani form ini</Text> 

                            <View style={[styles.table, {marginTop : '5mm'}]}>
                                {['Pengirim','Petugas Tally','Penerima',].map((a,b) => {
                                    let ml = '';
                                    if(b > 0){ml ='2.5mm'}else{ml ='0mm'}
                                    return(
                                        <View>
                                            <View style={[styles.row, {width : '65mm',marginLeft : ml}]}>
                                            <Text style={{flex: 1, textAlign: "center",fontSize: '8'}}>{a}</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                            <View style={[styles.table]}>
                                {['Pengirim','Petugas Tally','Penerima',].map((a,b) => {
                                    let ml = '';
                                    if(b > 0){ml ='2.5mm'}else{ml ='0mm'}
                                    return(
                                        <View>
                                            <View style={[styles.row, {width : '65mm',height : '20mm',marginLeft : ml}]}>
                                            <Text style={{flex: 1, textAlign: "center",fontSize: '9'}}></Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                            <View style={[styles.table]}>
                                {['Pengirim','Petugas Tally','Penerima',].map((a,b) => {
                                    let ml = '';
                                    if(b > 0){ml ='2.5mm'}else{ml ='0mm'}
                                    return(
                                        <View>
                                            <View style={[styles.row, {width : '65mm',marginLeft : ml}]}>
                                            <Text style={{flex: 1, textAlign: "center",fontSize: '9'}}>(                                           )</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                            
                        </Page>
                    </Document>
                </PDFViewer>
            </div>

            
        </>
    )
}
