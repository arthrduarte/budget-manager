import React, { useEffect, useState } from 'react'
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
    // const [categories, setCategories] = useState<Category[]>([])
    const [name, setName] = useState(entry.name)
    const [amount, setAmount] = useState(entry.amount)
    const [category_id, setCategoryId] = useState('')

    const editEntry = async () => {
        console.log(name, amount, date, category_id, entry.id)
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
        <div className='flex flex-row text-sm'>
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
                    className="p-1 border rounded w-full"
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div className="w-1/4 mx-1">
                <Input
                    type="text"
                    name="amount"
                    value={amount}
                    className="p-1 border rounded w-full"
                    onChange={e => setAmount(Number(e.target.value))}
                />
            </div>
            <CategoryDropdown setCategoryId={setCategoryId} categories={categories} category_id={category_id} type={type} fetchCategories={fetchCategories} />

            <div className='flex flex-row justify-end w-1/4 mx-1'>
                <div className='w-1/4 text-center my-auto'>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Input type="button" value='✅' className='cursor-pointer' />
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
                    <Input type="button" value='❌' onClick={() => setEdit('')} className='cursor-pointer' />
                </div>
            </div>
        </div>
    )
}
