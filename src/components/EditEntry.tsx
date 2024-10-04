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
import { ObjectId } from 'bson';

interface EditEntryProps {
    entry: {
        _id: ObjectId,
        name: string;
        amount: number;
        category: string;
    },
    type: string,
    date: string,
    fetchEntries: () => void,
    setEdit: (edit: string) => void,
    entries: {}
}

export default function EditEntry({ entry, type, date, fetchEntries, setEdit }: EditEntryProps) {
    const { token } = useToken()
    const [name, setName] = useState(entry.name)
    const [amount, setAmount] = useState(entry.amount)
    const [category, setCategory] = useState(entry.category)
    const [error, setError] = useState('')

    const editEntry = async () => {
        if (!name || !amount || !category) {
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
            body: JSON.stringify({ name, amount, date, category, expense_id: entry._id })
        })
        if (response.ok) {
            fetchEntries();
            setEdit('')
        }
    }

    return (
        <div>

            <div className='flex flex-row py-1 text-sm h-[2rem]'>
                <Input
                    type="hidden"
                    name="entry_id"
                    value={entry._id.toString()}
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
                {/* <CategoryDropdown setCategoryId={setCategoryId} categories={categories} category_id={category_id} type={type} fetchCategories={fetchCategories} /> */}

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
