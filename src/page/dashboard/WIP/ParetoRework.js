import React, {useState, useEffect} from 'react';
import '../dashboard.css';
import { Badge, Form, ListGroup, Pagination } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useDashboardStore, { selectDashWip, selectFetchDashWip, selectWipReady } from '../../../store/dataDashboard';

const nBulan = ['JANUARI','FEBRUARI','MARET','APRIL','MEI','JUNI','JULI','AGUSTUS','SEPTEMBER','OKTOBER','NOVEMBER','DESEMBER'];

export const ParetoRework = (props) => {
    const onDashboard = useDashboardStore(selectFetchDashWip);
    const dataDashboard = useDashboardStore(selectDashWip);
    const dashboardReady = useDashboardStore(selectWipReady);

    const [month, setMonth] = useState();
    const [weekS, setweekS] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState([]);

    useEffect(() => { 
        setIsLoading(true);
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        let bb = String(month).padStart(2, '0');
        setMonth(`${year}-${bb}`);
        onDashboard()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!dashboardReady) return;
        onGridReady()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dashboardReady]);

    const onGridReady = (x) =>{
        setIsLoading(false);
        const data = dataDashboard.data;
        const date = new Date();
        const month = date.getMonth();
        const year = date.getFullYear();
        const weekOfMonth = (0 | date.getDate() / 7)+1;
        setweekS(weekOfMonth)
        let listMate = data.filter((d) => d.item !== "");
        listMate = listMate.filter((d) => d.item !== "TOTAL");
        
        try {
            if(year > 2022 && year <2024){
                let filterData = listMate.filter((d)=> {
                    const bul = String(d.bulan).toUpperCase()
                    return(
                        bul === nBulan[month]
                    )
                })
                let nilai = {};
                if(weekS === 1){
                    nilai = filterData.sort(function(a, b) {
                        return b.week1 - a.week1;
                    });
                }
                else if(weekS === 2){
                    nilai = filterData.sort(function(a, b) {
                        return b.week2 - a.week2;
                    });
                }
                else if(weekS === 3){
                    nilai = filterData.sort(function(a, b) {
                        return b.week3 - a.week3;
                    });
                }
                else if(weekS === 4){
                    nilai = filterData.sort(function(a, b) {
                        return b.week4 - a.week4;
                    });
                }
                else{
                    nilai = filterData.sort(function(a, b) {
                        return b.week5 - a.week5;
                    });
                }
                let datas = [];
                for(let x= 0; x < 10; x++){
                    datas.push({bulan: nilai[x].bulan, item: nilai[x].item, satuan: nilai[x].satuan, week1: nilai[x].week1, week2: nilai[x].week2, week3: nilai[x], week4: nilai[x].week4, week5: nilai[x].week5, total: nilai[x].total, avg: nilai[x].avg,})
                }
                setFileName(datas);
            }
            else{
                setFileName([]);
            }
        } catch (error) {
            setFileName([]);
        }
    }
        
    const onSetDate = (event) => {
        setMonth(event.target.value);
        const date = new Date(event.target.value);
        const month = date.getMonth();
        const year = date.getFullYear();
        const data = dataDashboard.data;
        const weekOfMonth = (0 | date.getDate() / 7)+1;
        setweekS(weekOfMonth)
        let listMate = data.filter((d) => d.item !== "");
        listMate = listMate.filter((d) => d.item !== "TOTAL");
        
        try {
            if(year > 2022 && year <2024){
                let filterData = listMate.filter((d)=> {
                    const bul = String(d.bulan).toUpperCase()
                    return(
                        bul === nBulan[month]
                    )
                })
                let nilai = {};
                if(weekS === 1){
                    nilai = filterData.sort(function(a, b) {
                        return b.week1 - a.week1;
                    });
                }
                else if(weekS === 2){
                    nilai = filterData.sort(function(a, b) {
                        return b.week2 - a.week2;
                    });
                }
                else if(weekS === 3){
                    nilai = filterData.sort(function(a, b) {
                        return b.week3 - a.week3;
                    });
                }
                else if(weekS === 4){
                    nilai = filterData.sort(function(a, b) {
                        return b.week4 - a.week4;
                    });
                }
                else{
                    nilai = filterData.sort(function(a, b) {
                        return b.week5 - a.week5;
                    });
                }
                let datas = [];
                for(let x= 0; x < 10; x++){
                    datas.push({bulan: nilai[x].bulan, item: nilai[x].item, satuan: nilai[x].satuan, week1: nilai[x].week1, week2: nilai[x].week2, week3: nilai[x], week4: nilai[x].week4, week5: nilai[x].week5, total: nilai[x].total, avg: nilai[x].avg,})
                }
                setFileName(datas);
            }
            else{
                setFileName([]);
            }
        } catch (error) {
            setFileName([]);
        }
    }

    const changeWeek = (e) =>{
        setweekS(e)
        const date = new Date(month);
        const months = date.getMonth();
        const year = date.getFullYear();
        const data = dataDashboard.data;
        let listMate = data.filter((d) => d.item !== "");
        listMate = listMate.filter((d) => d.item !== "TOTAL");
        
        try {
            if(year > 2022 && year <2024){
                let filterData = listMate.filter((d)=> {
                    const bul = String(d.bulan).toUpperCase()
                    return(
                        bul === nBulan[months]
                    )
                })
                let nilai = {};
                if(e === 1){
                    nilai = filterData.sort(function(a, b) {
                        return b.week1 - a.week1;
                    });
                }
                else if(e === 2){
                    nilai = filterData.sort(function(a, b) {
                        return b.week2 - a.week2;
                    });
                }
                else if(e === 3){
                    nilai = filterData.sort(function(a, b) {
                        return b.week3 - a.week3;
                    });
                }
                else if(e === 4){
                    nilai = filterData.sort(function(a, b) {
                        return b.week4 - a.week4;
                    });
                }
                else{
                    nilai = filterData.sort(function(a, b) {
                        return b.week5 - a.week5;
                    });
                }
                let datas = [];
                for(let x= 0; x < 10; x++){
                    datas.push({bulan: nilai[x].bulan, item: nilai[x].item, satuan: nilai[x].satuan, week1: nilai[x].week1, week2: nilai[x].week2, week3: nilai[x].week3, week4: nilai[x].week4, week5: nilai[x].week5, total: nilai[x].total, avg: nilai[x].avg,})
                }
                setFileName(datas);
            }
            else{
                setFileName([]);
            }
        } catch (error) {
            setFileName([]);
        }
    }
  return (
    <>
        <h6 className=''>Top 10 Weakly Rework</h6>
        <div class="d-flex align-items-center justify-content-between mb-2">
            
            <Form.Control
                type="month"
                className='text-center border border-primary text-primary'
                value={month}
                min="2020-08"
                onChange={(e) =>onSetDate(e)}
            />

        </div>
        <div className='row'>
            <div className='col-xl-12 col-lg-12 mb-0'>
                <Pagination size="sm">
                {[1,2,3,4,5].map((e, i) =>{
                    let activate = false
                    if(e === weekS){activate = true}
                    return(
                        <Pagination.Item active={activate} onClick={(x) => changeWeek(e)}>{e}</Pagination.Item>
                    )
                })}
                </Pagination>
            </div>
        </div>
        <div>
            <ListGroup className='h-75' numbered>
                {fileName.map((e) =>{
                    let nilai = 0;
                    if(weekS === 1){nilai = e.week1}
                    else if(weekS === 2){nilai = e.week2}
                    else if(weekS === 3){nilai = e.week3}
                    else if(weekS === 4){nilai = e.week4}
                    else{nilai = e.week5}
                    return(
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start cekOut"
                            onClick={() => {props.sendToParent(e.item)}}
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">{e.item}</div>
                            <NumericFormat value={nilai} displayType={'text'} thousandSeparator={true} prefix={''} />
                            &nbsp;{e.satuan}
                            </div>
                            <Badge bg="light" text="success">
                            <i class="bi bi-caret-up-fill"></i>
                            </Badge>
                        </ListGroup.Item>
                    )}
                )}
            </ListGroup>
        </div>
        {isLoading ? <LoadingPage/> : ""}
    </>
  )
}
