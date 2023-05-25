import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './bom.css';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Button } from 'react-bootstrap';
import Swal from "sweetalert2";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { COLUMNS_BOM } from '../../../datafile/columns';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useBomStore, {selectBom, selectFetchBom, selectBomReady} from '../../../store/listBom';
import useAuthStore, { selectUser } from '../../../store/authLogin';

export const TabelBom = () => {
    let navigate = useNavigate();
    const gridRef = useRef();
    const userData = useAuthStore(selectUser);
    const onBom = useBomStore(selectFetchBom);
    const dataBom = useBomStore(selectBom);
    const bomReady = useBomStore(selectBomReady);
    const columns = useMemo(() => COLUMNS_BOM, []);
    const containerStyle = useMemo(() => ({ Width: '100%', Height: '100%' }), []);
    const [width, setWidth] = useState(window.innerWidth -200);
    const [height, setHeight] = useState(window.innerHeight-200);
    const [isLoading, setIsLoading] = useState(false);
    const [rowData, setRowData] = useState();

    useEffect(() => {   
        onBom()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(bomReady)
        setIsLoading(true);
        if (!bomReady) return;
        onGridReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bomReady]);

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
            setRowData(dataBom);
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

    const onFirstDataRendered = useCallback((params) => {
        gridRef.current.api.paginationGoToPage(0);
    }, []);

    const onPageSizeChanged = useCallback(() => {
        var value = document.getElementById('page-size').value;
        gridRef.current.api.paginationSetPageSize(Number(value));
    }, []);


    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
          document.getElementById('filter-text-box').value
        );
    }, []);

    const backhome = (e) =>{
        onBom()
        navigate(e)
    }
    
    return (
        <>
            <div style={{containerStyle}} className='containerStyle'>
                <div className='bom-item-top'>
                    <div>
                        <Breadcrumb>
                        <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                        <Breadcrumb.Item active>BOM</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div style={{marginRight: 10, display:'flex'}}>
                        <form className='search'>
                            <input
                                type="text"
                                id="filter-text-box"
                                className='search__input'
                                placeholder="Search..."
                                onInput={onFilterTextBoxChanged}
                            />
                            <button type='button' className='search__btn'>
                                <i className="bi bi-search"></i>
                            </button>
                        </form>
                        <Button variant="primary" onClick={() => backhome(`/main/${userData.user_divisi}/BOM/Create`)}><i class="bi bi-pencil"></i> Create</Button>

                        
                    </div>
                </div>

                <div className='bom-item-top'>
                    <div className="pengadaan-item-top-one">
                        Page Size: &nbsp;
                        <select onChange={onPageSizeChanged} id="page-size">
                            <option value="5">5</option>
                            <option value="10" selected={true}>10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="500">500</option>
                            <option value="1000">1000</option>
                        </select>
                    </div>
                </div>

                <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        paginationNumberFormatter={paginationNumberFormatter}
                        onFirstDataRendered={onFirstDataRendered}
                        cacheQuickFilter={true}
                    ></AgGridReact>
                </div>
            </div>
            {isLoading ? <LoadingPage/> : ""}
        </>
    )
}
