import React, { useState } from 'react'
import useToken from '../hooks/useToken'

interface Category {
    id: number;
    name: string;
    type: string;
}

interface EditEntryProps {
    type: string,
    date: string,
    fetchData: () => void;
}

export default function EditEntry({ type, date, fetchData }: EditEntryProps) {
    const { token } = useToken()
    const [categories, setCategories] = useState<Category[]>([])
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
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-4 text-sm'>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="p-1 border rounded"
                    onChange={e => setName(e.target.value)}
                />
                <input
                    type="text"
                    name="amount"
                    placeholder="Amount"
                    className="p-1 border rounded"
                    onChange={e => setAmount(e.target.value)}
                />
                <select
                    name="category"
                    className="p-1 border rounded"
                    onChange={e => setCategoryId(e.target.value)}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="p-1 bg-blue-500 text-white rounded"
                >
                    Add
                </button>
            </div>
        </form>
    )
}
