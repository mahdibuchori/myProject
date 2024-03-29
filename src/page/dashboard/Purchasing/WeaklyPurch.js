import React, { useState, useEffect } from 'react';
import '../dashboard.css';
// import Swal from "sweetalert2";
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
  } from 'chart.js';
import { Chart } from 'react-chartjs-2';

import { LoadingPage } from '../../../LoadingPage/LoadingPage';
import useDashboardStore, {selectDashboard,selectFetchDashboard,selectDashboardReady} from '../../../store/dataDashboard';

  ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
  );

export const WeaklyPurch = (props) => {
    const onDashboard = useDashboardStore(selectFetchDashboard);
    const dataDashboard = useDashboardStore(selectDashboard);
    const dashboardReady = useDashboardStore(selectDashboardReady);

    const [nabar, setNabar] = useState('');
    const [bulan, setBulan] = useState([]);
    const [item, setItem] = useState([]);
    
    const [week1, setWeek1] = useState([]);
    const [week2, setWeek2] = useState([]);
    const [week3, setWeek3] = useState([]);
    const [week4, setWeek4] = useState([]);
    const [avg, setAvg] = useState([]);
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
        console.log(item)
        setIsLoading(false); 
        const data = dataDashboard.data;
        const result = data.filter((v,i,a)=>a.findIndex(v2=>(v2.bulan===v.bulan))===i);
        const resultItem = data.filter((v,i,a)=>a.findIndex(v2=>(v2.item===v.item))===i);
        let bulans = result.map(d => { 
            return d.bulan
          })
          let material = resultItem.map(d => { 
            return {value:  d.item, label: d.item}
          })
        setBulan(bulans)
        setItem(material)
        if(material.length > 0){
            let nama = material[0].value;
            setNabar(nama)
            let listData =  data.filter((d) => d.item === nama);
            let dWeek1 = listData.map((d)=>{
                let nilai = 0
                if(d.week1 === ''){nilai = 0}else{ nilai = parseFloat(d.week1)}
                return(
                    nilai
                )
            })
            let dWeek2 = listData.map((d)=>{
                let nilai = 0
                if(d.week2 === ''){nilai = 0}else{ nilai = parseFloat(d.week2)}
                return(
                    nilai
                )
            })
            let dWeek3 = listData.map((d)=>{
                let nilai = 0
                if(d.week3 === ''){nilai = 0}else{ nilai = parseFloat(d.week3)}
                return(
                    nilai
                )
            })
            let dWeek4 = listData.map((d)=>{
                let nilai = 0;
                if(d.week4 === ''){nilai = 0}else{ nilai = parseFloat(d.week4)}
                return(
                    nilai
                )
            })
            let dAvg = listData.map((d)=>{
                let nilai = 0;
                if(d.avg === ''){nilai = 0}else{ nilai = parseFloat(d.avg)}
                return(
                    nilai
                )
            })
            setWeek1(dWeek1);
            setWeek2(dWeek2);
            setWeek3(dWeek3);
            setWeek4(dWeek4);
            setAvg(dAvg);
        }
      }

    const performRefresh = () =>{
        if(props.name === ""){
            console.log(props.nama)
        }
        else{
            setNabar(props.name)
            try {
              const data = dataDashboard.data;
              let listData =  data.filter((d) => d.item === props.name);
              let dWeek1 = listData.map((d)=>{
                  let nilai = 0
                  if(d.week1 === ''){nilai = 0}else{ nilai = parseFloat(d.week1)}
                  return(
                      nilai
                  )
              })
              let dWeek2 = listData.map((d)=>{
                  let nilai = 0
                  if(d.week2 === ''){nilai = 0}else{ nilai = parseFloat(d.week2)}
                  return(
                      nilai
                  )
              })
              
              let dWeek3 = listData.map((d)=>{
                  let nilai = 0
                  if(d.week3 === ''){nilai = 0}else{ nilai = parseFloat(d.week3)}
                  return(
                      nilai
                  )
              })
              
              let dWeek4 = listData.map((d)=>{
                  let nilai = 0;
                  if(d.week4 === ''){nilai = 0}else{ nilai = parseFloat(d.week4)}
                  return(
                      nilai
                  )
              })
              let dAvg = listData.map((d)=>{
                  let nilai = 0;
                  if(d.avg === ''){nilai = 0}else{ nilai = parseFloat(d.avg)}
                  return(
                      nilai
                  )
              })
              setWeek1(dWeek1);
              setWeek2(dWeek2);
              setWeek3(dWeek3);
              setWeek4(dWeek4);
              setAvg(dAvg);
            } catch (error) {
              // Swal.fire('Opsss..','Terjadi Kesalahan Harap Refresh Page','error')
            }
        }
        
    }

    const labels = bulan;

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: false,
            text: 'REPORT PURCHASING - HARGA',
            position: 'bottom',
          },
        },
      };
      const data = {
          labels,
          datasets: [
            {
              type: 'line',
              label: 'Avg',
              data : avg,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderWidth: 2,
              fill: false,
            },
            {
              type: 'bar',
              label: 'Week 1',
              data: week1,
              backgroundColor: '#d07979a7',
              borderColor: 'white',
              borderWidth: 2,
            },
            {
              type: 'bar',
              label: 'Week 2',
              data: week2,
              backgroundColor: '#120cce60',
              borderColor: 'white',
              borderWidth: 2,
            },
            {
              type: 'bar',
              label: 'Week 3',
              data: week3,
              backgroundColor: '#38cc4c73',
              borderColor: 'white',
              borderWidth: 2,
            },
            {
              type: 'bar',
              label: 'Week 4',
              data: week4,
              backgroundColor: '#a35ea6c4',
              borderColor: 'white',
              borderWidth: 2,
            },
          ],
      };
    
  return (
    <>
        <div className='card-h-50 card mt-2'>
            <div className='card-body'>
            <div class="d-flex align-items-center justify-content-between mb-2">
                <h6 className=''>REPORT PER MINGGU PURCHASING - HARGA {nabar}</h6>

            </div>
            <Chart type='bar' data={data}  options={options}/>
            </div>
        </div>
        {isLoading ? <LoadingPage/> : ""}
    </>
        
  )
}
