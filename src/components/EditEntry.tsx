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
            <div className='flex flex-row text-sm'>
                <input
                    type="hidden"
                    name="entry_id"
                    value={entry.id}
                />
                <div className="w-1/4 mx-1">
                    <input
                        type="text"
                        name="name"
                        placeholder={entry.name}
                        className="p-1 border rounded w-full"
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="w-1/4 mx-1">
                    <input
                        type="text"
                        name="amount"
                        placeholder={`${entry.amount}`}
                        className="p-1 border rounded w-full"
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>
                <div className="w-1/4 mx-1">
                    <select
                        name="category"
                        className="p-1 border rounded w-full"
                        onChange={e => setCategoryId(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-row justify-end w-1/4 mx-1'>
                    <div className='w-1/4 text-center my-auto'>
                        <input type="submit" value='✅' className='cursor-pointer' />
                    </div>
                    <div className='w-1/4 text-center my-auto'>
                        <input type="button" value='❌' onClick={() => setEdit('')} className='cursor-pointer' />
                    </div>
                </div>
            </div>
        </form>
    )
}
