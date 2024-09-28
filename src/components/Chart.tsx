import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface BarChartProps {
    typeOfData: string[],
    amount: number[]
}

const BarChart = ({ typeOfData, amount }: BarChartProps) => {
    const data = {
        labels: typeOfData,
        datasets: [
            {
                label: 'Amount',
                data: amount,
                backgroundColor: 'rgb(34, 197, 94, 0.5)', // Bar colors
                borderColor: 'rgba(75, 192, 192, 1)', // Bar border colors
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Bar Chart Example',
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,  // Hide grid lines on the x-axis
                },
                ticks: {
                    display: false,  // Hide tick marks and labels on the x-axis
                },
            },
            y: {
                grid: {
                    display: false,  // Hide grid lines on the y-axis
                },
                ticks: {
                    display: false,  // Hide tick marks and labels on the y-axis
                },
            },
        },
    };


    return <Bar data={data} options={options} />;
}

export default BarChart;
