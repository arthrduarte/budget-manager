import { useEffect, useState } from 'react'
import useToken from '../hooks/useToken'
import AddEntry from './AddEntry'
import EditEntry from './EditEntry';

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
        <div className='lg:w-1/2 lg:mx-5 shadow-xl'>
            <div className='px-5'>
                <h1>Expenses</h1>
            </div>
            <div>
                <div className='grid grid-cols-4 bg-gray-300'>
                    <p>Name</p>
                    <p>Amount</p>
                    <p>Category</p>
                </div>
                <AddEntry type={`${typeOfEntry}`} date={date} fetchData={fetchEntries} categories={categories} />
                {entries.map((entry, index) => (
                    <>
                        {edit && edit == `${entry.id}` ? (
                            <EditEntry type="expense" date={date} fetchData={fetchEntries} entry={entry} categories={categories} setEdit={setEdit} />
                        ) : (
                            <div className='grid grid-cols-4 text-sm py-1' key={index}>
                                <p>{entry.name}</p>
                                <p>{entry.amount}</p>
                                <p>{entry.category_name || 'No Category'}</p>
                                <div className='flex flex-row'>
                                    <div className='w-1/2'>
                                        <input type="button" value={`Edit`} onClick={() => setEdit(`${entry.id}`)} className='cursor-pointer' />
                                    </div>
                                    <div className='w-1/2'>
                                        <input type="button" value={`Delete`} onClick={() => deleteEntry(entry.id)} className='cursor-pointer' />
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
