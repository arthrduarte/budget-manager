import React, { useEffect, useState } from 'react'
import useToken from '../hooks/useToken'
import AddEntry from './AddEntry';

interface IncomeProps {
    date: string,
}

interface Income {
    id: number,
    name: string;
    amount: number;
    category_name: string;
}

export default function Income({ date }: IncomeProps) {
    const { token } = useToken()
    const [income, setIncome] = useState<Income[]>([])

    const fetchIncome = async () => {
        const response = await fetch('http://localhost:9000/income/' + date, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data: Income[] = await response.json()
        setIncome(data)
    }

    useEffect(() => {
        fetchIncome()
    }, [date])

    const deleteEntry = async (income_id: number) => {
        const response = await fetch('http://localhost:9000/income/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ income_id })
        });
        if (response.ok) {
            fetchIncome();
        }
    }

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
                <AddEntry type="expense" date={date} fetchData={fetchIncome} />
                {income.map((income, index) => (
                    <div className='grid grid-cols-4 text-sm' key={index}>
                        <p>{income.name}</p>
                        <p>{income.amount}</p>
                        <p>{income.category_name}</p>
                        <div className='flex flex-row'>
                            <div className='w-1/2'>
                                <input type="button" value={`Edit`} />
                            </div>
                            <div className='w-1/2'>
                                <input type="button" value={`Delete`} onClick={() => deleteEntry(income.id)} className='cursor-pointer' />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
