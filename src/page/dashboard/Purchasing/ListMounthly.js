import React, { useEffect, useState } from 'react';
import '../dashboard.css';
/*import ChartDataLabels from 'chartjs-plugin-datalabels'; 
 */
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
import { Badge, Button, ButtonGroup, Dropdown, Form, Modal, Pagination, Stack } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useDashboardStore, {selectYdash, selectFetchYdash, selectYdashReady } from '../../../store/dataDashboard';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
const labels = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli','agustus','september','oktober','november','desember','avg'];

const ListMounthly = () => {
    const onDashboard = useDashboardStore(selectFetchYdash);
    const dataDashboard = useDashboardStore(selectYdash);
    const dashboardReady = useDashboardStore(selectYdashReady);

    const [month, setMonth] = useState();
    const [nabar,setNabar]= useState('');
    const [thn1, setThn1] = useState([]);
    const [thn2, setThn2] = useState([]);
    const [thn3, setThn3] = useState([]);
    const [isTipe, setIsTipe] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pagiJum, setPagiJum] = useState(true);
    const [pagiHarga, setPagiHarga] = useState(false);
    const [pagiQty, setPagiQty] = useState(false);
    const [show, setShow] = useState(false);

    const [fileName, setFileName] = useState([]);
    const [kurs, setKurs] = useState('Rp. ');
    const [keys, setkeys] = useState('jumlah');
    let tWidth = 0;
    if(parseInt(window.innerWidth) < 1022){
        tWidth = parseInt(window.innerWidth) - 70;
    }
    else{
        tWidth = parseInt(window.innerWidth) -250 ;
    }
    const [screenWidth, setScreenWidth] = useState(tWidth);
    useEffect(() => {
        const handleResize = () => {
          let total = 0;
          if(parseInt(window.innerWidth) < 1022){
            total = parseInt(window.innerWidth) - 70;
          }
          else{
            total = parseInt(window.innerWidth) - 250 ;
          }
          setScreenWidth(total);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

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

    const handleClose = () => setShow(false);

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
            let persentase23 = 0
            if(n23 > 0){
                persentase23 =((n23 - n22) / (n22)) * 100 ;
            }
            else{
                persentase23 = 0
            }
            const persentase22 = ((n22 - n21) / (n21)) * 100 ;
            return(
                { item: post.item, th23 : n23, th22 : n22, th21 : n21, qth23 : q23, qth22 : q22, qth21 : q21, total21 : total21, total22 : total22, total23 : total23, satuan : post.satuan, tipe : post.tipe, persentase23: persentase23.toFixed(2), persentase22 : persentase22.toFixed(2), persentase21: "0" }
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
        for(let x= 0; x < nilai.length; x++){
            if(year === 2023){
                datas.push({ item: nilai[x].item, harga : nilai[x].th23 , qty : nilai[x].qth23, total : nilai[x].total23, satuan : nilai[x].satuan, tipe : nilai[x].tipe, persentase23 : nilai[x].persentase23, persentase22 : nilai[x].persentase22, persentase21 : nilai[x].persentase21  })
            }
            else if(year === 2022){
                datas.push({ item: nilai[x].item, harga : nilai[x].th22 , qty : nilai[x].qth22, total : nilai[x].total22, satuan : nilai[x].satuan, tipe : nilai[x].tipe, persentase23 : nilai[x].persentase23, persentase22 : nilai[x].persentase22, persentase21 : nilai[x].persentase21  })
            }
            else{
                datas.push({item: nilai[x].item, harga : nilai[x].th21 , qty : nilai[x].qth21, total : nilai[x].total21, satuan : nilai[x].satuan, tipe : nilai[x].tipe, persentase23 : nilai[x].persentase23, persentase22 : nilai[x].persentase22, persentase21 : nilai[x].persentase21  })
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
            let persentase23 = 0
            if(n23 > 0){
                persentase23 =((n23 - n22) / (n22)) * 100 ;
            }
            else{
                persentase23 = 0
            }
            const persentase22 = ((n22 - n21) / (n21)) * 100 ;
            return(
                { item: post.item, th23 : n23, th22 : n22, th21 : n21, qth23 : q23, qth22 : q22, qth21 : q21, total21 : total21, total22 : total22, total23 : total23, satuan : post.satuan, tipe : post.tipe, persentase23: persentase23.toFixed(2), persentase22 : persentase22.toFixed(2), persentase21: "0" }
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
        for(let x= 0; x < nilai.length; x++){
            if(year === 2023){
                datas.push({ item: nilai[x].item, harga : nilai[x].th23 , qty : nilai[x].qth23, total : nilai[x].total23, satuan : nilai[x].satuan, tipe : nilai[x].tipe, persentase23 : nilai[x].persentase23, persentase22 : nilai[x].persentase22, persentase21 : nilai[x].persentase21 })
            }
            else if(year === 2022){
                datas.push({ item: nilai[x].item, harga : nilai[x].th22 , qty : nilai[x].qth22, total : nilai[x].total22, satuan : nilai[x].satuan, tipe : nilai[x].tipe, persentase23 : nilai[x].persentase23, persentase22 : nilai[x].persentase22, persentase21 : nilai[x].persentase21 })
            }
            else{
                datas.push({item: nilai[x].item, harga : nilai[x].th21 , qty : nilai[x].qth21, total : nilai[x].total21, satuan : nilai[x].satuan, tipe : nilai[x].tipe, persentase23 : nilai[x].persentase23, persentase22 : nilai[x].persentase22, persentase21 : nilai[x].persentase21 })
            }
            
        }

        setFileName(datas);
        
    }

    const changeData = (e) =>{
        console.log(e)
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
            let persentase23 = 0
            let persentase22 = 0
            if(n23 > 0){
                persentase23 =((n23 - n22) / (n22)) * 100 ;
            }
            else{
                persentase23 = 0
            }
            if(n22 > 0){
                persentase22 = ((n22 - n21) / (n21)) * 100 ;
            }
            else{
                persentase22 = 0
            }
            return(
                {item: post.item, th23 : n23, th22 : n22, th21 : n21, qth23 : q23, qth22 : q22, qth21 : q21, total21 : total21, total22 : total22, total23 : total23, satuan : post.satuan, tipe : post.tipe, persentase23: persentase23.toFixed(2), persentase22 : persentase22.toFixed(2), persentase21: "0" }
            )
        });
        console.log(postIds)
        console.log(isTipe)
        let listData = {};
        if(e === ""){
            listData = postIds
        }
        else{
            if(isTipe === ""){listData = postIds}
            else{listData = postIds.filter((d) => d.tipe === isTipe)}
        }
        console.log(listData)
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
        for(let x= 0; x < nilai.length; x++){
            if(year === 2023){
                datas.push({ item: nilai[x].item, harga : nilai[x].th23 , qty : nilai[x].qth23, total : nilai[x].total23, satuan : nilai[x].satuan, tipe : nilai[x].tipe, persentase23 : nilai[x].persentase23, persentase22 : nilai[x].persentase22, persentase21 : nilai[x].persentase21  })
            }
            else if(year === 2022){
                datas.push({ item: nilai[x].item, harga : nilai[x].th22 , qty : nilai[x].qth22, total : nilai[x].total22, satuan : nilai[x].satuan, tipe : nilai[x].tipe, persentase23 : nilai[x].persentase23, persentase22 : nilai[x].persentase22, persentase21 : nilai[x].persentase21  })
            }
            else{
                datas.push({item: nilai[x].item, harga : nilai[x].th21 , qty : nilai[x].qth21, total : nilai[x].total21, satuan : nilai[x].satuan, tipe : nilai[x].tipe, persentase23 : nilai[x].persentase23, persentase22 : nilai[x].persentase22, persentase21 : nilai[x].persentase21  })
            }
            
        }

        console.log(datas)
        
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
            let persentase23 = 0
            let persentase22 = 0
            if(n23 > 0){
                persentase23 =((n23 - n22) / (n22)) * 100 ;
            }
            else{
                persentase23 = 0
            }
            if(n22 > 0){
                persentase22 = ((n22 - n21) / (n21)) * 100 ;
            }
            else{
                persentase22 = 0
            }
            return(
                {item: post.item, th23 : n23, th22 : n22, th21 : n21, qth23 : q23, qth22 : q22, qth21 : q21, total21 : total21, total22 : total22, total23 : total23, satuan : post.satuan, tipe : post.tipe, persentase23: persentase23.toFixed(2), persentase22 : persentase22.toFixed(2), persentase21: "0" }
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
        for(let x= 0; x < nilai.length; x++){
            if(year === 2023){
                datas.push({ item: nilai[x].item, harga : nilai[x].th23 , qty : nilai[x].qth23, total : nilai[x].total23, satuan : nilai[x].satuan, tipe : nilai[x].tipe, persentase23 : nilai[x].persentase23, persentase22 : nilai[x].persentase22, persentase21 : nilai[x].persentase21  })
            }
            else if(year === 2022){
                datas.push({ item: nilai[x].item, harga : nilai[x].th22 , qty : nilai[x].qth22, total : nilai[x].total22, satuan : nilai[x].satuan, tipe : nilai[x].tipe, persentase23 : nilai[x].persentase23, persentase22 : nilai[x].persentase22, persentase21 : nilai[x].persentase21  })
            }
            else{
                datas.push({item: nilai[x].item, harga : nilai[x].th21 , qty : nilai[x].qth21, total : nilai[x].total21, satuan : nilai[x].satuan, tipe : nilai[x].tipe, persentase23 : nilai[x].persentase23, persentase22 : nilai[x].persentase22, persentase21 : nilai[x].persentase21  })
            }
            
        }
        
        setFileName(datas);
    }

    const handleShow = (e) =>{
        if(e === ""){
            console.log(e)
        }
        else{
            setShow(true);
            const data = dataDashboard.data;
            let listData =  data.filter((d) => d.item === e);
            let keys = Object.keys(listData[0]);
            let d2021 =[];
            let d2022 =[];
            let d2023 =[];
            
            keys.forEach(function (key) {
                labels.map((d)=>{
                    let nilai = 0
                    if(d === key){
                        nilai = 0;
                        if(listData[0][key].th21 === ''){nilai =0}else{nilai =listData[0][key].th21}
                        return(
                            d2021.push(nilai)
                        )
                    }
                    else{
                        nilai = 0
                        return(
                            console.log('')
                        )
                    }
                    
                })
            });
            keys.forEach(function (key) {
                labels.map((d)=>{
                    let nilai = 0
                    if(d === key){
                        nilai = 0;
                        if(listData[0][key].th22 === ''){nilai = 0}else{nilai =listData[0][key].th22}
                        return(
                            d2022.push(nilai)
                        )
                    }
                    else{
                        nilai = 0
                        return(
                            console.log('')
                        )
                    }
                    
                })
            });
            keys.forEach(function (key) {
                labels.map((d)=>{
                    let nilai = 0
                    if(d === key){
                        nilai = 0;
                        if(listData[0][key].th23 === ''){nilai = 0}else{nilai =listData[0][key].th23}
                        return(
                            d2023.push(nilai)
                        )
                    }
                    else{
                        nilai = 0
                        return(
                            console.log('')
                        )
                    }
                    
                })
            });

            const sum = d2021.reduce((a, b) => a + b, 0);
            const tSum = (parseFloat(sum / 12).toFixed(2));
            d2021.push(parseFloat(tSum));
            const sum1 = d2022.reduce((a, b) => a + b, 0);
            const tSum1 = (parseFloat(sum1 / 12).toFixed(2));
            d2022.push(parseFloat(tSum1));
            const sum2 = d2023.reduce((a, b) => a + b, 0);
            const tSum2 = (parseFloat(sum2 / 12).toFixed(2));
            d2023.push(parseFloat(tSum2));
            setThn1(d2021);
            setThn2(d2022);
            setThn3(d2023);
        }
        
    }

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          datalabels: {
            display: false
          },
          title: {
            display: false,
            text: 'Chart.js Line Chart',
          },
        },
      };
      
    const data = {
    labels,
    datasets: [
        {
        label: 'Tahun 2021',
        data : thn1,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
        label: 'Tahun 2022',
        data : thn2,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
        label: 'Tahun 2023',
        data : thn3,
        borderColor: '#3eeb35',
        backgroundColor: '#35eb3580',
        },
    ],
    };

    
  return (
    <>
    <div className="card p-2 mb-2" style={{width: screenWidth}}>
        
        <Stack direction="horizontal" gap={3} style={{padding: "0px 10px 0px 10px"}}>
          <div className="bg-body">
          <h5 style={{textAlign: 'center'}}>List Montly Purchasing</h5>
          </div>
          <div className="ms-auto">
            <div className='row' style={{marginRight: 10, display:'flex'}}>
            <div className='col-xl-8 col-lg-6 mb-0'>
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
            <div className='col-xl-4 col-lg-6 mb-0'>
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
          </div>
          <div className="vr" />
          <div className="bg-body">
            <div class="d-flex align-items-center justify-content-between mb-2">
                
                <Form.Control
                    type="month"
                    className='text-center border border-primary text-primary'
                    value={month}
                    min="2020-08"
                    onChange={(e) =>onSetDate(e)}
                />

            </div>
          </div>
        </Stack>
        
        <div className="d-flex flex-row flex-nowrap overflow-auto  m-1" >
        {fileName.map((e, i) =>{
            let nilai = 0;
            // let ns = ''
            if(keys === 'jumlah'){
                nilai = e.total;
            }
            else if(keys === 'harga'){
                nilai = e.harga;
            }
            else{
                nilai = e.qty;
                // ns = `${e.satuan}`
            }
            const date = new Date(month)
            const yy = date.getFullYear(date)
            let presentase = 0;
            let warna = 'secondary';
            let icon = ''
            console.log(e.persentase23)
            if(yy === 2023){
                if(e.persentase23 === Infinity || e.persentase23 === 'Infinity'){
                    presentase = 0
                }else{
                    presentase = parseFloat(e.persentase23);
                }
                
            }
            else if(yy === 2022){
                if(e.persentase22 === Infinity || e.persentase22 === 'Infinity'){
                    presentase = 0
                }else{
                    presentase = parseFloat(e.persentase22)
                }
            }
            else{
                presentase = 0
            }
            if(presentase === 0){
                warna = 'secondary'
                icon ='bi bi-dash'
            }
            else{
                if(presentase < 0){ 
                    warna = 'danger'
                    icon = 'bi bi-chevron-double-down'
                }
                else{
                    warna='success'
                    icon = 'bi bi-chevron-double-up'
                }
            }
            return(
                <div className="card p-2 m-2" style={{minWidth: '300px', minHeight: '70px'}}>
                    <Button 
                        variant="primary" 
                        size="sm" 
                        className='mb-1' 
                        style={{width: '30px'}} 
                        onClick={(x)=>{
                            setNabar(e.item)
                            handleShow(e.item)
                        }}
                    >
                        <i className="bi bi-graph-up"></i>
                    </Button>
                    <h6 style={{textAlign: 'center'}}>{e.item}</h6>
                    <h5 style={{textAlign: 'center',marginBottom: '10px'}}><NumericFormat value={nilai} displayType={'text'} thousandSeparator={true} prefix={kurs} /></h5>
                    <div className="position-absolute bottom-0 end-0 px-2 p-2">
                        
                        <Badge bg={warna}>
                            <i className={icon}></i>
                            {presentase}&nbsp;%
                        </Badge>
                    </div>
                
                </div> 
            )}
        )}
                       
        </div>
    </div>

    <Modal
        show={show}
        onHide={handleClose}
        keyboard={true}
        size="lg"
        centered
      >
        <Modal.Body>
            <div class="d-flex align-items-center justify-content-between mb-2">
                <h6>REPORT PER TAHUN PURCHASING - HARGA {nabar}</h6>
            </div>
            <Line options={options} data={data} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {isLoading ? <LoadingPage/> : ""}
    </>
  )
}

export default ListMounthly