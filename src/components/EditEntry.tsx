import { useState } from 'react'
import useToken from '../hooks/useToken'
import CategoryDropdown from './CategoryDropdown';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from './ui/input';

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
    setEdit: (edit: string) => void,
    fetchCategories: () => void
}

export default function EditEntry({ entry, type, categories, date, fetchData, setEdit, fetchCategories }: EditEntryProps) {
    const { token } = useToken()
    const [name, setName] = useState(entry.name)
    const [amount, setAmount] = useState(entry.amount)
    const [error, setError] = useState('')

    const initialCategory = categories.find(cat => cat.name === entry.category_name)
    const [category_id, setCategoryId] = useState(initialCategory ? initialCategory.id.toString() : '')

    const editEntry = async () => {
        if (!name || !amount || !category_id) {
            setError('All fields are required.')
            return;
        }

        if (!Number(amount)) {
            setError('Amount must be a valid number.')
            return;
        }

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
        <div>

            <div className='flex flex-row py-1 text-sm h-[2rem]'>
                <Input
                    type="hidden"
                    name="entry_id"
                    value={entry.id}
                />
                <div className="w-1/4 mx-1">
                    <Input
                        type="text"
                        name="name"
                        value={name}
                        className="p-1 border rounded w-full h-full"
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="w-1/4 mx-1">
                    <Input
                        type="text"
                        name="amount"
                        value={amount}
                        className="p-1 border rounded w-full h-full"
                        onChange={e => setAmount(Number(e.target.value))}
                    />
                </div>
                <CategoryDropdown setCategoryId={setCategoryId} categories={categories} category_id={category_id} type={type} fetchCategories={fetchCategories} />

                <div className='flex flex-row justify-end w-1/4 mx-1'>
                    <div className='w-1/4 text-center my-auto'>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <input type="button" value='✅' className='cursor-pointer' />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to edit?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action is permanent.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className='bg-blue-500 hover:bg-blue-600' onClick={editEntry} >Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className='w-1/4 text-center my-auto'>
                        <input type="button" value='❌' onClick={() => setEdit('')} className='cursor-pointer' />
                    </div>
                </div>
            </div>
            {error &&
                <div className='text-center py-2'>
                    <p style={{ color: 'red' }}>{error}</p>
                </div>}
        </div>
    )
}
