import React, {useState, useEffect} from 'react';
import '../dashboard.css';
import { Badge, ListGroup } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useDashboardStore, { selectDashPpic, selectFetchDashPpic, selectPpicReady } from '../../../store/dataDashboard';
const buls = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli','Agustus','September','Oktober','November','Desember'];


export const ParetoPackaging = (props) => {
    const onDashboard = useDashboardStore(selectFetchDashPpic);
    const dataDashboard = useDashboardStore(selectDashPpic);
    const dashboardReady = useDashboardStore(selectPpicReady);

    const [fileName, setFileName] = useState([]);
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
    }, [props.name]);

    const onGridReady = () =>{
        setIsLoading(false);
        const date = new Date();
        const month = date.getMonth();
        const year = date.getFullYear();

        const dataPackaging = dataDashboard.packaging;

        if(year > 2022 && year <2024){
            const data = dataPackaging.filter(x => x.bulan === buls[month]);
            const postIds = data.map((e) => {
                const ttl = parseFloat(e.total).toFixed(2);
                const newTotal = (parseFloat(ttl) * 1000 ) / 1000;
                return(
                    {item: e.item, bulan: e.bulan, week1: e.week1, week2: e.week2, week3: e.week3, week4: e.week4, week5: e.week5, total : newTotal, avg : e.avg }
                )
            })
            const nilai = postIds.sort(function(a, b) {
                return b.total - a.total;
            });

            
            if(nilai.length > 0){
                let datas = [];
                let jm = 0;
                if(nilai.length <=10){jm = nilai.length} else {jm = 10};
                for(let x= 0; x < jm; x++){
                    const e = nilai[x]
                    datas.push({item: e.item, bulan: e.bulan, total : e.total , avg : e.avg })
                }
                setFileName(datas);
            }
            else{
                setFileName([])
            }
        }
    }

    const performRefresh = () =>{
        if(props.name === ""){
            console.log(props.name)
        }
        else{
            try {
                const date = new Date(props.name);
                const bln = date.getMonth();
                const year = date.getFullYear();

                const dataPackaging = dataDashboard.packaging;
        
                if(year > 2022 && year <2024){
                    const data = dataPackaging.filter(x => x.bulan === buls[bln]);
                    const postIds = data.map((e) => {
                        const ttl = parseFloat(e.total).toFixed(2);
                        const newTotal = (parseFloat(ttl) * 1000 ) / 1000;
                        return(
                            {item: e.item, bulan: e.bulan, week1: e.week1, week2: e.week2, week3: e.week3, week4: e.week4, week5: e.week5, total : newTotal, avg : e.avg }
                        )
                    })
                    const nilai = postIds.sort(function(a, b) {
                        return b.total - a.total;
                    });
        
                    if(nilai.length > 0){
                        let datas = [];
                        let jm = 0;
                        if(nilai.length <=10){jm = nilai.length} else {jm = 10};
                        for(let x= 0; x < jm; x++){
                            const e = nilai[x]
                            datas.push({item: e.item, bulan: e.bulan, total : e.total , avg : e.avg })
                        }
                        setFileName(datas);
                    }
                    else{
                        setFileName([])
                    }
                    
                }
                else{
                    setFileName([])
                }
            } catch (error) {
                
            }
        }
    }
    return (
        <>
            <h6 className=''>Top 10 Monthly Packaging</h6>
            <div>
                <ListGroup numbered>
                    {fileName.map((e, i) =>{
                        return(
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start cekOut"
                                onClick={() => {props.sendToParentPack(e.item)}}
                            >
                                <div className="ms-2 me-auto">
                                <div className="fw-bold">{e.item}</div>
                                <NumericFormat value={e.total} displayType={'text'} thousandSeparator={true} />
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
