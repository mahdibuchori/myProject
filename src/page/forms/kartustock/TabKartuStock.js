import React, { useMemo, useRef, useState, useEffect } from 'react';
import './kartuStock.css';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Col, Dropdown, Form, Stack } from 'react-bootstrap';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import Swal from "sweetalert2";
// import Select from'../../../component/Select';
import Select from 'react-select';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { API_AUTH } from '../../../apis/apisData';

import { COLUMNS_STOCKCARD } from '../../../datafile/columns';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import useMaterialStore, { selectMaterial, selectFetchMaterial, selectMaterialReady } from '../../../store/listBarang';


export const TabKartuStock = () => {
    let navigate = useNavigate();
    const gridRef = useRef();
    const userData = useAuthStore(selectUser);

    const newMaterial = useMaterialStore(selectMaterial);
    const fetchMaterial = useMaterialStore(selectFetchMaterial);
    const readyMaterial = useMaterialStore(selectMaterialReady);
    
    const [isLoading, setIsLoading] = useState(false);
    
    const [width, setWidth] = useState(window.innerWidth -200);
    const [height, setHeight] = useState(window.innerHeight-250);

    const containerStyle = useMemo(() => ({ Width: '100%', Height: '100%' }), []);

    const [tglAwal, setTglAwal] = useState('');
    const [tglAkhir, setTglAkhir] = useState('');
    const [fileBar, setFileBar] = useState([]);
    const [items, setItems] = useState([]);
    const [rowData, setRowData] = useState();
    const columns = useMemo(() => COLUMNS_STOCKCARD, []);

    useEffect(() => {   
        fetchMaterial();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    useEffect(() => {
        setIsLoading(true);
        if (!readyMaterial) return;
        onMaterialReady();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [readyMaterial]);

    useEffect(() => {
        const createUniq = () => {
            const d = new Date();
            let yy = d.getFullYear();
            let bln = parseInt(d.getMonth()) + 1;
            let day = d.getDate();
            let bb = String(bln).padStart(2, '0');
            let dd = String(day).padStart(2, '0');
            
            setTglAkhir(`${yy}-${bb}-${dd}`);
            setTglAwal(`${yy}-${bb}-${dd}`);
            setRowData([])
        }
        createUniq()
    }, []);
    
    const onMaterialReady = () =>{
        let modifiedArr = newMaterial.map(function(element){
            return { value: element.item, label: element.item, tipe_barng: element.tipe_barng, saldo: element.saldo_akhir, unit: element.unit };
        });
        
        setFileBar(modifiedArr);
        setIsLoading(false);
        console.log(modifiedArr)
    }

    const defaultColDef = useMemo(() => {
        return {
        editable: false,
        sortable: true,
        filter: true,
        resizable: true,
        };
      }, []);

    const handleApply = (event, picker) => {
        const d = new Date(picker.startDate._d);
        let yy = d.getFullYear();
        let bln = parseInt(d.getMonth()) + 1;
        let day = d.getDate();
        let bb = String(bln).padStart(2, '0');
        let dd = String(day).padStart(2, '0');

        const date = new Date(picker.endDate._d);
        let year = date.getFullYear();
        let month = parseInt(date.getMonth()) + 1;
        let days = date.getDate();
        let bulan = String(month).padStart(2, '0');
        let hari = String(days).padStart(2, '0');

        console.log(`${yy}-${bb}-${dd}`);
        console.log(`${year}-${bulan}-${hari}`);
        
        setTglAwal(`${yy}-${bb}-${dd}`);
        setTglAkhir(`${year}-${bulan}-${hari}`);
      };

    const handleChange = (e) =>{
        let data = e.map(function(element){
            return element.value
        });
        setItems(data)
    }

    const handleSubmit = async () =>{
        try {
            setIsLoading(true)
            const data  =  await API_AUTH.get('/stockcard', {
                params: {
                    item : items,
                    tAwal : tglAwal,
                    tAkhir : tglAkhir,
                    plan : userData.user_plan
                }
            });
            const file = data.data;
            const sortNumAsc = file.sort((a, b) => {
                const name1 = a.item.toUpperCase();
                const name2 = b.item.toUpperCase();
                let comparison = 0;

                if (name1 > name2) {
                    comparison = 1;
                } else if (name1 < name2) {
                    comparison = -1;
                }
                return comparison;
            });
            setRowData(sortNumAsc)
            setIsLoading(false);
        } catch (error) {
            Swal.fire(`${error.message}`,'','error');
            setIsLoading(false);
        }

        
    }

    const backhome = (e) =>{
        navigate(e);
    }
  return (
    <>
    <div style={{containerStyle}} className='containerStyle'>
        <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
            <div className="bg-light">
                <Breadcrumb className="bg-light m-2">
                    <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                    <Breadcrumb.Item active>Kartu Stock</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="bg-light border ms-auto">
            </div>
            <div className="vr" />
            <div className="bg-light">
                <Dropdown>
                    <Dropdown.Toggle variant="primary">
                    Menu
                    </Dropdown.Toggle>
            
                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item ><i class="bi bi-pencil"></i> Create</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item ><i className="bi bi-printer"></i> Print</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item ><i className="bi bi-arrow-clockwise"></i> Refresh</Dropdown.Item>
                        
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </Stack>
        <div className="row m-1">
            <div className='col-lg-6'>
                <Form.Group as={Col} controlId="validationCustom01">
                    <Form.Label>Nama Item</Form.Label>
                    <Select
                        isMulti
                        name="colors"
                        options={fileBar}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(e)=>handleChange(e)}
                    />
                </Form.Group>
            </div>
            <div className='col-lg-3'>
                <Form.Group as={Col} controlId="validationCustom01">
                    <Form.Label>Tanggal</Form.Label>
                    <DateRangePicker
                        onApply={handleApply}
                    >
                        <input type="text" className="form-control" />
                    </DateRangePicker>
                </Form.Group>
            </div>
            <div className='col-lg-3 mt-3'>
                <Button variant="outline-primary" onClick={handleSubmit}><i class="bi bi-search"></i> Cari item</Button>
            </div>  
        </div>

        <div style={{width: width, height: height, padding: "0px 10px 0px 10px", marginBottom: "50px"}} className="ag-theme-alpine mb-5">
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columns}
                defaultColDef={defaultColDef}
                // rowClassRules={rowClassRules}
            ></AgGridReact>
        </div>

        
    </div>

    {isLoading ? <LoadingPage/> : ""}
    </>
  )
}
