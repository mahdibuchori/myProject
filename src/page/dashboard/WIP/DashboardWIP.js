import React from 'react';
import '../dashboard.css';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Stack } from 'react-bootstrap';

export const DashboardWIP = () => {
    const navigate = useNavigate();

    const pergiKe = (e) =>{
        navigate(e);
    }
  return (
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
    </div>
  )
}
