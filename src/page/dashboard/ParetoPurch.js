import React, {useState, useEffect} from 'react';
import './dashboard.css';
import { Badge, Form, ListGroup } from 'react-bootstrap';

import { LoadingPage } from '../../LoadingPage/LoadingPage';
import useDashboardStore, {selectYdash, selectFetchYdash, selectYdashReady } from '../../store/dataDashboard';

export const ParetoPurch = () => {
    const onDashboard = useDashboardStore(selectFetchYdash);
    const dataDashboard = useDashboardStore(selectYdash);
    const dashboardReady = useDashboardStore(selectYdashReady);

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
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        let bb = String(month).padStart(2, '0');
        const data = dataDashboard.data;
        const postIds = data.map((post) => {
            let file = {};
            if(parseInt(bb) === 1){
                file = post.januari
            }
            else if(parseInt(bb) === 2){
                file = post.februari
            }
            else if(parseInt(bb) === 3){
                file = post.maret
            }
            else if(parseInt(bb) === 4){
                file = post.april
            }
            else if(parseInt(bb) === 5){
                file = post.mei
            }
            else if(parseInt(bb) === 6){
                file = post.juni
            }
            else if(parseInt(bb) === 7){
                file = post.juli
            }
            else if(parseInt(bb) === 8){
                file = post.agustus
            }
            else if(parseInt(bb) === 9){
                file = post.september
            }
            else if(parseInt(bb) === 10){
                file = post.oktober
            }
            else if(parseInt(bb) === 11){
                file = post.november
            }
            else{
                file = post.desember
            }
            return(
                {item: post.item, th23 : file.th23, th22 : file.th22, th21 : file.th21, qth23 : parseInt(file.qth23), qth22 : parseInt(file.qth22), qth21 : parseInt(file.qth21)}
            )
        });

        let nilai = {}
        if(year === 2023){
            nilai = postIds.sort(function(a, b) {
                return b.qth23 - a.qth23;
            });
        }
        else if(year === 2022){
            nilai = postIds.sort(function(a, b) {
                return b.qth22 - a.qth22;
            });
        }
        else{
            nilai = postIds.sort(function(a, b) {
                return b.qth21 - a.qth21;
            });
        }
        
        let datas = [];
        for(let x= 0; x < 10; x++){
            if(year === 2023){
                datas.push({item: nilai[x].item, harga : nilai[x].th23 , qty : nilai[x].qth23})
            }
            else if(year === 2022){
                datas.push({item: nilai[x].item, harga : nilai[x].th22 , qty : nilai[x].qth22})
            }
            else{
                datas.push({item: nilai[x].item, harga : nilai[x].th21 , qty : nilai[x].qth21})
            }
            
        }

        setFileName(datas);
        
    }

    const onSetDate =async (event) => {
        setMonth(event.target.value);
        const date = new Date(event.target.value);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        let bb = String(month).padStart(2, '0');
        const data = dataDashboard.data;
        const postIds = data.map((post) => {
            let file = {};
            if(parseInt(bb) === 1){
                file = post.januari
            }
            else if(parseInt(bb) === 2){
                file = post.februari
            }
            else if(parseInt(bb) === 3){
                file = post.maret
            }
            else if(parseInt(bb) === 4){
                file = post.april
            }
            else if(parseInt(bb) === 5){
                file = post.mei
            }
            else if(parseInt(bb) === 6){
                file = post.juni
            }
            else if(parseInt(bb) === 7){
                file = post.juli
            }
            else if(parseInt(bb) === 8){
                file = post.agustus
            }
            else if(parseInt(bb) === 9){
                file = post.september
            }
            else if(parseInt(bb) === 10){
                file = post.oktober
            }
            else if(parseInt(bb) === 11){
                file = post.november
            }
            else{
                file = post.desember
            }
            return(
                {item: post.item, th23 : file.th23, th22 : file.th22, th21 : file.th21, qth23 : parseInt(file.qth23), qth22 : parseInt(file.qth22), qth21 : (parseInt(file.qth21))}
            )
        });

        let nilai = {}
        if(year === 2023){
            nilai = postIds.sort(function(a, b) {
                return b.qth23 - a.qth23;
            });
        }
        else if(year === 2022){
            nilai = postIds.sort(function(a, b) {
                return b.qth22 - a.qth22;
            });
        }
        else{
            nilai = postIds.sort(function(a, b) {
                return b.qth21 - a.qth21;
            });
        }
        
        let datas = [];
        for(let x= 0; x < 10; x++){
            if(year === 2023){
                datas.push({item: nilai[x].item, harga : nilai[x].th23 , qty : nilai[x].qth23})
            }
            else if(year === 2022){
                datas.push({item: nilai[x].item, harga : nilai[x].th22 , qty : nilai[x].qth22})
            }
            else{
                datas.push({item: nilai[x].item, harga : nilai[x].th21 , qty : nilai[x].qth21})
            }
            
        }

        setFileName(datas);
        
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

            {fileName.map((e, i) =>{
                    return(
                        <ListGroup as="ol">
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div className="ms-2 me-auto">
                                <div className="fw-bold">{i + 1}. {e.item}</div>
                                Qty : {e.qty}
                                </div>
                                <Badge bg="light" text="success">
                                <i class="bi bi-caret-up-fill"></i>
                                </Badge>
                            </ListGroup.Item>
                        </ListGroup>
                    )
                }
                )}
            
        </div>
        {isLoading ? <LoadingPage/> : ""}
    </>
  )
}
