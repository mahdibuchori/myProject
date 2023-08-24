import React, { useState, useEffect } from 'react';
import '../dashboard.css';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Container, Form, Stack } from 'react-bootstrap';

import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';

import useDashboardStore, { selectFetchDashPpic, selectPpicReady } from '../../../store/dataDashboard';
import { ChartInggredient } from './ChartInggredient';
import { ChartPackaging } from './ChartPackaging';
import { ChartDaging } from './ChartDaging';
import { ChartKimia } from './ChartKimia';
import { ParetoInggredient } from './ParetoInggredient';
import { ParetoPackaging } from './ParetoPackaging';
import { ParetoDaging } from './ParetoDaging';
import { ParetoKimia } from './ParetoKimia';

export const DashboardPPIC = () => {
    const navigate = useNavigate();
    const userData = useAuthStore(selectUser);

    const onDashboard = useDashboardStore(selectFetchDashPpic);
    const dashboardReady = useDashboardStore(selectPpicReady);

    const [month, setMonth] = useState();
    const [isParentData, setIsParentData] = useState('');
    const [parentPackaging, setParentPackaging] = useState('');
    const [parentKimia, setParentKimia] = useState('');
    const [parentDaging, setParentDaging] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { 
        setIsLoading(true);
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        let bb = String(month).padStart(2, '0');
        setMonth(`${year}-${bb}`);
        onDashboard()
        console.log(userData.user_name)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!dashboardReady) return;
        onGridReady(0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dashboardReady]);


    const onGridReady = (x) =>{
        setIsLoading(false); 
        // const dataInggredient = dataDashboard.inggredient;
        // const dataPackaging = dataDashboard.packaging;
        // const dataDaging = dataDashboard.daging;
        // const dataKimia = dataDashboard.kimia;

        // const inggredient = dataInggredient.filter((v,i,a)=>a.findIndex(v2=>(v2.item===v.item))===i);
        // const daging = dataDaging.filter((v,i,a)=>a.findIndex(v2=>(v2.item===v.item))===i);
        // const packaging = dataPackaging.filter((v,i,a)=>a.findIndex(v2=>(v2.item===v.item))===i);
        // const kimia = dataKimia.filter((v,i,a)=>a.findIndex(v2=>(v2.bulan===v.bulan))===i);
    }

    const onSetDate = (e) =>{
        console.log(e.target.value)
        setMonth(e.target.value)
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
                    <Breadcrumb.Item onClick={() => pergiKe(`/main/dashboard/Finishgood`)}>Finish Good</Breadcrumb.Item>
                    <Breadcrumb.Item active>PPIC</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => pergiKe(`/main/dashboard/WIP`)}>WIP</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className=" ms-auto"></div>
            <div>
                <Form.Control
                    type="month"
                    className='text-center border border-primary text-primary'
                    value={month}
                    min="2020-08"
                    onChange={(e) =>onSetDate(e)}
                />
            </div>
        </Stack>

        <Container className='mt-0' fluid>
            <div className='row'>
                <div className='col-xl-9 col-lg-9 mb-2'>
                    <ChartInggredient name={isParentData}/>
                </div>
                <div className='col-xl-3 col-lg-3 mb-2'>
                    <ParetoInggredient name={month} sendToParent={setIsParentData}/>
                </div>
            </div>
            <div className='row'>
                <div className='col-xl-9 col-lg-9 mb-2'>
                    <ChartPackaging name={parentPackaging}/>
                </div>
                <div className='col-xl-3 col-lg-3 mb-2'>
                    <ParetoPackaging name={month} sendToParentPack={setParentPackaging}/>
                </div>
            </div>
            <div className='row'>
                <div className='col-xl-9 col-lg-9 mb-2'>
                    <ChartDaging name={parentDaging}/>
                </div>
                <div className='col-xl-3 col-lg-3 mb-2'>
                    <ParetoDaging name={month} sendToParentDag={setParentDaging}/>
                </div>
            </div>
            <div className='row'>
                <div className='col-xl-9 col-lg-9 mb-2'>
                    <ChartKimia name={parentKimia} />
                </div>
                <div className='col-xl-3 col-lg-3 mb-2'>
                    <ParetoKimia name={month} sendToParentKim={setParentKimia}/>
                </div>
            </div>
        </Container>
    </div>

    {isLoading ? <LoadingPage/> : ""}
    </>
  )
}
