import React, { useEffect, useState } from 'react'
import useToken from '../hooks/useToken'

interface IncomeProps {
    date: string,
}

interface Income {
    name: string;
    amount: number;
    category_name: string;
}

export default function Income({ date }: IncomeProps) {
    const { token } = useToken()
    const [data, setData] = useState<Income[]>([])

    useEffect(() => {
        console.log(date)
        const fetchData = async () => {
            const response = await fetch('http://localhost:9000/income/' + date, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const data: Income[] = await response.json()
            setData(data)
        }

        fetchData()
    }, [date])

    return (
        <div className='lg:w-1/2 lg:mx-5 shadow-xl'>
            <div>
                <h1>Income</h1>
            </div>
            <div>
                <div className='grid grid-cols-4 bg-gray-300'>
                    <p>Name</p>
                    <p>Amount</p>
                    <p>Category</p>
                </div>
                {data.map((income, index) => (
                    <div className='grid grid-cols-4 text-sm' key={index}>
                        <p>{income.name}</p>
                        <p>{income.amount}</p>
                        <p>{income.category_name}</p>
                        <div className='flex flex-row'>
                            <div className='w-1/2'>
                                <input type="button" value={`Edit`} />
                            </div>
                            <div className='w-1/2'>
                                <input type="button" value={`Delete`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
