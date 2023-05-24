import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './dataSparepart.css';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Card, Dropdown, DropdownButton, Stack, Tab, Tabs } from 'react-bootstrap';
import Swal from "sweetalert2";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { COLUMNS_SPAREPART } from '../../../datafile/columns';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';

import usePartStore, { selectPart, selectFetchPart, selectPartReady, selectFalsePart } from '../../../store/ListPart';

export const TableSparePart = () => {
    let navigate = useNavigate();
    const gridRef = useRef();
  
    const userData = useAuthStore(selectUser);
  
    const onPart = usePartStore(selectFetchPart);
    const dataPart = usePartStore(selectPart);
    const partReady = usePartStore(selectPartReady);
    const partFalse = usePartStore(selectFalsePart);
  
    const columns = useMemo(() => COLUMNS_SPAREPART, []);
    const containerStyle = useMemo(() => ({ Width: '100%', Height: '100%' }), []);
    const [width, setWidth] = useState(window.innerWidth -200);
    const [height, setHeight] = useState(window.innerHeight-200);
    const [isLoading, setIsLoading] = useState(false);
  
    const [rowBautMur, setRowBautMur] = useState();
    const [rowBearing, setRowBearing] = useState();
    const [rowEkspedisi, setRowEkspedisi] = useState();
    const [rowElektrik, setRowElektrik] = useState();
    const [rowMekanik, setRowMekanik] = useState();
    const [rowNonInventory, setRowNonInventory] = useState();
    const [rowSealRing, setRowSealRing] = useState();
    const [rowUtility, setRowUtility] = useState();
    const [rowVbelt, setRowVbelt] = useState();
  
    const [jmlAman, setJmlAman] = useState(0);
    const [jmlOrder, setJmlOrder] = useState(0);
    const [jmlPengajuan, setJmlPengajuan] = useState(0);
    const [jmlLimit, setJmlLimit] = useState(0);
    const [jmlTaktif, setJmlTaktif] = useState(0);
     
    const [key, setKey] = useState('Baut & Mur' );
    const tipeBarang = ['Semua','Baut & Mur','Bearing','Ekspedisi','Elektrik','Mekanikal','Seal & Ring','Utility','V Belt','Non Inventory'];
  
    useEffect(() => { 
      setIsLoading(true);
      partFalse();
      onPart(userData.user_plan)
      console.log(userData)
      setIsLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
  
      useEffect(() => {
          // setIsLoading(true);
          if (!partReady) return;
          onGridReady()
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [partReady]);
  
      useEffect(() => {
          function handleResize() {
              if(window.innerWidth >= 991){
                  setWidth(window.innerWidth -200);
              }
              else{
                  setWidth(window.innerWidth -20);
              }
          
          setHeight(window.innerHeight - 220);
          }
          window.addEventListener("resize", handleResize);
          return () => window.removeEventListener("resize", handleResize);
      }, [width,height]);
  
      const defaultColDef = useMemo(() => {
          return {
          editable: false,
          sortable: true,
          filter: true,
          resizable: true,
          };
      }, []);
  
      const paginationNumberFormatter = useCallback((params) => {
          return '[' + params.value.toLocaleString() + ']';
      }, []);
  
      const onGridReady = () => {
          try {
              const bautMur = dataPart.filter(x => x.tipe_barng.toUpperCase() === "BAUT & MUR");  
              const bearing = dataPart.filter(x => x.tipe_barng.toUpperCase() === "BEARING");     
              const ekspedisi = dataPart.filter(x => x.tipe_barng.toUpperCase() === "EKSPEDISI");   
              const elektrik = dataPart.filter(x => x.tipe_barng.toUpperCase() === "ELEKTRIK");    
              const mekanikal = dataPart.filter(x => x.tipe_barng.toUpperCase() === "MEKANIKAL");   
              const nonInventory = dataPart.filter(x => x.tipe_barng.toUpperCase() === "NON INVENTORY");   
              const sealRing = dataPart.filter(x => x.tipe_barng.toUpperCase() === "SEAL & RING");     
              const utility = dataPart.filter(x => x.tipe_barng.toUpperCase() === "UTILITY");     
              const vBelt = dataPart.filter(x => x.tipe_barng.toUpperCase() === "V BELT"); 
              //['Semua','Baut & Mur','Bearing','Ekspedisi','Elektrik','Mekanikal','Seal & Ring','Utility','V Belt','Non Inventory']
              const jumAman = dataPart.filter(x => x.status_item.toUpperCase() === "AMAN");  
              const jumOrder = dataPart.filter(x => x.status_item.toUpperCase() === "ORDER");     
              const jumPengajuan = dataPart.filter(x => x.status_item.toUpperCase() === "PENGAJUAN");   
              const jumLimit = dataPart.filter(x => x.status_item.toUpperCase() === "STOCK LIMIT");    
              const jumTaktif = dataPart.filter(x => x.status_item.toUpperCase() === "TIDAK AKTIF");   
  
              setRowBautMur(bautMur);
              setRowBearing(bearing);
              setRowEkspedisi(ekspedisi);
              setRowElektrik(elektrik);
              setRowMekanik(mekanikal);
              setRowNonInventory(nonInventory);
              setRowSealRing(sealRing);
              setRowUtility(utility);
              setRowVbelt(vBelt);
  
              setJmlAman(jumAman.length);
              setJmlOrder(jumOrder.length);
              setJmlPengajuan(jumPengajuan.length);
              setJmlLimit(jumLimit.length);
              setJmlTaktif(jumTaktif.length)
  
          } catch (error) {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Pengambilan Data Pengadaan Gagal!',
              footer: error.message
          })
          setIsLoading(false);
          }
          
      };
  
      const onFirstDataRendered = useCallback((params) => {
          gridRef.current.api.paginationGoToPage(0);
      }, []);
  
      const backhome = (e) =>{
      navigate(e)
      }
  
      const handleDrop = (data,key) =>{
          if(key === "Semua"){
              setRowBautMur();
              setRowBearing();
              setRowEkspedisi();
              setRowElektrik();
              setRowMekanik();
              setRowNonInventory();
              setRowSealRing();
              setRowUtility();
              setRowVbelt();
              onGridReady();
          }
          else{
              const bautMur = dataPart.filter(x => x.tipe_barng.toUpperCase() === "BAUT & MUR" && x.status_item.toUpperCase() === data.toUpperCase());  
              const bearing = dataPart.filter(x => x.tipe_barng.toUpperCase() === "BEARING" && x.status_item.toUpperCase() === data.toUpperCase());     
              const ekspedisi = dataPart.filter(x => x.tipe_barng.toUpperCase() === "EKSPEDISI" && x.status_item.toUpperCase() === data.toUpperCase());   
              const elektrik = dataPart.filter(x => x.tipe_barng.toUpperCase() === "ELEKTRIK" && x.status_item.toUpperCase() === data.toUpperCase());    
              const mekanikal = dataPart.filter(x => x.tipe_barng.toUpperCase() === "MEKANIKAL" && x.status_item.toUpperCase() === data.toUpperCase());   
              const nonInventory = dataPart.filter(x => x.tipe_barng.toUpperCase() === "NON INVENTORY" && x.status_item.toUpperCase() === data.toUpperCase());   
              const sealRing = dataPart.filter(x => x.tipe_barng.toUpperCase() === "SEAL & RING" && x.status_item.toUpperCase() === data.toUpperCase());     
              const utility = dataPart.filter(x => x.tipe_barng.toUpperCase() === "UTILITY" && x.status_item.toUpperCase() === data.toUpperCase());     
              const vBelt = dataPart.filter(x => x.tipe_barng.toUpperCase() === "V BELT" && x.status_item.toUpperCase() === data.toUpperCase());      
              
              setRowBautMur(bautMur);
              setRowBearing(bearing);
              setRowEkspedisi(ekspedisi);
              setRowElektrik(elektrik);
              setRowMekanik(mekanikal);
              setRowNonInventory(nonInventory);
              setRowSealRing(sealRing);
              setRowUtility(utility);
              setRowVbelt(vBelt);
              setKey(key)
          }
      }
  
    return (
      <> 
        <div style={{containerStyle}} className='containerStyle'>
            <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
                <div className="bg-light">
                    <Breadcrumb className="bg-light m-2">
                        <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                        <Breadcrumb.Item active>Table Spare Part</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="bg-light ms-auto">
                    <div className="bg-light ">
                    </div>
                </div>
                <div className="vr" />
                <div className="bg-light">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary">
                        Menu
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant="dark">
                            <Dropdown.Item onClick={() => backhome(`/main/${userData.user_divisi}/Sparepart/CreatePart`)}><i class="bi bi-pencil"></i> Create</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item ><i className="bi bi-printer"></i> Print</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item><i className="bi bi-arrow-clockwise"></i> Refresh</Dropdown.Item>
                            
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Stack>
    
            <div className="row mb-1" style={{padding: "0px 10px 0px 10px"}}>
                <div className="col-md-2">
                    <Card className='mb-1'>
                        <div className="radius-10 border-start border-0 border-3 border-success">
                            <Card.Body style={{height: "50px", padding: '8px'}}>
                                <Stack direction="horizontal" gap={3}>
                                    <div>
                                        <h6>Aman ({jmlAman})</h6>
                                    </div>
                                    <div className="bg-light ms-auto">
                                        <DropdownButton id="dropdown-basic-button" variant="outline-success" size='sm'>
                                        {   
                                            tipeBarang.map((x, i) => {
                                                let index = tipeBarang[i].toString();
                                                let index1 = '';
                                                let index2 = '';
                                                if(index === "Semua"){
                                                    index1 = dataPart;
                                                }
                                                else{
                                                    index1 = dataPart.filter(x => x.tipe_barng.toUpperCase() === index.toUpperCase() && x.status_item === "AMAN");
                                                    
                                                }
                                                
                                                index2 = `${index} (${index1.length})`
                                                return(
                                                    <Dropdown.Item onClick={(e)=> handleDrop("AMAN",index)}>{index2}</Dropdown.Item>
                                                )
                                            
                                            })
                                        }
                                        </DropdownButton>
                                    </div>
                                    
                                </Stack>
                            </Card.Body>
                        </div>
                    </Card>
                </div>
                <div className="col-md-2">
                    <Card className='mb-1'>
                        <div className="radius-10 border-start border-0 border-3 border-primary">
                            <Card.Body style={{height: "50px", padding: '8px'}}>
                                <Stack direction="horizontal" gap={3}>
                                    <div>
                                        <h6>Order ({jmlOrder})</h6>
                                    </div>
                                    <div className="bg-light ms-auto">
                                        <DropdownButton id="order" variant="outline-primary" size='sm'>
                                            {tipeBarang.map((x, i) => {
                                                let index = tipeBarang[i].toString();
                                                let index1 = '';
                                                let index2 = '';
                                                if(index === "Semua"){
                                                    index1 = dataPart;
                                                }
                                                else{
                                                    index1 = dataPart.filter(x => x.tipe_barng.toUpperCase() === index.toUpperCase() && x.status_item === "ORDER");
                                                    
                                                }
                                                
                                                index2 = `${index} (${index1.length})`
                                                
                                                return(
                                                    <Dropdown.Item onClick={(e)=> handleDrop("ORDER",index)}>{index2}</Dropdown.Item>
                                                )
                                                
                                            })}
                                        </DropdownButton>
                                    </div>
                                </Stack>
                            </Card.Body>
                        </div>
                    </Card>
                </div>
                <div className="col-md-2">
                    <Card className='mb-1'>
                        <div className="radius-10 border-start border-0 border-3 border-warning">
                            <Card.Body style={{height: "50px", padding: '8px'}}>
                                <Stack direction="horizontal" gap={3}>
                                    <div>
                                        <h6>Pengajuan ({jmlPengajuan})</h6>
                                    </div>
                                    <div className="bg-light ms-auto">
                                        <DropdownButton id="dropdown-basic-button" variant="outline-warning" size='sm'>
                                            {tipeBarang.map((x, i) => {
                                                let index = tipeBarang[i].toString();
                                                let index1 = '';
                                                let index2 = '';
                                                if(index === "Semua"){
                                                    index1 = dataPart;
                                                }
                                                else{
                                                    index1 = dataPart.filter(x => x.tipe_barng.toUpperCase() === index.toUpperCase() && x.status_item === "PENGAJUAN");
                                                    
                                                }
                                                
                                                index2 = `${index} (${index1.length})`
                                                
                                                return(
                                                    <Dropdown.Item onClick={(e)=> handleDrop("PENGAJUAN",index)}>{index2}</Dropdown.Item>
                                                )
                                                
                                            })}
                                        </DropdownButton>
                                    </div>
                                </Stack>
                            </Card.Body>
                        </div>
                    </Card>
                </div>
                <div className="col-md-2">
                    <Card className='mb-1'>
                        <div className="radius-10 border-start border-0 border-3 border-dark">
                            <Card.Body style={{height: "50px", padding: '8px'}}>
                                <Stack direction="horizontal" gap={3}>
                                    <div>
                                        <h6>Stock Limit ({jmlLimit})</h6>
                                    </div>
                                    <div className="bg-light ms-auto">
                                        <DropdownButton id="dropdown-basic-button" variant="outline-dark" size='sm'>
                                            {tipeBarang.map((x, i) => {
                                                let index = tipeBarang[i].toString();
                                                let index1 = '';
                                                let index2 = '';
                                                if(index === "Semua"){
                                                    index1 = dataPart;
                                                }
                                                else{
                                                    index1 = dataPart.filter(x => x.tipe_barng.toUpperCase() === index.toUpperCase() && x.status_item === "STOCK LIMIT");
                                                    
                                                }
                                                
                                                index2 = `${index} (${index1.length})`
                                                
                                                return(
                                                    <Dropdown.Item onClick={(e)=> handleDrop("STOCK LIMIT",index)}>{index2}</Dropdown.Item>
                                                )
                                                
                                            })}
                                        </DropdownButton>
                                    </div>
                                </Stack>
                            </Card.Body>
                        </div>
                    </Card>
                </div>
                <div className="col-md-2">
                    <Card className='mb-1'>
                        <div className="radius-10 border-start border-0 border-3 border-danger">
                            <Card.Body style={{height: "50px", padding: '8px'}}>
                                <Stack direction="horizontal" gap={3}>
                                    <div>
                                        <h6>Tidak Aktif ({jmlTaktif})</h6>
                                    </div>
                                    <div className="bg-light ms-auto">
                                        <DropdownButton id="dropdown-basic-button" variant="outline-danger" size='sm'>
                                            {tipeBarang.map((x, i) => {
                                                let index = tipeBarang[i].toString();
                                                let index1 = '';
                                                let index2 = '';
                                                if(index === "Semua"){
                                                    index1 = dataPart;
                                                }
                                                else{
                                                    index1 = dataPart.filter(x => x.tipe_barng.toUpperCase() === index.toUpperCase() && x.status_item === "TIDAK AKTIF");
                                                    
                                                }
                                                
                                                index2 = `${index} (${index1.length})`
                                                
                                                return(
                                                    <Dropdown.Item onClick={(e)=> handleDrop("TIDAK AKTIF",index)}>{index2}</Dropdown.Item>
                                                )
                                                
                                            })}
                                        </DropdownButton>
                                    </div>
                                </Stack>
                            </Card.Body>
                        </div>
                    </Card>
                </div>
            </div>
            
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => {
                    setKey(k);
                    onGridReady();
                }}
                className="mb-1"
            >
                <Tab eventKey="Baut & Mur" title="Baut & Mur">
                    <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowBautMur}
                            columnDefs={columns}
                            defaultColDef={defaultColDef}
                            pagination={true}
                            paginationPageSize={10}
                            paginationNumberFormatter={paginationNumberFormatter}
                            onFirstDataRendered={onFirstDataRendered}
                            cacheQuickFilter={true}
                        ></AgGridReact>
                    </div>
                </Tab>
                <Tab eventKey="Bearing" title="Bearing">
                    <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                        <AgGridReact
                        ref={gridRef}
                        rowData={rowBearing}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        paginationNumberFormatter={paginationNumberFormatter}
                        onFirstDataRendered={onFirstDataRendered}
                        cacheQuickFilter={true}
                        ></AgGridReact>
                    </div>
                </Tab>
                <Tab eventKey="Ekspedisi" title="Ekspedisi">
                    <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                        <AgGridReact
                        ref={gridRef}
                        rowData={rowEkspedisi}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        paginationNumberFormatter={paginationNumberFormatter}
                        onFirstDataRendered={onFirstDataRendered}
                        cacheQuickFilter={true}
                        ></AgGridReact>
                    </div>
                </Tab>
                <Tab eventKey="Elektrik" title="Elektrik">
                    <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                        <AgGridReact
                        ref={gridRef}
                        rowData={rowElektrik}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        paginationNumberFormatter={paginationNumberFormatter}
                        onFirstDataRendered={onFirstDataRendered}
                        cacheQuickFilter={true}
                        ></AgGridReact>
                    </div>
                </Tab>
                <Tab eventKey="Mekanikal" title="Mekanikal">
                    <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                        <AgGridReact
                        ref={gridRef}
                        rowData={rowMekanik}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        paginationNumberFormatter={paginationNumberFormatter}
                        onFirstDataRendered={onFirstDataRendered}
                        cacheQuickFilter={true}
                        ></AgGridReact>
                    </div>
                </Tab>
                <Tab eventKey="Seal & Ring" title="Seal & Ring">
                    <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                        <AgGridReact
                        ref={gridRef}
                        rowData={rowSealRing}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        paginationNumberFormatter={paginationNumberFormatter}
                        onFirstDataRendered={onFirstDataRendered}
                        cacheQuickFilter={true}
                        ></AgGridReact>
                    </div>
                </Tab>
                <Tab eventKey="Utility" title="Utility">
                    <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                        <AgGridReact
                        ref={gridRef}
                        rowData={rowUtility}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        paginationNumberFormatter={paginationNumberFormatter}
                        onFirstDataRendered={onFirstDataRendered}
                        cacheQuickFilter={true}
                        ></AgGridReact>
                    </div>
                </Tab>
                <Tab eventKey="V Belt" title="V Belt">
                    <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                        <AgGridReact
                        ref={gridRef}
                        rowData={rowVbelt}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        paginationNumberFormatter={paginationNumberFormatter}
                        onFirstDataRendered={onFirstDataRendered}
                        cacheQuickFilter={true}
                        ></AgGridReact>
                    </div>
                </Tab>
                <Tab eventKey="Non Inventory" title="Non Inventory">
                    <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                        <AgGridReact
                        ref={gridRef}
                        rowData={rowNonInventory}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        paginationNumberFormatter={paginationNumberFormatter}
                        onFirstDataRendered={onFirstDataRendered}
                        cacheQuickFilter={true}
                        ></AgGridReact>
                    </div>
                </Tab>
            
            </Tabs>
        </div>
    
        {isLoading ? <LoadingPage/> : ""}
      </>
    )
}
