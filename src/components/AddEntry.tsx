import { useEffect, useState } from 'react'
import useToken from '../hooks/useToken'

interface Category {
    id: number;
    name: string;
    type: string;
}

interface AddEntryProps {
    type: string,
    date: string,
    fetchData: () => void;
    categories: Category[]
}

export default function AddEntry({ type, date, fetchData, categories }: AddEntryProps) {
    const { token } = useToken()
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [category_id, setCategoryId] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
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
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='flex flex-row py-1 text-sm'>
                <div className="w-1/4 mx-1">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="p-1 border rounded w-full"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="w-1/4 mx-1">
                    <input
                        type="text"
                        name="amount"
                        placeholder="Amount"
                        className="p-1 border rounded w-full"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>
                <div className="w-1/4 mx-1">
                    <select
                        name="category"
                        className="p-1 border rounded w-full"
                        value={category_id}
                        onChange={e => setCategoryId(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="w-1/4 mx-1">
                    <button
                        type="submit"
                        className="p-1 bg-blue-500 text-white rounded w-full"
                    >
                        Add
                    </button>
                </div>
            </div>
        </form>
    )
}
