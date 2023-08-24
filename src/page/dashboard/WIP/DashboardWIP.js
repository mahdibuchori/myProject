import React, { useState, useEffect } from 'react';
import '../dashboard.css';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Container, Stack } from 'react-bootstrap';

import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../../store/authLogin';
import useDashboardStore, { selectDashWip, selectFetchDashWip,selectWipReady } from '../../../store/dataDashboard';
import { ChartRework } from './ChartRework';
import { ParetoRework } from './ParetoRework';

export const DashboardWIP = () => {
    const navigate = useNavigate();
    const userData = useAuthStore(selectUser);

    const onDashboard = useDashboardStore(selectFetchDashWip);
    const dataDashboard = useDashboardStore(selectDashWip);
    const dashboardReady = useDashboardStore(selectWipReady);

    const [isParentData, setIsParentData] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { 
        setIsLoading(true);
        onDashboard()
        console.log(userData.user_name)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!dashboardReady) return;
        onGridReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dashboardReady]);


    const onGridReady = () =>{
        setIsLoading(false); 
        console.log(dataDashboard)
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
                            <Breadcrumb.Item onClick={() => pergiKe(`/main/dashboard/PPIC`)}>PPIC</Breadcrumb.Item>
                            <Breadcrumb.Item active>WIP</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className=" ms-auto"></div>
                    <div>
                        
                    </div>
                </Stack>

                <Container className='mt-0' fluid>
                    <div className='row'>
                        <div className='col-xl-9 col-lg-9 mb-2'>
                            <ChartRework name={isParentData}/>
                        </div>
                        <div className='col-xl-3 col-lg-3 mb-2'>
                            <ParetoRework sendToParent={setIsParentData}/>
                        </div>
                    </div>
                </Container>
            </div>

            {isLoading ? <LoadingPage/> : ""}
        </>
    )
}
