import React, { useMemo, useRef, useState, useEffect } from 'react';
import './sales.css';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Dropdown, Stack, Tab, Tabs } from 'react-bootstrap';
import Swal from "sweetalert2";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { COLUMNS_SALES, COLUMNS_PRODUCT, COLUMNS_CUSTOMER } from '../../../datafile/columns';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import useDataSales, { selectProduct, selectFetchProduct, selectProductReady } from '../../../store/dataSales';

export const TableSales = () => {
    let navigate = useNavigate();
    const gridRef = useRef();
    const userData = useAuthStore(selectUser);

    const onProduct = useDataSales(selectFetchProduct);
    const dataProduct = useDataSales(selectProduct);
    const productReady = useDataSales(selectProductReady);

    const [width, setWidth] = useState(window.innerWidth -200);
    const [height, setHeight] = useState(window.innerHeight-250);

    const [rowProduct, setRowProduct] = useState();
    const [rowSales, setRowSales] = useState();
    const [rowCustomer, setRowCustomer] = useState();

    const [key, setKey] = useState('Product');

    const [isLoading, setIsLoading] = useState(false);
    const columns = useMemo(() => COLUMNS_PRODUCT, []);
    const columns1 = useMemo(() => COLUMNS_SALES, []);
    const columns2 = useMemo(() => COLUMNS_CUSTOMER, []);

    const containerStyle = useMemo(() => ({ Width: '100%', Height: '100%' }), []);

    useEffect(() => { 
        setIsLoading(true);
        onProduct()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // setIsLoading(true);
        if (!productReady) return;
        console.log(productReady)
        onGridReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productReady]);


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
            setRowCustomer(dataProduct.customer);
            setRowProduct(dataProduct.product);

            const result = dataProduct.sales.map(e => {
                    return({salesmanid: e.salesmanid, firstname: e.firstname, jobtitle: e.jobtitle, cellular: e.cellular, email: e.email,notes : e.notes})
                }    
            );

            result.sort(function(a,b){
                return parseInt(a.salesmanid) - parseInt(b.salesmanid)
            })
            setRowSales(result);
            console.log(dataProduct.product)
            console.log(dataProduct.customer)
            console.log(result)
            setIsLoading(false)
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
                    <Breadcrumb.Item active>Data Sales</Breadcrumb.Item>
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
                        <Dropdown.Item><i class="bi bi-pencil"></i> Create</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item><i className="bi bi-printer"></i> Print</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item><i className="bi bi-arrow-clockwise"></i> Refresh</Dropdown.Item>
                        
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
            <Tab eventKey="Product" title="Product">
                <div style={{width: width, height: height, padding: "0px 10px 0px 10px"}} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowProduct}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="Sales" title="Sales">
                <div style={{width: width, height: height, padding: "0px 10px 0px 10px"}} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowSales}
                        columnDefs={columns1}
                        defaultColDef={defaultColDef}
                    ></AgGridReact>
                </div>
            </Tab>
            <Tab eventKey="Customer" title="Customer">
                <div style={{width: width, height: height, padding: "0px 10px 0px 10px"}} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowCustomer}
                        columnDefs={columns2}
                        defaultColDef={defaultColDef}
                    ></AgGridReact>
                </div>
            </Tab>
        </Tabs>
    </div>
    {isLoading ? <LoadingPage /> : ""}
    </>
  )
}
