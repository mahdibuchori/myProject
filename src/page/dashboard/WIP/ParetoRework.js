import React, {useState, useEffect} from 'react';
import '../dashboard.css';
import { Badge, Form, ListGroup } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useDashboardStore, { selectDashWip, selectFetchDashWip, selectWipReady } from '../../../store/dataDashboard';

const nBulan = ['JANUARI','FEBRUARI','MARET','APRIL','MEI','JUNI','JULI','AGUSTUS','SEPTEMBER','OKTOBER','NOVEMBER','DESEMBER'];

export const ParetoRework = (props) => {
    const onDashboard = useDashboardStore(selectFetchDashWip);
    const dataDashboard = useDashboardStore(selectDashWip);
    const dashboardReady = useDashboardStore(selectWipReady);

    const [month, setMonth] = useState();
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
                let nilai = filterData.sort(function(a, b) {
                    return b.total - a.total;
                });
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
                let nilai = filterData.sort(function(a, b) {
                    return b.total - a.total;
                });
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
  return (
    <>
        <h6 className=''>Top 10 Monthly Purchashing</h6>
        <div class="d-flex align-items-center justify-content-between mb-2">
            
            <Form.Control
                type="month"
                className='text-center border border-primary text-primary'
                value={month}
                min="2020-08"
                onChange={(e) =>onSetDate(e)}
            />

        </div>
        <div>
            <ListGroup className='h-75' numbered>
                {fileName.map((e) =>{
                    return(
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start cekOut"
                            onClick={() => {props.sendToParent(e.item)}}
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">{e.item}</div>
                            <NumericFormat value={e.total} displayType={'text'} thousandSeparator={true} prefix={''} />
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
