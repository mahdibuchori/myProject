import React from 'react';
import './dashboard.css';
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
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const PurchBatang = () => {
    const data = {
        labels,
        datasets: [
          {
            type: 'line',
            label: 'Dataset 1',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            fill: false,
            data: [54,45,32,22,35,34,64],
          },
          {
            type: 'bar',
            label: 'Dataset 2',
            backgroundColor: 'rgb(75, 192, 192)',
            data: [64,55,42,32,45,44,74],
            borderColor: 'white',
            borderWidth: 2,
          },
          {
            type: 'bar',
            label: 'Dataset 3',
            backgroundColor: 'rgb(53, 162, 235)',
            data: [59,50,37,27,40,39,69]
          },
        ],
      };
  return (
    <>
        <div className='card-h-50 card mt-2'>
            <div className='card-body'>
                <Chart type='bar' data={data} />
            </div>
        </div>
    </>
  )
}
