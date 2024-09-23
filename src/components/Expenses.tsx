import React, { useEffect, useState } from 'react'
import useToken from '../hooks/useToken'
import AddEntry from './AddEntry'

interface ExpensesProps {
    date: string,
}

interface Expense {
    name: string;
    amount: number;
    category_name: string;
}

export default function Expenses({ date }: ExpensesProps) {
    const { token } = useToken()
    const [expenses, setExpenses] = useState<Expense[]>([])

    useEffect(() => {
        const fetchExpenses = async () => {
            const response = await fetch('http://localhost:9000/expense/' + date, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const data: Expense[] = await response.json()
            setExpenses(data)
        }
        fetchExpenses()
    }, [date])

    return (
        <div className='lg:w-1/2 lg:mx-5 shadow-xl'>
            <div className='px-5'>
                <h1>Expenses</h1>
            </div>
            <div>
                <div className='grid grid-cols-4 bg-gray-300'>
                    <p>Name</p>
                    <p>Amount</p>
                    <p>Category</p>
                </div>
                <AddEntry type="expense" date={date}/>
                {expenses.map((expense, index) => (
                    <div className='grid grid-cols-4 text-sm' key={index}>
                        <p>{expense.name}</p>
                        <p>{expense.amount}</p>
                        <p>{expense.category_name || 'No Category'}</p>
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
