import React, { useState } from 'react'
import useToken from '../hooks/useToken'

interface Category {
    id: number;
    name: string;
    type: string;
}

interface EditEntryProps {
    entry: {
        id: number,
        name: string;
        amount: number;
        category_name: string;
    },
    type: string,
    categories: Category[]
    date: string,
    fetchData: () => void,
    setEdit: (edit: string) => void
}

export default function EditEntry({ entry, type, categories, date, fetchData, setEdit }: EditEntryProps) {
    const { token } = useToken()
    // const [categories, setCategories] = useState<Category[]>([])
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [category_id, setCategoryId] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log(name, amount, date, category_id, entry.id)
        e.preventDefault()
        const response = await fetch('http://localhost:9000/' + type, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, amount, date, category_id, expense_id: entry.id })
        })
        if (response.ok) {
            fetchData();
            setEdit('')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-4 text-sm'>
                <input
                    type="hidden"
                    name="entry_id"
                    value={entry.id}
                />
                <input
                    type="text"
                    name="name"
                    placeholder={entry.name}
                    className="p-1 border rounded"
                    onChange={e => setName(e.target.value)}
                />
                <input
                    type="text"
                    name="amount"
                    placeholder={`${entry.amount}`}
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
                <div className='flex flex-row'>
                    <div className='w-1/2'>
                        <input type="submit" value={`Update`} className='cursor-pointer' />
                    </div>
                    <div className='w-1/2'>
                        <input type="button" value={`Cancel`} onClick={() => setEdit('')} className='cursor-pointer' />
                    </div>
                </div>
            </div>
        </form>
    )
}
