import React, { useEffect, useState } from 'react'
import useToken from '../hooks/useToken'

interface ExpensesProps {
    date: string,
}

interface Expense {
    name: string;
    amount: number;
    date: string;
}

export default function Expenses({ date }: ExpensesProps) {
    const { token } = useToken()
    const [data, setData] = useState<Expense[]>([])

    useEffect(() => {
        console.log(date)
        const fetchData = async () => {
            const response = await fetch('http://localhost:9000/expense/' + date, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const data: Expense[] = await response.json()
            setData(data)
        }

        fetchData()
    }, [date])

    return (
        <div>
            {data.map((expense, index) => (
                <div className='flex flex-row' key={index}>
                    <p>{expense.name}</p>
                    <p>{expense.amount}</p>
                    <p>{expense.date}</p>
                </div>
            ))}
        </div>
    )
}
