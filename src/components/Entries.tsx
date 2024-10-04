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
import { ObjectId } from 'bson';

interface EntriesProps {
    date: string,
    typeOfEntry: string,
    setAmountForChart: (amount: number) => void
}

interface Entry {
    _id: ObjectId,
    name: string;
    amount: number;
    category: string;
}

export default function Entries({ date, typeOfEntry, setAmountForChart }: EntriesProps) {
    const { token } = useToken()
    const [entries, setEntries] = useState<Entry[]>([])
    const [edit, setEdit] = useState('')
    const [totalAmount, setTotalAmount] = useState(0)

    const fetchEntries = async () => {
        const response = await fetch(`http://localhost:9000/${typeOfEntry}/` + date, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.ok) {
            const data: Entry[] = await response.json()
            if (data.length != 0) {
                const total = data.map(entry => entry.amount).reduce((prev, next) => prev + next).toFixed(2)
                setTotalAmount(Number(total))
                setAmountForChart(Number(total))
            } else {
                setTotalAmount(0)
            }
            setEntries(data)
        }
    }

    // const fetchCategories = async () => {
    //     const response = await fetch('http://localhost:9000/category/' + typeOfEntry, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`
    //         }
    //     })
    //     const data: Category[] = await response.json()
    //     setCategories(data)
    // }

    const deleteEntry = async (entry_id: ObjectId) => {
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
    }, [date, edit])

    return (
        <div className='lg:mx-5 mt-5'>
            <div className='flex lg:mx-2'>
                <h1 className='font-semibold text-2xl mr-5'>{typeOfEntry.charAt(0).toUpperCase() + typeOfEntry.slice(1)}:</h1>
                <AddEntry typeOfEntry={typeOfEntry} date={date} fetchEntries={fetchEntries} entries={entries}/>
            </div>
            <div className='flex flex-wrap'>
                {entries.map((entry, index) => (
                    <>
                        {edit && edit == `${entry._id}` ? (
                            <EditEntry type={typeOfEntry} date={date} fetchEntries={fetchEntries} entry={entry} setEdit={setEdit} entries={entries} />
                        ) : (
                            <div className='flex flex-row my-1 p-3 w-1/2 lg:w-[30%] lg:mx-2 shadow-xl rounded-xl'>
                                <div className='flex flex-col w-1/2 justify-center'>
                                    <div>
                                        <p className='font-semibold text-sm'>{entry.name}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm opacity-75'>{entry.category}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col w-1/2 justify-center items-end'>
                                    <div>
                                        <p className='font-semibold'>${entry.amount}</p>
                                    </div>
                                    <div className='flex flex-row'>
                                        <div>
                                            <input type="button" value='✏️' onClick={() => setEdit(`${entry._id}`)} className='cursor-pointer' />
                                        </div>
                                        <div>
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
                                                        <AlertDialogAction className='bg-blue-500 hover:bg-blue-600' onClick={() => deleteEntry(entry._id)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
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
