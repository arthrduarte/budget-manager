import { useEffect, useState } from 'react'
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

interface Entry {
    _id: ObjectId,
    name: string,
    amount: number,
    date: Date,
    category: string,
    user_id: ObjectId
}

interface EditEntryProps {
    entry: {
        _id: ObjectId,
        name: string;
        amount: number;
        category: string;
    },
    typeOfEntry: string,
    date: string,
    fetchEntries: () => void,
    setEdit: (edit: string) => void,
    entries: {}
}

export default function EditEntry({ entry, typeOfEntry, date, fetchEntries, setEdit }: EditEntryProps) {
    const { token } = useToken()
    const [name, setName] = useState(entry.name)
    const [amount, setAmount] = useState(entry.amount)
    const [category, setCategory] = useState('')
    const [categoriesForDropdown, setCategoriesForDropdown] = useState<string[]>([])
    const [entriesForCategoriesDropdown, setEntriesForCategoriesDropdown] = useState<Entry[]>([])
    const [error, setError] = useState('')

    const fetchAllEntries = async () => {
        const response = await fetch(`http://localhost:9000/${typeOfEntry}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setEntriesForCategoriesDropdown(data);
        }
    };

    const sortCategories = () => {
        const categoriesSet = new Set(categoriesForDropdown);
        entriesForCategoriesDropdown.forEach((entry) => {
            categoriesSet.add(entry.category);
        });
        setCategoriesForDropdown(Array.from(categoriesSet));
    };

    useEffect(() => {
        fetchAllEntries();
    }, [typeOfEntry]);

    useEffect(() => {
        sortCategories();
    }, [entriesForCategoriesDropdown]);

    const editEntry = async () => {
        if (!name || !amount || !category) {
            setError('All fields are required.')
            return;
        }

        if (!Number(amount)) {
            setError('Amount must be a valid number.')
            return;
        }

        const response = await fetch('http://localhost:9000/' + typeOfEntry, {
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
        <div className='flex flex-row my-1 p-3 w-1/2 lg:w-[30%] lg:mx-2 shadow-xl rounded-xl'>
            <div className='flex flex-col w-1/2 justify-center'>
                <div>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        className="font-semibold text-sm w-full h-full"
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div>
                    <CategoryDropdown category={category} setCategory={setCategory} categoriesForDropdown={categoriesForDropdown} />
                </div>
            </div>
            <div className='flex flex-col w-1/2 justify-center items-end'>
                <div>
                    <input
                        type="text"
                        name="amount"
                        value={amount}
                        className="font-semibold text-right w-full h-full"
                        onChange={e => setAmount(Number(e.target.value))}
                    />
                </div>
                <div className='flex flex-row'>
                    <div>
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
                    <div>
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
