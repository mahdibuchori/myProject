import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PurchLine } from './PurchLine';
import { PurchBatang } from './PurchBatang';
import './dashboard.css';
// import { Breadcrumb, Container, Form, Stack } from 'react-bootstrap';
import { Container, Form } from 'react-bootstrap';
import { LoadingPage } from '../../LoadingPage/LoadingPage';
import useAuthStore, { selectUser } from '../../store/authLogin';
import usePengadaanStore, {selectPengadaan, selectFetchPengadaan, selectPengadaanReady, selectFalsePengadaan} from '../../store/pengadaanBarang';

export const DashboardPP = () => {
    const navigate = useNavigate();
    const userData = useAuthStore(selectUser);

    const newPengadaan = usePengadaanStore(selectPengadaan);
    const fetchPengadaan = usePengadaanStore(selectFetchPengadaan);
    const pengadaanReady = usePengadaanStore(selectPengadaanReady);
    const pengadaanFalse = usePengadaanStore(selectFalsePengadaan);

    const [month, setMonth] = useState();
    const [jmlPengajuan, setJmlPengajuan] = useState(0);
    const [jmlRevisi, setJmlRevisi] = useState(0);
    const [jmlVerify, setJmlVerify] = useState(0);
    const [jmlSelesai, setJmlSelesai] = useState(0);
    
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { 
        setIsLoading(true);
        pengadaanFalse();
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        let bb = String(month).padStart(2, '0');
        setMonth(`${year}-${bb}`);
        fetchPengadaan(`${year}-${bb}`, userData.user_plan);
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // setIsLoading(true);
        if (!pengadaanReady) return;
        onDataReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pengadaanReady]);

    const onDataReady = () =>{
        setIsLoading(false)
        console.log(newPengadaan)
        const jumPengajuan = newPengadaan.filter(x => x.status.toUpperCase() === "PENGAJUAN");  
        const jumRevisi = newPengadaan.filter(x => x.status.toUpperCase() === "REVISI");       
        const jumVerify = newPengadaan.filter(x => x.status.toUpperCase() === "VERIFIKASI");    
        const jumSelesai = newPengadaan.filter(x => x.status.toUpperCase() === "SELESAI");

        setJmlPengajuan(jumPengajuan.length);
        setJmlRevisi(jumRevisi.length);
        setJmlVerify(jumVerify.length);
        setJmlSelesai(jumSelesai.length);
    }

    const onSetDate =async (event) => {
        setIsLoading(true)
        pengadaanFalse();
        setMonth(event.target.value);
        await fetchPengadaan(event.target.value, userData.user_plan);
    }

    const pergiKe = (e) =>{
        navigate(e);
    }


  return (
    <>
    <div className='dashboard'>
        {/* <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
            <div>
                <Breadcrumb className="m-2">
                    <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className=" ms-auto"></div>
            <div>
                
            </div>
        </Stack> */}

        <Container className='mt-2' fluid>
            <div className='row'>
                <div className='col-xl-4 col-lg-4 mb-2'>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h6 className=''>Pengadan Barang</h6>
                        <Form.Control
                            type="month"
                            className='text-center border border-primary text-primary'
                            value={month}
                            min="2020-08"
                            onChange={(e) =>onSetDate(e)}
                        />

                    </div>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <div className='widget-flat card-h-50 card'>
                                <div className='card-body'>
                                    <div className='float-end text-danger'>
                                        <i class="bi bi-arrow-right-square"></i>
                                    </div>
                                    <h6 className='fw-normal mt-0 text-muted'>Pengajuan </h6>
                                    <h3 className='mt-3 mb-3 float-end'>{jmlPengajuan}</h3>
                                </div>
                            </div>
                        </div>

                        <div className='col-sm-6'>
                            <div className='widget-flat card'>
                                <div className='card-body'>
                                    <div className='float-end text-warning'>
                                        <i className="bi bi-recycle"></i>
                                    </div>
                                    <h6 className='fw-normal mt-0 text-muted'>Revisi</h6>
                                    <h3 className='mt-3 mb-3 float-end'>{jmlRevisi}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row mt-2'>
                        <div className='col-sm-6'>
                            <div className='widget-flat card'>
                                <div className='card-body'>
                                    <div className='float-end text-primary'>
                                        <i className="bi bi-check2-circle"></i>
                                    </div>
                                    <h6 className='fw-normal mt-0 text-muted'>Verifikasi</h6>
                                    <h3 className='mt-3 mb-3 float-end'>{jmlVerify}</h3>
                                </div>
                            </div>
                        </div>
                        
                        <div className='col-sm-6'>
                            <div className='widget-flat card'>
                                <div className='card-body'>
                                    <div className='float-end text-success'>
                                        <i className="bi bi-truck"></i>
                                    </div>
                                    <h6 className='fw-normal mt-0 text-muted'>Selesai</h6>
                                    <h3 className='mt-3 mb-3 float-end'>{jmlSelesai}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h6 
                        className='mt-3 mb-3 float-end text-primary mylinkBo' 
                        style={{borderBottom : '2px solid #287bff'}} 
                        onClick={() =>pergiKe(`/main/${userData.user_divisi}/Pengadaan`)}>
                        pergi ke pengadaan
                        <i className="bi bi-arrow-right-short"></i>
                    </h6>
                    
                    
                </div>
                
                <div className='col-xl-8 col-lg-8'>
                    <PurchBatang/>
                </div>
            </div>
            <div className='row mt-2'>
                <div className='col-xl-8 col-lg-8 mb-2'>
                    <PurchLine/>
                </div>
                <div className='col-xl-6 col-lg-6 mb-2'>
                
                </div>
                
            </div>
            
        </Container>

    </div>

    {isLoading ? <LoadingPage/> : ""}
    </>
  )
}
