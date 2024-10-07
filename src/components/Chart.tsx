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
                backgroundColor: 'rgb(34, 197, 94, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
        scales: {
            x: {
                grid: {
                    display: true,
                },
                ticks: {
                    display: true,
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    display: true,
                    maxTicksLimit: 7
                },
            },
        },
    };


    return <Bar data={data} options={options} />;
}

export default BarChart;
