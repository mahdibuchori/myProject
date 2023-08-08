import React, {useState, useEffect} from 'react';
import './dashboard.css';
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
  
import { LoadingPage } from '../../LoadingPage/LoadingPage';
import useDashboardStore, {selectYdash, selectFetchYdash, selectYdashReady } from '../../store/dataDashboard';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const labels = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli','agustus','september','oktober','november','desember'];


export const MonthlyPurch = (props) => {
    const onDashboard = useDashboardStore(selectFetchYdash);
    const dataDashboard = useDashboardStore(selectYdash);
    const dashboardReady = useDashboardStore(selectYdashReady);

    const [nabar,setNabar]= useState(props.name);
    const [item, setItem] = useState([]);
    const [thn1, setThn1] = useState([]);
    const [thn2, setThn2] = useState([]);
    const [thn3, setThn3] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { 
        setIsLoading(true);
        onDashboard()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!dashboardReady) return;
        onGridReady(0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dashboardReady]);

    useEffect(() => {
        performRefresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [props.name]);

    const onGridReady = (x) =>{
        console.log(props.name)
        setIsLoading(false); 
        const data = dataDashboard.data;
        const resultItem = data.filter((v,i,a)=>a.findIndex(v2=>(v2.item===v.item))===i);
        let material = resultItem.map(d => { 
            return {value:  d.item, label: d.item}
        })
        setItem(material);
        if(material.length > 0){
            let nama = material[0].value;
            setNabar(nama);
            let listData =  data.filter((d) => d.item === nama);
            
            
            let keys = Object.keys(listData[0]);
            console.log(listData)
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
            
            setThn1(d2021);
            setThn2(d2022);
            setThn3(d2023);
        }
    }

    const performRefresh = () =>{
        if(props.name === ""){
            console.log(props.nama)
            console.log(item)
        }
        else{
            setNabar(props.name)
            const data = dataDashboard.data;
            let listData =  data.filter((d) => d.item === props.name);
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
            <div className='card-h-50 card mt-2'>
                    <div className='card-body'>
                        <div class="d-flex align-items-center justify-content-between mb-2">
                            <h6>REPORT PER TAHUN PURCHASING - HARGA {nabar}</h6>
                        </div>
                        <Line options={options} data={data} />
                    </div>
                </div>

            {isLoading ? <LoadingPage/> : ""}
        </>
            
    )
}
