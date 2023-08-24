import React, {useState, useEffect} from 'react';
import '../dashboard.css';
import { Badge, Form, ListGroup, Pagination } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useDashboardStore, {selectDashFg,selectfetchDashFg,selectFgReady} from '../../../store/dataDashboard';

export const ParetoFg = (props) => {
    const onDashboard = useDashboardStore(selectfetchDashFg);
    const dataDashboard = useDashboardStore(selectDashFg);
    const dashboardReady = useDashboardStore(selectFgReady);

    const [month, setMonth] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [penjualan, setPenjualan] = useState(true);
    const [pinBar, setPinBar] = useState(false);
    const [fileName, setFileName] = useState([]);
    const [keys, setkeys] = useState('penjualan');

    const bulan = ['JANUARI','FEBRUARI','MARET','APRIL','MEI','JUNI','JULI','AGUSTUS','SEPTEMBER','OKTOBER','NOVEMBER','DESEMBER'];

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
        setPenjualan(true);
        setPinBar(false);
        const date = new Date();
        const month = date.getMonth();
        const year = date.getFullYear();
        const data = dataDashboard.data;
        if(year === 2023){
            let listData =  data.filter((d) => d.bulan === bulan[month]);
            const postIds = listData.map((e) => {
                const tPnejualan = e.week1S + e.week2S + e.week3S + e.week4S + e.week5S;
                const tPindah = e.week1IT + e.week2IT + e.week3IT + e.week4IT + e.week5IT;
                return(
                    {item: e.item, penjualan : tPnejualan, pindah : tPindah}
                )
            });

            let nilai = postIds.sort(function(a, b) {
                return b.penjualan - a.penjualan;
            });
            let datas = [];

            if(nilai.length > 0){
                for(let x= 0; x < 10; x++){
                    datas.push({item : nilai[x].item, penjualan : nilai[x].penjualan , pindah : nilai[x].pindah}) 
                }
                console.log(datas)
                setFileName(datas)
            }
            else{
                setFileName([])
            }
        }
        else{
            setFileName()
        }
        
    }
    
    const onSetDate = (event) => {
        setFileName([])
        setMonth(event.target.value);
        setIsLoading(false);
        setPenjualan(true);
        setPinBar(false);
        setkeys('penjualan');
        const date = new Date(event.target.value);
        const month = date.getMonth();
        const year = date.getFullYear();
        const data = dataDashboard.data;
        if(year === 2023){
            let listData =  data.filter((d) => d.bulan === bulan[month]);
            const postIds = listData.map((e) => {
                const tPnejualan = e.week1S + e.week2S + e.week3S + e.week4S + e.week5S;
                const tPindah = e.week1IT + e.week2IT + e.week3IT + e.week4IT + e.week5IT;
                return(
                    {item: e.item, penjualan : tPnejualan, pindah : tPindah}
                )
            });

            let nilai = postIds.sort(function(a, b) {
                return b.penjualan - a.penjualan;
            });
            
            let datas = [];
            for(let x= 0; x < 10; x++){
                datas.push({item : nilai[x].item, penjualan : nilai[x].penjualan , pindah : nilai[x].pindah}) 
            }
            setFileName(datas);
        }
        else{
            setFileName([])
        }
        
    }

    const changeData = (e) =>{
        const date = new Date(month);
        const bb = date.getMonth();
        const year = date.getFullYear();
        const data = dataDashboard.data;
        if(year === 2023){
            let listData =  data.filter((d) => d.bulan === bulan[bb]);
            const postIds = listData.map((e) => {
                const tPnejualan = e.week1S + e.week2S + e.week3S + e.week4S + e.week5S;
                const tPindah = e.week1IT + e.week2IT + e.week3IT + e.week4IT + e.week5IT;
                return(
                    {item: e.item, penjualan : tPnejualan, pindah : tPindah}
                )
            });

            let nilai = {}
            if(e === "penjualan"){
                nilai = postIds.sort(function(a, b) {
                    return b.penjualan - a.penjualan;
                });
            }
            else{
                nilai = postIds.sort(function(a, b) {
                    return b.pindah - a.pindah;
                });
            }

            let datas = [];

            if(nilai.length > 0){
                for(let x= 0; x < 10; x++){
                    datas.push({item : nilai[x].item, penjualan : nilai[x].penjualan , pindah : nilai[x].pindah}) 
                }
                setFileName(datas)
            }
            else{
                setFileName([])
            }
        }
        else{
            setFileName()
        }
    }

  return (
    <>
        <h6 className=''>Top 10 Monthly FG</h6>
        <div class="d-flex align-items-center justify-content-between mb-2">
            
            <Form.Control
                type="month"
                className='text-center border border-primary text-primary'
                value={month}
                min="2020-08"
                onChange={(e) =>onSetDate(e)}
            />

        </div>

        <Pagination size="sm">
            <Pagination.Item 
                active={penjualan}
                onClick={(e)=>{
                    setPenjualan(true);
                    setPinBar(false);
                    setkeys('penjualan');
                    changeData('penjualan');
                }}
            >
                Penjualan
            </Pagination.Item>
            <Pagination.Item 
                active={pinBar}
                onClick={(e)=>{
                    setPenjualan(false);
                    setPinBar(true);
                    setkeys('pindah');
                    changeData('pindah');
                }}
            >
                Pindah Barang
            </Pagination.Item>
            
        </Pagination>

        <div>
            <ListGroup className='h-75 mb-5' numbered>
                {fileName.map((e, i) =>{
                    let nilai = 0;
                    if(keys === 'penjualan'){
                        nilai = e.penjualan;
                    }
                    else{
                        nilai = e.pindah;
                    }
                    console.log(keys)
                    return(
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start cekOut"
                            onClick={() => {props.sendToParent(e.item)}}
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">{e.item}</div>
                            <NumericFormat value={nilai} displayType={'text'} thousandSeparator={true} />
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
