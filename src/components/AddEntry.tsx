import { useState } from 'react'
import useToken from '../hooks/useToken'
import CategoryDropdown from './CategoryDropdown';
import { Button } from './ui/button';
import { Input } from "@/components/ui/input"

interface Category {
    id: number;
    name: string;
    type: string;
}

interface AddEntryProps {
    type: string,
    date: string,
    fetchData: () => void;
    categories: Category[],
    fetchCategories: () => void,
}

export default function AddEntry({ type, date, fetchData, categories, fetchCategories }: AddEntryProps) {
    const { token } = useToken()
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [category_id, setCategoryId] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        if (!name || !amount || !category_id) {
            setError('All fields are required.')
            return;
        }

        if (!Number(amount)) {
            setError('Amount must be a valid number.')
            return;
        }

        const response = await fetch('http://localhost:9000/' + type, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, amount, date, category_id })
        })
        if (response.ok) {
            fetchData();
            setName('');
            setAmount('');
            setCategoryId('');
            setError('');
        }
    }

    return (
        <div className='flex flex-col'>
            <div className="flex flex-row py-1 text-sm h-[2rem]">
                <div className="w-1/4 mx-1">
                    <Input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="p-1 border rounded w-full h-full"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="w-1/4 mx-1">
                    <Input
                        type="text"
                        name="amount"
                        placeholder="Amount"
                        className="p-1 border rounded w-full h-full"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>
                <CategoryDropdown category_id={category_id} setCategoryId={setCategoryId} categories={categories} type={type} fetchCategories={fetchCategories} />
                <div className="w-1/4 mx-1">
                    <Button onClick={handleSubmit} className='bg-blue-500 hover:bg-blue-400 w-full h-full'>Add</Button>
                </div>
            </div>
            {error &&
                <div className='text-center py-2'>
                    <p style={{ color: 'red' }}>{error}</p>
                </div>}
        </div>
    )
}
