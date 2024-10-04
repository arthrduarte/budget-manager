import { useState } from 'react'
import useToken from '../hooks/useToken'
import CategoryDropdown from './CategoryDropdown';
import { Button } from './ui/button';
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ObjectId } from 'bson';

interface AddEntryProps {
    typeOfEntry: string,
    date: string,
    fetchEntries: () => void;
    entries: {}
}

export default function AddEntry({ typeOfEntry, date, fetchEntries, entries }: AddEntryProps) {
    const { token } = useToken()
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        if (!name || !amount || !category) {
            setError('All fields are required.')
            return;
        }

        if (!Number(amount)) {
            setError('Amount must be a valid number.')
            return;
        }

        const response = await fetch('http://localhost:9000/' + typeOfEntry, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, amount, date, category })
        })
        if (response.ok) {
            fetchEntries();
            setName('');
            setAmount('');
            setCategory('');
            setError('');
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button className='bg-green-500 hover:bg-green-400'>Add</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new {typeOfEntry}</DialogTitle>
                    <DialogDescription>Add a new {typeOfEntry} entry here</DialogDescription>
                </DialogHeader>
                <div className="flex flex-row py-1 text-sm h-[2rem]">
                    <div className="w-1/4 mx-1">
                        <Input
                            type="text"
                            name="name"
                            placeholder="Name"
                            className="p-1 border rounded w-full h-full"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="w-1/4 mx-1">
                        <Input
                            type="text"
                            name="amount"
                            placeholder="Amount"
                            className="p-1 border rounded w-full h-full"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                    </div>
                    {/* <div className="w-1/4 mx-1">
                        <Input
                            type="text"
                            name="category"
                            placeholder="Category"
                            className="p-1 border rounded w-full h-full"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        />
                    </div> */}
                    <CategoryDropdown setCategory={setCategory} category={category} typeOfEntry={typeOfEntry} />
                    <div className="w-1/4 mx-1">
                        <Button onClick={handleSubmit} className='bg-green-500 hover:bg-green-400 w-full h-full'>Add</Button>
                    </div>
                </div>
                {error &&
                    <div className='text-center py-2'>
                        <p style={{ color: 'red' }}>{error}</p>
                    </div>}
            </DialogContent>
        </Dialog>

    )
}
