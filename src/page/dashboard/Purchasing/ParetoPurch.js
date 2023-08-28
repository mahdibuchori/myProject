import React, {useState, useEffect} from 'react';
import '../dashboard.css';
import { Badge, Button, ButtonGroup, Dropdown, Form, ListGroup, Pagination } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useDashboardStore, {selectYdash, selectFetchYdash, selectYdashReady } from '../../../store/dataDashboard';

export const ParetoPurch = (props) => {
    const onDashboard = useDashboardStore(selectFetchYdash);
    const dataDashboard = useDashboardStore(selectYdash);
    const dashboardReady = useDashboardStore(selectYdashReady);

    const [month, setMonth] = useState();
    const [isTipe, setIsTipe] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pagiJum, setPagiJum] = useState(true);
    const [pagiHarga, setPagiHarga] = useState(false);
    const [pagiQty, setPagiQty] = useState(false);
    const [fileName, setFileName] = useState([]);
    const [kurs, setKurs] = useState('Rp. ');
    const [keys, setkeys] = useState('jumlah');

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
        setPagiHarga(false);
        setPagiJum(true);
        setPagiQty(false);
        setKurs('Rp. ');
        setkeys('jumlah');
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
            let {n23, n22, n21, q23, q22, q21} = 0;
            if(file.th23 === ""){n23 = 0}else{n23 = parseInt(file.th23)}
            if(file.th22 === ""){n22 = 0}else{n22 = parseInt(file.th22)}
            if(file.th21 === ""){n21 = 0}else{n21 = parseInt(file.th21)}

            if(file.qth23 === ""){q23 = 0}else{q23 = parseInt(file.qth23)}
            if(file.qth22 === ""){q22 = 0}else{q22 = parseInt(file.qth22)}
            if(file.qth21 === ""){q21 = 0}else{q21 = parseInt(file.qth21)}

            const total23 = n23 * q23;
            const total22 = n22 * q22;
            const total21 = n21 * q21;
            return(
                { item: post.item, th23 : n23, th22 : n22, th21 : n21, qth23 : q23, qth22 : q22, qth21 : q21, total21 : total21, total22 : total22, total23 : total23, satuan : post.satuan, tipe : post.tipe }
            )
        });
        let nilai = {}
        if(year === 2023){
            nilai = postIds.sort(function(a, b) {
                return b.total23 - a.total23;
            });
        }
        else if(year === 2022){
            nilai = postIds.sort(function(a, b) {
                return b.total22 - a.total22;
            });
        }
        else{
            nilai = postIds.sort(function(a, b) {
                return b.total21 - a.total21;
            });
        }
        let datas = [];
        for(let x= 0; x < 10; x++){
            if(year === 2023){
                datas.push({ item: nilai[x].item, harga : nilai[x].th23 , qty : nilai[x].qth23, total : nilai[x].total23, satuan : nilai[x].satuan, tipe : nilai[x].tipe })
            }
            else if(year === 2022){
                datas.push({ item: nilai[x].item, harga : nilai[x].th22 , qty : nilai[x].qth22, total : nilai[x].total22, satuan : nilai[x].satuan, tipe : nilai[x].tipe })
            }
            else{
                datas.push({item: nilai[x].item, harga : nilai[x].th21 , qty : nilai[x].qth21, total : nilai[x].total21, satuan : nilai[x].satuan, tipe : nilai[x].tipe })
            }
            
        }
        setFileName(datas);
    }

    const onSetDate = (event) => {
        setMonth(event.target.value);
        setPagiHarga(false);
        setPagiJum(true);
        setPagiQty(false);
        setKurs('Rp. ');
        setkeys('jumlah');
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
            let {n23, n22, n21, q23, q22, q21} = 0;
            if(file.th23 === ""){n23 = 0}else{n23 = parseInt(file.th23)}
            if(file.th22 === ""){n22 = 0}else{n22 = parseInt(file.th22)}
            if(file.th21 === ""){n21 = 0}else{n21 = parseInt(file.th21)}

            if(file.qth23 === ""){q23 = 0}else{q23 = parseInt(file.qth23)}
            if(file.qth22 === ""){q22 = 0}else{q22 = parseInt(file.qth22)}
            if(file.qth21 === ""){q21 = 0}else{q21 = parseInt(file.qth21)}

            const total23 = n23 * q23;
            const total22 = n22 * q22;
            const total21 = n21 * q21;
            return(
                { item: post.item, th23 : n23, th22 : n22, th21 : n21, qth23 : q23, qth22 : q22, qth21 : q21, total21 : total21, total22 : total22, total23 : total23, satuan : post.satuan, tipe : post.tipe }
            )
        });

        let nilai = {}
        if(year === 2023){
            nilai = postIds.sort(function(a, b) {
                return b.total23 - a.total23;
            });
        }
        else if(year === 2022){
            nilai = postIds.sort(function(a, b) {
                return b.total22 - a.total22;
            });
        }
        else{
            nilai = postIds.sort(function(a, b) {
                return b.total21 - a.total21;
            });
        }
        
        let datas = [];
        for(let x= 0; x < 10; x++){
            if(year === 2023){
                datas.push({ item: nilai[x].item, harga : nilai[x].th23 , qty : nilai[x].qth23, total : nilai[x].total23, satuan : nilai[x].satuan, tipe : nilai[x].tipe })
            }
            else if(year === 2022){
                datas.push({ item: nilai[x].item, harga : nilai[x].th22 , qty : nilai[x].qth22, total : nilai[x].total22, satuan : nilai[x].satuan, tipe : nilai[x].tipe })
            }
            else{
                datas.push({item: nilai[x].item, harga : nilai[x].th21 , qty : nilai[x].qth21, total : nilai[x].total21, satuan : nilai[x].satuan, tipe : nilai[x].tipe })
            }
            
        }

        setFileName(datas);
        
    }

    const changeData = (e) =>{
        const date = new Date(month);
        const months = date.getMonth() + 1;
        const year = date.getFullYear();
        let bb = String(months).padStart(2, '0');
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
                file = post.januari
            }
            else if(parseInt(bb) === 1){
                file = post.november
            }
            else{
                file = post.desember
            }
            let {n23, n22, n21, q23, q22, q21} = 0;
            if(file.th23 === ""){n23 = 0}else{n23 = parseInt(file.th23)}
            if(file.th22 === ""){n22 = 0}else{n22 = parseInt(file.th22)}
            if(file.th21 === ""){n21 = 0}else{n21 = parseInt(file.th21)}

            if(file.qth23 === ""){q23 = 0}else{q23 = parseInt(file.qth23)}
            if(file.qth22 === ""){q22 = 0}else{q22 = parseInt(file.qth22)}
            if(file.qth21 === ""){q21 = 0}else{q21 = parseInt(file.qth21)}

            const total23 = n23 * q23;
            const total22 = n22 * q22;
            const total21 = n21 * q21;
            return(
                {item: post.item, th23 : n23, th22 : n22, th21 : n21, qth23 : q23, qth22 : q22, qth21 : q21, total21 : total21, total22 : total22, total23 : total23, satuan : post.satuan, tipe : post.tipe }
            )
        });
        
        let listData = {};
        if(e === ""){
            listData = postIds
        }
        else{
            if(isTipe === ""){listData = postIds}
            else{listData = postIds.filter((d) => d.tipe === isTipe)}
        }
        
        let nilai = {}
        if(year === 2023){
            if(e === "jumlah"){
                nilai = listData.sort(function(a, b) {
                    return b.total23 - a.total23;
                });
                setKurs('Rp. ')
            }
            else if(e === "harga"){
                nilai = listData.sort(function(a, b) {
                    return b.th23 - a.th23;
                });
                setKurs('Rp. ')
            }
            else{
                nilai = listData.sort(function(a, b) {
                    return b.qth23 - a.qth23;
                });
                setKurs('')
            }
        }
        else if(year === 2022){
            if(e === "jumlah"){
                nilai = listData.sort(function(a, b) {
                    return b.total22 - a.total22;
                });
                setKurs('Rp. ')
            }
            else if(e === "harga"){
                nilai = listData.sort(function(a, b) {
                    return b.th22 - a.th22;
                });
                setKurs('Rp. ')
            }
            else{
                nilai = listData.sort(function(a, b) {
                    return b.qth22 - a.qth22;
                });
                setKurs('')
            }
        }
        else{
            if(e === "jumlah"){
                nilai = listData.sort(function(a, b) {
                    return b.total21 - a.total21;
                });
                setKurs('Rp. ')
            }
            else if(e === "harga"){
                nilai = listData.sort(function(a, b) {
                    return b.th21 - a.th21;
                });
                setKurs('Rp. ')
            }
            else{
                nilai = listData.sort(function(a, b) {
                    return b.qth21 - a.qth21;
                });
                setKurs('')
            }
        }
        let datas = [];
        let jm = 0;
        if(nilai.length <=10){jm = nilai.length} else {jm = 10};
        for(let x= 0; x < jm; x++){
            if(year === 2023){
                datas.push({ item: nilai[x].item, harga : nilai[x].th23 , qty : nilai[x].qth23, total : nilai[x].total23, satuan : nilai[x].satuan, tipe : nilai[x].tipe })
            }
            else if(year === 2022){
                datas.push({ item: nilai[x].item, harga : nilai[x].th22 , qty : nilai[x].qth22, total : nilai[x].total22, satuan : nilai[x].satuan, tipe : nilai[x].tipe })
            }
            else{
                datas.push({item: nilai[x].item, harga : nilai[x].th21 , qty : nilai[x].qth21, total : nilai[x].total21, satuan : nilai[x].satuan, tipe : nilai[x].tipe })
            }
            
        }
        
        setFileName(datas);

    }

    const tipeData = (e) =>{
        setIsTipe(e);
        setKurs('Rp. ');
        setkeys('jumlah');
        setPagiHarga(false);
        setPagiJum(true);
        setPagiQty(false);
        const date = new Date(month);
        const months = date.getMonth() + 1;
        const year = date.getFullYear();
        let bb = String(months).padStart(2, '0');
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
                file = post.januari
            }
            else if(parseInt(bb) === 1){
                file = post.november
            }
            else{
                file = post.desember
            }
            let {n23, n22, n21, q23, q22, q21} = 0;
            if(file.th23 === ""){n23 = 0}else{n23 = parseInt(file.th23)}
            if(file.th22 === ""){n22 = 0}else{n22 = parseInt(file.th22)}
            if(file.th21 === ""){n21 = 0}else{n21 = parseInt(file.th21)}

            if(file.qth23 === ""){q23 = 0}else{q23 = parseInt(file.qth23)}
            if(file.qth22 === ""){q22 = 0}else{q22 = parseInt(file.qth22)}
            if(file.qth21 === ""){q21 = 0}else{q21 = parseInt(file.qth21)}

            const total23 = n23 * q23;
            const total22 = n22 * q22;
            const total21 = n21 * q21;
            return(
                {item: post.item, th23 : n23, th22 : n22, th21 : n21, qth23 : q23, qth22 : q22, qth21 : q21, total21 : total21, total22 : total22, total23 : total23, satuan : post.satuan, tipe : post.tipe }
            )
        });

        let listData = {};
        if(e === ""){
            listData = postIds
        }
        else{
            listData = postIds.filter((d) => d.tipe === e);
        }

        let nilai = {}
        if(year === 2023){
            if(e === "jumlah"){
                nilai = listData.sort(function(a, b) {
                    return b.total23 - a.total23;
                });
                setKurs('Rp. ')
            }
            else if(e === "harga"){
                nilai = listData.sort(function(a, b) {
                    return b.th23 - a.th23;
                });
                setKurs('Rp. ')
            }
            else{
                nilai = listData.sort(function(a, b) {
                    return b.qth23 - a.qth23;
                });
                setKurs('')
            }
        }
        else if(year === 2022){
            if(e === "jumlah"){
                nilai = listData.sort(function(a, b) {
                    return b.total22 - a.total22;
                });
                setKurs('Rp. ')
            }
            else if(e === "harga"){
                nilai = listData.sort(function(a, b) {
                    return b.th22 - a.th22;
                });
                setKurs('Rp. ')
            }
            else{
                nilai = listData.sort(function(a, b) {
                    return b.qth22 - a.qth22;
                });
                setKurs('')
            }
        }
        else{
            if(e === "jumlah"){
                nilai = listData.sort(function(a, b) {
                    return b.total21 - a.total21;
                });
                setKurs('Rp. ')
            }
            else if(e === "harga"){
                nilai = listData.sort(function(a, b) {
                    return b.th21 - a.th21;
                });
                setKurs('Rp. ')
            }
            else{
                nilai = listData.sort(function(a, b) {
                    return b.qth21 - a.qth21;
                });
                setKurs('')
            }
        }
        let datas = [];
        let jm = 0;
        if(nilai.length <=10){jm = nilai.length} else {jm = 10};
        for(let x= 0; x < jm; x++){
            if(year === 2023){
                datas.push({ item: nilai[x].item, harga : nilai[x].th23 , qty : nilai[x].qth23, total : nilai[x].total23, satuan : nilai[x].satuan, tipe : nilai[x].tipe })
            }
            else if(year === 2022){
                datas.push({ item: nilai[x].item, harga : nilai[x].th22 , qty : nilai[x].qth22, total : nilai[x].total22, satuan : nilai[x].satuan, tipe : nilai[x].tipe })
            }
            else{
                datas.push({item: nilai[x].item, harga : nilai[x].th21 , qty : nilai[x].qth21, total : nilai[x].total21, satuan : nilai[x].satuan, tipe : nilai[x].tipe })
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
        <div className='row'>
            <div className='col-xl-6 col-lg-6 mb-0'>
                <Pagination size="sm">
                    <Pagination.Item 
                        active={pagiJum}
                        onClick={(e)=>{
                            setPagiHarga(false);
                            setPagiJum(true);
                            setPagiQty(false);
                            changeData('jumlah');
                            setkeys('jumlah');
                        }}
                    >
                        Total
                    </Pagination.Item>
                    <Pagination.Item 
                        active={pagiHarga}
                        onClick={(e)=>{
                            setPagiHarga(true);
                            setPagiJum(false);
                            setPagiQty(false);
                            changeData('harga');
                            setkeys('harga');
                        }}
                    >
                        Harga
                    </Pagination.Item>
                    <Pagination.Item 
                        active={pagiQty}
                        onClick={(e)=>{
                            setPagiHarga(false);
                            setPagiJum(false);
                            setPagiQty(true);
                            changeData('qty');
                            setkeys('qty');
                        }}
                    >
                        Qty
                    </Pagination.Item>
                </Pagination>
            </div>
            <div className='col-xl-6 col-lg-6 mb-0'>
                <Dropdown as={ButtonGroup} size="sm">
                    <Button variant="primary">Filter</Button>

                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={()=>tipeData('')}>Semua</Dropdown.Item>
                        <Dropdown.Item onClick={()=>tipeData('CHEMICAL')}>Chemical</Dropdown.Item>
                        <Dropdown.Item onClick={()=>tipeData('INGREDIENTS')}>Inggredient</Dropdown.Item>
                        <Dropdown.Item onClick={()=>tipeData('PACKAGING')}>Packaging</Dropdown.Item>
                        <Dropdown.Item onClick={()=>tipeData('RAWMAT')}>Raw Material</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>

        <div>
            <ListGroup className='h-75' numbered>
                {fileName.map((e, i) =>{
                    let nilai = 0;
                    let ns = ''
                    if(keys === 'jumlah'){
                        nilai = e.total;
                    }
                    else if(keys === 'harga'){
                        nilai = e.harga;
                    }
                    else{
                        nilai = e.qty;
                        ns = `${e.satuan}`
                    }
                    return(
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start cekOut"
                            onClick={() => {props.sendToParent(e.item)}}
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">{e.item}</div>
                            <NumericFormat value={nilai} displayType={'text'} thousandSeparator={true} prefix={kurs} />
                            &nbsp;{ns}
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
