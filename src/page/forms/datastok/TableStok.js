import React, {useEffect, useMemo, useRef, useState} from 'react';
import './datastok.css';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Card, Dropdown, DropdownButton, Stack, Tab, Tabs } from 'react-bootstrap';
import Swal from "sweetalert2";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { COLUMNS_GUDANG } from '../../../datafile/columns';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import useMaterialStore, { selectMaterial,selectFetchMaterial,selectMaterialReady } from '../../../store/listBarang';

export const TableStok = () => {
    let navigate = useNavigate();
    const gridRef = useRef();
    const userData = useAuthStore(selectUser);
    const onStock = useMaterialStore(selectFetchMaterial);
    const dataStock = useMaterialStore(selectMaterial);
    const stockReady = useMaterialStore(selectMaterialReady);
    const columns = useMemo(() => COLUMNS_GUDANG, []);
    const containerStyle = useMemo(() => ({ Width: '100%', Height: '100%' }), []);
    const [width, setWidth] = useState(window.innerWidth -200);
    const [height, setHeight] = useState(window.innerHeight-200);
    const [isLoading, setIsLoading] = useState(false);

    const [rowInggredient, setRowInggredient] = useState();
    const [rowPackaging, setRowPackaging] = useState();
    const [rowDaging, setRowDaging] = useState();
    const [rowKimia, setRowKimia] = useState();
    const [rowLain, setRowLain] = useState();
    
    const [jmlAman, setJmlAman] = useState(0);
    const [jmlOrder, setJmlOrder] = useState(0);
    const [jmlPengajuan, setJmlPengajuan] = useState(0);
    const [jmlLimit, setJmlLimit] = useState(0);
    const [jmlTaktif, setJmlTaktif] = useState(0);

    const [key, setKey] = useState('Inggredient' );
    const tipeBarang = ['Semua','Inggredient','Packaging','Daging','Kimia','Lain-lain'];


    useEffect(() => {   
        onStock()
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
  
    useEffect(() => {
        setIsLoading(true);
        if (!stockReady) return;
        onGridReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stockReady]);

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

    const onGridReady = () => {
        try {
            const itemInggredient = dataStock.filter(x => x.tipe_barng.toUpperCase() === "INGGREDIENT");
            const itemPackaging = dataStock.filter(x => x.tipe_barng.toUpperCase() === "PACKAGING");
            const itemDaging = dataStock.filter(x => x.tipe_barng.toUpperCase() === "DAGING");
            const itemKimia = dataStock.filter(x => x.tipe_barng.toUpperCase() === "KIMIA");
            const itemLain = dataStock.filter(x => x.tipe_barng.toUpperCase() === "LAIN-LAIN");

            const jumAman = dataStock.filter(x => x.ket_limit.toUpperCase() === "AMAN");  
            const jumOrder = dataStock.filter(x => x.ket_limit.toUpperCase() === "ORDER");     
            const jumPengajuan = dataStock.filter(x => x.ket_limit.toUpperCase() === "PENGAJUAN");   
            const jumLimit = dataStock.filter(x => x.ket_limit.toUpperCase() === "STOCK LIMIT");    
            const jumTaktif = dataStock.filter(x => x.ket_limit.toUpperCase() === "TIDAK AKTIF");   

            setRowInggredient(itemInggredient);
            setRowPackaging(itemPackaging);
            setRowDaging(itemDaging);
            setRowKimia(itemKimia);
            setRowLain(itemLain);

            setJmlAman(jumAman.length);
            setJmlOrder(jumOrder.length);
            setJmlPengajuan(jumPengajuan.length);
            setJmlLimit(jumLimit.length);
            setJmlTaktif(jumTaktif.length)

            setIsLoading(false);
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Pengambilan Data Pengadaan Gagal!',
              footer: error.message
            })
          }
        
    };

    const rowClassRules = useMemo(() => {
        return {
            /* clr-Pengajuan,Progress,Selesai,Revisi,Verify,nul*/
          'clr-Pengajuan': (params) => {
            return params.data.status_item ==='Pengajuan';
          },
          'clr-Progress': (params) => {
            return params.data.status_item ==='Progress';
          },
          'clr-Selesai': (params) => {
            return params.data.status_item ==='Selesai';
          },
          'clr-Revisi': (params) => {
            return params.data.status_item ==='Revisi';
          },
          'clr-Verify': (params) => {
            return params.data.status_item ==='Verify';
          },
          'clr-nul': (params) => {
            return params.data.status_item ==='';
          },
        };
      }, []);

    const handleDrop = (data,key) =>{
        if(key === "Semua"){
            setRowInggredient();
            setRowPackaging();
            setRowDaging();
            setRowKimia();
            setRowLain();
            onGridReady();
        }
        else{
            const itemInggredient = dataStock.filter(x => x.tipe_barng.toUpperCase() === "INGGREDIENT"  && x.ket_limit.toUpperCase() === data.toUpperCase());
            const itemPackaging = dataStock.filter(x => x.tipe_barng.toUpperCase() === "PACKAGING"  && x.ket_limit.toUpperCase() === data.toUpperCase());
            const itemDaging = dataStock.filter(x => x.tipe_barng.toUpperCase() === "DAGING"  && x.ket_limit.toUpperCase() === data.toUpperCase());
            const itemKimia = dataStock.filter(x => x.tipe_barng.toUpperCase() === "KIMIA"  && x.ket_limit.toUpperCase() === data.toUpperCase());
            const itemLain = dataStock.filter(x => x.tipe_barng.toUpperCase() === "LAIN-LAIN"  && x.ket_limit.toUpperCase() === data.toUpperCase());
            
            setRowInggredient(itemInggredient);
            setRowPackaging(itemPackaging);
            setRowDaging(itemDaging);
            setRowKimia(itemKimia);
            setRowLain(itemLain);
            setKey(key)
        }
    }

    const backhome = (e) =>{
        onStock();
        navigate(e);
    }
  return (
    <>
    <div style={{containerStyle}} className='containerStyle'>
        <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
            <div className="bg-light">
                <Breadcrumb className="bg-light m-2">
                    <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                    <Breadcrumb.Item active>Stok Gudang</Breadcrumb.Item>
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
                        <Dropdown.Item onClick={() => backhome(`/main/${userData.user_divisi}/STOKGUDANG/create`)}><i class="bi bi-pencil"></i> Create</Dropdown.Item>
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
                                                index1 = dataStock;
                                            }
                                            else{
                                                index1 = dataStock.filter(x => x.tipe_barng.toUpperCase() === index.toUpperCase() && x.ket_limit === "AMAN");
                                                
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
                                                index1 = dataStock;
                                            }
                                            else{
                                                index1 = dataStock.filter(x => x.tipe_barng.toUpperCase() === index.toUpperCase() && x.ket_limit === "ORDER");
                                                
                                            }
                                            index2 = `${index} (${index1.length})`;
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
                                                index1 = dataStock;
                                            }
                                            else{
                                                index1 = dataStock.filter(x => x.tipe_barng.toUpperCase() === index.toUpperCase() && x.ket_limit === "PENGAJUAN");
                                                
                                            }
                                            index2 = `${index} (${index1.length})`;
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
                                                index1 = dataStock;
                                            }
                                            else{
                                                index1 = dataStock.filter(x => x.tipe_barng.toUpperCase() === index.toUpperCase() && x.ket_limit === "STOCK LIMIT");
                                                
                                            }
                                            index2 = `${index} (${index1.length})`;
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
                                                index1 = dataStock;
                                            }
                                            else{
                                                index1 = dataStock.filter(x => x.tipe_barng.toUpperCase() === index.toUpperCase() && x.ket_limit === "TIDAK AKTIF");
                                                
                                            }
                                            index2 = `${index} (${index1.length})`;
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
            onSelect={(k) => setKey(k)}
            className="mb-3"
            >
            <Tab eventKey="Inggredient" title={`Inggredient`}>
                <div style={{width: width, height: height, padding: "0px 10px 0px 10px"}} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowInggredient}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        rowClassRules={rowClassRules}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="Packaging" title={`Packaging`}>
                <div style={{width: width, height: height, padding: "0px 10px 0px 10px"}} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowPackaging}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        rowClassRules={rowClassRules}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="Daging" title={`Daging`}>
                <div style={{width: width, height: height, padding: "0px 10px 0px 10px"}} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowDaging}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        rowClassRules={rowClassRules}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="Kimia" title={`Kimia`}>
                <div style={{width: width, height: height, padding: "0px 10px 0px 10px"}} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowKimia}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        rowClassRules={rowClassRules}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="Lain-lain" title={`Lain-lain`}>
                <div style={{width: width, height: height, padding: "0px 10px 0px 10px"}} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowLain}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                    ></AgGridReact>
                </div>
            </Tab>
        </Tabs>

    </div>
    {isLoading ? <LoadingPage/> : ""}
    </>
  )
}
