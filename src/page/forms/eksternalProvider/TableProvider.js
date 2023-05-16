import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import './EksternalProvider.css';
// import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { Breadcrumb, Button, Stack } from 'react-bootstrap';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { COLUMNS_PROVIDER } from '../../../datafile/columns';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import useProviderStore, {selectProvider, selectFetchProvider, selectProviderReady, selectFalseProvider} from '../../../store/listProvider';


export const TableProvider = () => {
  let navigate = useNavigate();
  const gridRef = useRef();
  const userData = useAuthStore(selectUser);
  const newProvider = useProviderStore(selectProvider);
  const fetchProvider = useProviderStore(selectFetchProvider);
  const falseProvider = useProviderStore(selectFalseProvider);
  const providerReady = useProviderStore(selectProviderReady);
  const columns = useMemo(() => COLUMNS_PROVIDER, []);

  const [rowData, setRowData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [width, setWidth] = useState(window.innerWidth -200);
  const [height, setHeight] = useState(window.innerHeight-200);
  const containerStyle = useMemo(() => ({ Width: '100%', Height: '100%' }), []);

  useEffect(() => { 
      falseProvider();  
      fetchProvider();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
      setIsLoading(true);
      if (!providerReady) return;
      onGridReady();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerReady]);

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

  const onGridReady = () =>{
    const results =  newProvider.filter(element => {
        return  element.nama_provider
    });
    results.sort((a, b) => a.nama_provider.localeCompare(b.nama_provider));
    setRowData(results)
    setIsLoading(false);
  }

  const defaultColDef = useMemo(() => {
      return {
      editable: false,
      sortable: true,
      filter: true,
      resizable: true,
      };
  }, []);

  const onFirstDataRendered = useCallback((params) => {
      gridRef.current.api.paginationGoToPage(0);
  }, []);

  const backhome = (e) =>{
      navigate(e)
  }
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById('filter-text-box').value
    );
  }, []);

  return (
    <>
    
    <div style={{containerStyle}} className='containerStyle'>
        <div className='eksternalProvider'>
          <Stack direction="horizontal" gap={3}>
            <div className="bg-light">
                <Breadcrumb className="bg-light">
                  <Breadcrumb.Item onClick={() =>backhome(`/main/${userData.user_divisi}`)}>Form</Breadcrumb.Item>
                  <Breadcrumb.Item active>Eksternal Provider</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="ms-auto">
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
            </div>
            <div className="vr" />
            <div className="bg-light">
              <Button variant="primary" style={{marginRight: "20px"}} onClick={() =>backhome(`/main/${userData.user_divisi}/EksternalProvider/Create`)} ><i class="bi bi-plus-circle"></i> Add</Button>
            </div>
          </Stack>
        </div>

        <div style={{width: width, height: height, padding: 10}} className="ag-theme-alpine">
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columns}
                defaultColDef={defaultColDef}
                onFirstDataRendered={onFirstDataRendered}
            ></AgGridReact>
        </div>
    </div>

    {isLoading ? <LoadingPage/> : ""}
    </>
  )
}
