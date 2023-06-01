import React, { useMemo, useRef, useState, useEffect } from 'react';
import './permintaan.css';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Dropdown, Form, Stack, Tab, Tabs } from 'react-bootstrap';
import Swal from "sweetalert2";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { COLUMNS_PERMINTAAN } from '../../../datafile/columns';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import usePermintaanStore, { selectPermintaan, selectFetchPermintaan, selectPermintaanReady, selectFalsePermintaan } from '../../../store/dataPermintaan';

export const TablePermintaan = () => {
    let navigate = useNavigate();
    const gridRef = useRef();
    const userData = useAuthStore(selectUser);

    const onPermintaan = usePermintaanStore(selectFetchPermintaan);
    const dataPermintaan = usePermintaanStore(selectPermintaan);
    const permintaanReady = usePermintaanStore(selectPermintaanReady);
    const permintaanFalse = usePermintaanStore(selectFalsePermintaan);

    const [width, setWidth] = useState(window.innerWidth -200);
    const [height, setHeight] = useState(window.innerHeight-250);

    const [rowInggredient, setRowInggredient] = useState();
    const [rowPackaging, setRowPackaging] = useState();
    const [rowDaging, setRowDaging] = useState();
    const [rowKimia, setRowKimia] = useState();
    const [rowLain, setRowLain] = useState();

    const [key, setKey] = useState('Inggredient');
    
    const [tanggal, setTanggal] = useState('');
    const [datex, setDatex] = useState('')

    const [isLoading, setIsLoading] = useState(false);
    const columns = useMemo(() => COLUMNS_PERMINTAAN, []);


    const containerStyle = useMemo(() => ({ Width: '100%', Height: '100%' }), []);
    
    useEffect(() => { 
        setIsLoading(true);
        permintaanFalse();
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const day = date.getDate();
        let newMonth = "";
        let newDay = "";
        const p = (month + 1).toString().length;
        const y = (day).toString().length;
        
        if(p < 2){
            newMonth = '0' + month.toString();
        }
        else{
            newMonth = month.toString();
        };
        if (y < 2){
            newDay = '0' + day.toString();
        }
        else{
            newDay = day.toString();
        };
        setTanggal(`${year}/${newMonth}/${newDay}`);
        setDatex(`${year}-${newMonth}-${newDay}`);
        // onPermintaan(`${newDay}/${newMonth}/${year}`, userData.user_plan);
        onPermintaan(`${year}/${newMonth}/${newDay}`, userData.user_plan);
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // setIsLoading(true);
        if (!permintaanReady) return;
        onGridReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permintaanReady]);


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

    const onGridReady = () =>{
        try {
            const itemInggredient = dataPermintaan.filter(x => x.tipe.toUpperCase() === "INGGREDIENT");
            const itemPackaging = dataPermintaan.filter(x => x.tipe.toUpperCase() === "PACKAGING");
            const itemDaging = dataPermintaan.filter(x => x.tipe.toUpperCase() === "DAGING");
            const itemKimia = dataPermintaan.filter(x => x.tipe.toUpperCase() === "KIMIA");
            const itemLain = dataPermintaan.filter(x => x.tipe.toUpperCase() === "LAIN-LAIN");
            setRowInggredient(itemInggredient);
            setRowPackaging(itemPackaging);
            setRowDaging(itemDaging);
            setRowKimia(itemKimia);
            setRowLain(itemLain);
        } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Pengambilan Data Pengadaan Gagal!',
            footer: error.message
        })
        setIsLoading(false);
        }
    } 

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

    const onSetDate = (event) => {
        permintaanFalse();
        const date = new Date(event.target.value);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const day = date.getDate();
        let newMonth = "";
        let newDay = "";
        const p = (month + 1).toString().length;
        const y = (day).toString().length;
        
        if(p < 2){
            newMonth = '0' + month.toString();
        }
        else{
            newMonth = month.toString();
        };
        if (y < 2){
            newDay = '0' + day.toString();
        }
        else{
            newDay = day.toString();
        };

        console.log(`${newDay}/${newMonth}/${year}`)
        setTanggal(`${year}/${newMonth}/${newDay}`);
        setDatex(`${year}-${newMonth}-${newDay}`);
        // onPermintaan(`${newDay}/${newMonth}/${year}`, userData.user_plan);
        
        onPermintaan(`${year}/${newMonth}/${newDay}`, userData.user_plan);
        
    }

    const refreshPermintaan = (e) =>{
        console.log(tanggal, userData.user_plan)
        setIsLoading(true);
        permintaanFalse();
        onPermintaan(tanggal, userData.user_plan);
        setIsLoading(false);
    }

    const backhome = (e) =>{
        navigate(e);
    }

    const createPermintaan = (e) =>{
        navigate(e,{state:{
            tanggal : tanggal
        }})
    }

    return (
        <>
        <div style={{containerStyle}} className='containerStyle'>
            <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
                <div className="bg-light">
                    <Breadcrumb className="bg-light m-2">
                        <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                        <Breadcrumb.Item active>Permintaan</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="bg-light border ms-auto">
                    <Form.Control
                        type="date"
                        className='text-center border border-primary text-primary'
                        value={datex}
                        min="2020-08"
                        onChange={(e) =>onSetDate(e)}
                    />
                </div>
                <div className="vr" />
                <div className="bg-light">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary">
                        Menu
                        </Dropdown.Toggle>
                
                        <Dropdown.Menu variant="dark">
                            <Dropdown.Item onClick={() => createPermintaan(`/main/${userData.user_divisi}/Permintaan/Create`)}><i class="bi bi-pencil"></i> Create</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item ><i className="bi bi-printer"></i> Print</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={(e) => refreshPermintaan(e)}><i className="bi bi-arrow-clockwise"></i> Refresh</Dropdown.Item>
                            
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Stack>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
                >
                <Tab eventKey="Inggredient" title="Inggredient">
                    <div style={{width: `${width}`, height: height, padding: "0px 10px 0px 10px"}} className="ag-theme-alpine">
                        <AgGridReact
                            ref={gridRef}
                            rowData={rowInggredient}
                            columnDefs={columns}
                            defaultColDef={defaultColDef}
                            rowClassRules={rowClassRules}
                        ></AgGridReact>
                    </div>
                </Tab>
                <Tab eventKey="Packaging" title="Packaging">
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
                <Tab eventKey="Daging" title="Daging">
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
                <Tab eventKey="Kimia" title="Kimia">
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
                <Tab eventKey="Lain-lain" title="Lain-lain">
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
