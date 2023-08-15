'use client'

import { useState, FormEvent, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export const chartOptions = {
  maintainAspectRatio: true,
  responsive: true,
  scales: {
    y: {
      grid: {
        drawOnChartArea: false,
      },
    beginAtZero: true,
    ticks: {
        color: '#F0EFEC',
        font: {
          family: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
          size: 14
        },
    }
    },
    x: {
      grid: {
        drawOnChartArea: false,
      },
    beginAtZero: true,
    ticks: {
        color: '#F0EFEC',
        font: {
          family: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
          size: 14
        },
    }
    }
  },
  plugins: {
    tooltip: {
      enabled: true,
    },
    legend: {
      display: true,
      labels: {
        color: '#F0EFEC',
        font: {
            size: 14,
            family: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
            weight: 'normal',
        },
      },
      position: 'top',
    },
    title: {
      display: false,
      font: {
        family: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
        size: 14,
        weight: 'normal',
      },
      text: 'AAPL',
      color: '#F0EFEC',
    },
  },
};

const initChartLabels = ['Day: 1', 'Day: 2', 'Day: 3', 'Day: 4', 'Day: 5', 'Day: 6', 'Day: 7', 'Day: 8', 'Day: 9', 'Day: 10'];

export const initChartData = {
  labels: initChartLabels,
  datasets: [
    {
      label: 'AAPL',
      color: '#F0EFEC',
      data: [179.32264709472656,178.9580535888672,178.3040008544922,177.4541015625,176.5189208984375,175.58126831054688,174.68882751464844,173.86244201660156,173.10696411132812,172.41932678222656],
      font: {
        family: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
        size: 14
      },
      borderColor: '#4BC0F0',
      backgroundColor: 'rgba(75, 192, 240, 0.5)',
    },
  ],
};

const initState = {
  ticker: "",
  time: "",
}

export default function Predict() {

  const [data, setData] = useState(initState)
  const [chartData, setChartData] = useState(initChartData)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(JSON.stringify(data))
    const { ticker, time } = data

    // Send data to API route 
    const res = await fetch('https://stockpricepredictor-api.onrender.com/api/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
             ticker, time
        })
    });

    const result = await res.json()
    console.log(result.predictions)
    var labels = [];
    for (let i = 0; i < result.predictions.length; i++){
      labels.push(`Day: ${i+1}`);
    };
    setChartData(
      {
        labels,
        datasets: [
          {
            label: ticker.toUpperCase(),
            color: '#F0EFEC',
            data: result.predictions,
            font: {
              family: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
              size: 14
            },
            borderColor: '#4BC0F0',
            backgroundColor: 'rgba(75, 192, 240, 0.5)',
          },
        ],
      }
    );

      // Navigate to [predict]
    router.push(`https://stockpricepredictor.vercel.app/predict/`)
  }

  const handleChange = (e) => {

    const name = e.target.name

    setData(prevData => ({
        ...prevData,
        [name]: e.target.value
    }))
  }

  const canSave = [...Object.values(data)].every(Boolean)

  return (
    <div className='bg-lighter h-full'>
      <div className='flex mx-auto pt-20 items-center'>
        <form className='text-lighter text-lg bg-main font-links font-normal m-auto py-3 rounded-lg px-5 shadow-xl' action="/api/predict" method="POST" onSubmit={handleSubmit}>
          <input onChange={handleChange} name='ticker' id='ticker' className='text-dark text-sm placeholder:text-neutral-950 bg-lighter font-links font-normal mx-2 py-1 rounded px-2 ml-0 border-none' type="text" placeholder='INPUT TICKER' title='Input ticker for stock you want to predict for example AAPL'/>
          <input onChange={handleChange} name='time' id='time' className='text-dark text-sm placeholder:text-neutral-950 bg-lighter font-links font-normal mx-2 py-1 rounded px-2 my-1 border-none' type="text" placeholder='INPUT TIME' title='Input number of days in the future you want to predict'/>
          <input type='submit' value='SUBMIT VALUES' className='text-lighter text-sm bg-main hover:bg-hoverMain font-links font-normal mx-2 py-1 rounded px-2 mr-0' disabled={!canSave}></input>
        </form>
      </div>
      <div className='flex mx-auto items-center max-w-5xl w-3/4 overflow-x-scroll'>
        <div className='text-lighter text-lg bg-darker font-links font-normal m-auto py-3 rounded-xl px-5 shadow-xl mt-10 w-full'>
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>
    </div>
  )
}