import React, { useEffect, useState } from 'react';
import '../dashboard.css';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Container, Stack } from 'react-bootstrap';

import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useDashboardStore, { selectDashFg,selectfetchDashFg,selectFgReady } from '../../../store/dataDashboard';
import { WeaklyFg } from './WeaklyFg';
import { WeaklyItFg } from './WeaklyItFg';
import { ParetoFg } from './ParetoFg';


export const DashboardFg = () => {
    const navigate = useNavigate();

    const onDashboard = useDashboardStore(selectfetchDashFg);
    const dataDashboard = useDashboardStore(selectDashFg);
    const dashboardReady = useDashboardStore(selectFgReady);
    const [nabar, setNabar] = useState('');
    const [naMat, setNaMet] = useState([{value:'',label:''}]);
    const [isMaterial, setIsMaterial] = useState('');
    const [item, setItem] = useState([]);
    const [items, setItems] = useState({value:'',label:''});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { 
        setIsLoading(true);
        onDashboard()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!dashboardReady) return;
        onGridReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dashboardReady]);

    useEffect(() => {
        performRefresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMaterial]);

    const onGridReady = (x) =>{
        setIsLoading(false); 
        const data = dataDashboard.data;
        const resultItem = data.filter((v,i,a)=>a.findIndex(v2=>(v2.item===v.item))===i);
        let material = resultItem.map(d => { 
        return {value:  d.item.trim(), label: d.item.trim()}
        });
        const arr = material.filter(object => {
            return object.value !== 'Total';
        });
        const newArr = arr.filter(object => {
            return object.value !== 'Average';
        });
        const newsArr = newArr.filter(object => {
            return object.value !== 'Average / Hari';
        });
        
        setItem(material)
        setItems(newsArr[0])
    }

    const handleSelect = (e) =>{
        setNabar(e.value)
    }

    const performRefresh = () =>{
        console.log(isMaterial)
        if(isMaterial === ""){
            console.log(isMaterial);
        } 
        else{
            try {
                setNaMet({value: isMaterial, label: isMaterial});
                setNabar(isMaterial);
            } catch (error) {
                // Swal.fire('Opsss..','Terjadi Kesalahan Harap Refresh Page','error')
            }
        }
    }

    const pergiKe = (e) =>{
        navigate(e);
    }
  return (
    <>
        <div className='dashboard'>
            <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
                <div>
                    <Breadcrumb className="m-2">
                        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item onClick={() => pergiKe(`/main/dashboard`)}>Purchasing</Breadcrumb.Item>
                        <Breadcrumb.Item active>Finish Good</Breadcrumb.Item>
                        <Breadcrumb.Item onClick={() => pergiKe(`/main/dashboard/PPIC`)}>PPIC</Breadcrumb.Item>
                        <Breadcrumb.Item onClick={() => pergiKe(`/main/dashboard/WIP`)}>WIP</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className=" ms-auto"></div>
                <div>
                    
                </div>
            </Stack>

            <Container className='mt-0' fluid>
            <div className='row'>
                <div className='col-xl-9 col-lg-9 mb-2'>
                    <div className='row'>
                        <div className='col-xl-4 col-lg-4'>
                            <h6 className='mt-3 mb-3 float-start text-dark'>Nama Item : </h6>
                        </div>
                        <div className='col-xl-8 col-lg-8'>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue={items}
                                isClearable={false}
                                isSearchable={true}
                                value={naMat}
                                name="color"
                                options={item}
                                onChange={e => handleSelect(e)}
                            />
                        </div>
                    
                        <div className='col-xl-12 col-lg-12 mb-2'>
                            <WeaklyFg name={nabar}/>
                        </div>
                        <div className='col-xl-12 col-lg-12 mb-2'>
                            <WeaklyItFg name={nabar}/>
                        </div>
                    </div>
                
                </div>
                <div className='col-xl-3 col-lg-3 mb-2'>
                    <ParetoFg sendToParent={setIsMaterial}/>
                </div>
            </div>
            </Container>
        </div>


        {isLoading ? <LoadingPage/> : ""}
    </>
  )
}