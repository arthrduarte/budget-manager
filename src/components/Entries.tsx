import { useEffect, useState } from 'react'
import useToken from '../hooks/useToken'
import AddEntry from './AddEntry'
import EditEntry from './EditEntry';
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


interface EntriesProps {
    date: string,
    typeOfEntry: string
}

interface Category {
    id: number;
    name: string;
    type: string;
}

interface Entry {
    id: number,
    name: string;
    amount: number;
    category_name: string;
}

export default function Entries({ date, typeOfEntry }: EntriesProps) {
    const { token } = useToken()
    const [entries, setEntries] = useState<Entry[]>([])
    const [edit, setEdit] = useState('')
    const [categories, setCategories] = useState<Category[]>([])

    const fetchEntries = async () => {
        const response = await fetch(`http://localhost:9000/${typeOfEntry}/` + date, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data: Entry[] = await response.json()
        setEntries(data)
    }

    const fetchCategories = async () => {
        const response = await fetch('http://localhost:9000/category/' + typeOfEntry, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data: Category[] = await response.json()
        setCategories(data)
    }

    const deleteEntry = async (entry_id: number) => {
        const body = typeOfEntry === 'income' ? { income_id: entry_id } : { expense_id: entry_id };
        const response = await fetch(`http://localhost:9000/${typeOfEntry}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            fetchEntries();
        }
    }

    useEffect(() => {
        fetchEntries()
        fetchCategories()
    }, [date, edit])

    return (
        <div className='lg:w-1/2 lg:mx-5 mt-5'>
            <div className='text-center mb-1'>
                <h1 className='font-semibold text-lg'>{typeOfEntry.charAt(0).toUpperCase() + typeOfEntry.slice(1)}</h1>
            </div>
            <div className='shadow-xl rounded-xl'>
                <div className='flex flex-row py-1 bg-gray-300'>
                    <div className='w-1/4 text-center'>
                        <p>Name</p>
                    </div>
                    <div className='w-1/4 text-center'>
                        <p>Amount</p>
                    </div>
                    <div className='w-1/4 text-center'>
                        <p>Category</p>
                    </div>
                </div>
                <AddEntry type={`${typeOfEntry}`} date={date} fetchData={fetchEntries} categories={categories} />
                {entries.map((entry, index) => (
                    <>
                        {edit && edit == `${entry.id}` ? (
                            <EditEntry type="expense" date={date} fetchData={fetchEntries} entry={entry} categories={categories} setEdit={setEdit} />
                        ) : (
                            <div className='flex flex-row text-sm py-1' key={index}>
                                <div className='w-1/4 text-center mx-1'>
                                    <p>{entry.name}</p>
                                </div>
                                <div className='w-1/4 text-center mx-1'>
                                    <p>{entry.amount}</p>
                                </div>
                                <div className='w-1/4 text-center mx-1'>
                                    <p>{entry.category_name || 'No Category'}</p>
                                </div>
                                <div className='flex flex-row justify-end w-1/4 mx-1'>
                                    <div className='w-1/4 text-center my-auto'>
                                        <input type="button" value='✏️' onClick={() => setEdit(`${entry.id}`)} className='cursor-pointer' />
                                    </div>
                                    <div className='w-1/4 text-center my-auto'>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <input type="button" value='🗑️' className='cursor-pointer' />
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action is permanent.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction className='bg-blue-500 hover:bg-blue-600' onClick={() => deleteEntry(entry.id)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ))}
            </div>
        </div>
    )
}
