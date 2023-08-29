import React, { useState, useEffect } from 'react';
import '../dashboard.css';
import Select from 'react-select';

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
import useDashboardStore, { selectDashPpic, selectFetchDashPpic, selectPpicReady } from '../../../store/dataDashboard';

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

const Months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli','Agustus','September','Oktober','November','Desember'];


export const ChartDaging = (props) => {
  const onDashboard = useDashboardStore(selectFetchDashPpic);
  const dataDashboard = useDashboardStore(selectDashPpic);
  const dashboardReady = useDashboardStore(selectPpicReady);

  const [bulan, setBulan] = useState([]);
  const [nabar, setNabar] = useState([{value:'',label:''}]);
  const [item, setItem] = useState([]);
  const [week1, setWeek1] = useState([]);
  const [week2, setWeek2] = useState([]);
  const [week3, setWeek3] = useState([]);
  const [week4, setWeek4] = useState([]);
  const [week5, setWeek5] = useState([]);
  const [avg, setAvg] = useState([]);

  useEffect(() => { 
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
    const dataDaging = dataDashboard.daging;
    const result = dataDaging.filter((v,i,a)=>a.findIndex(v2=>(v2.bulan===v.bulan))===i);
    let bulans = result.map(d => { 
        return d.bulan
    })
    bulans.sort((a, b) => {
        return Months.indexOf(a) - Months.indexOf(b)
    });

    const daging = dataDaging.filter((v,i,a)=>a.findIndex(v2=>(v2.item===v.item))===i);
    let material = daging.map(d => { 
        return {value:  d.item.trim(), label: d.item.trim()}
      });
    setItem(material)
    setBulan(bulans)

    if(material.length > 0){
      let nama = dataDaging[0].value;
      const postIds = dataDaging.map((e) => {
          return(
              {item: e.item, bulan: e.bulan, week1: e.week1, week2: e.week2, week3: e.week3, week4: e.week4, week5: e.week5, total : e.total, avg : e.avg }
          )
      })
      postIds.sort((a, b) => {
          return Months.indexOf(a.bulan) - Months.indexOf(b.bulan)
      });
      let listData =  postIds.filter((d) => d.item === nama);
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
      let dWeek5 = listData.map((d)=>{
          let nilai = 0;
          if(d.week5 === ''){nilai = 0}else{ nilai = parseFloat(d.week5)}
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
      setWeek5(dWeek5);
      setAvg(dAvg);
        
    }
  }

  const handleSelect = (e) =>{
    try {
      const dataDaging = dataDashboard.daging;
      let nama = e.value;
      const postIds = dataDaging.map((e) => {
          return(
              {item: e.item, bulan: e.bulan, week1: e.week1, week2: e.week2, week3: e.week3, week4: e.week4, week5: e.week5, total : e.total, avg : e.avg  }
          )
      })
      postIds.sort((a, b) => {
          return Months.indexOf(a.bulan) - Months.indexOf(b.bulan)
      });
      let listData =  postIds.filter((d) => d.item === nama);
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
      let dWeek5 = listData.map((d)=>{
          let nilai = 0;
          if(d.week5 === ''){nilai = 0}else{ nilai = parseFloat(d.week5)}
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
      setWeek5(dWeek5);
      setAvg(dAvg);
    } catch (error) {
        // Swal.fire('Opsss..','Terjadi Kesalahan Harap Refresh Page','error')
    }
      
  }

  const performRefresh = () =>{
        if(props.name === ""){
            console.log(props.nama)
        }
        else{
            try {
                setNabar({value: props.name, label: props.name});
                const dataDaging = dataDashboard.daging;
                let nama = props.name;
                const postIds = dataDaging.map((e) => {
                    return(
                        {item: e.item, bulan: e.bulan, week1: e.week1, week2: e.week2, week3: e.week3, week4: e.week4, week5: e.week5, total : e.total, avg : e.avg  }
                    )
                })
                postIds.sort((a, b) => {
                    return Months.indexOf(a.bulan) - Months.indexOf(b.bulan)
                });
                let listData =  postIds.filter((d) => d.item === nama);
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
                let dWeek5 = listData.map((d)=>{
                    let nilai = 0;
                    if(d.week5 === ''){nilai = 0}else{ nilai = parseFloat(d.week5)}
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
                setWeek5(dWeek5);
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
        {
          type: 'bar',
          label: 'Week 5',
          data: week5,
          backgroundColor: 'rgb(255, 99, 132)',
          borderWidth: 2,
        },
      ],
  };
  
  return (
      <>
        <div className='card-h-50 card mt-2'>
          <div className='card-body'>
            <div className='row'>
                <div className='col-sm-6'>
                    <h6>Chart Daging</h6>
                </div>
                <div className='col-sm-6'>
                  <Select 
                    className="float-end w-100"
                    classNamePrefix="select"
                    value={nabar}
                    isClearable={false}
                    isSearchable={true}
                    name="color"
                    options={item}
                    onChange={e => handleSelect(e)}
                  />
                </div>
            </div>
            
            <Chart type='bar' data={data}  options={options}/>
          </div>
        </div>
      </>
  )
}
