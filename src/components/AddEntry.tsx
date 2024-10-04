import { useEffect, useState } from 'react'
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

interface Entry {
    _id: ObjectId,
    name: string,
    amount: number,
    date: Date,
    category: string,
    user_id: ObjectId
}

interface AddEntryProps {
    typeOfEntry: string,
    date: string,
}

export default function AddEntry({ typeOfEntry, date }: AddEntryProps) {
    const { token } = useToken()
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [categoriesForDropdown, setCategoriesForDropdown] = useState<string[]>([])
    const [entriesForCategoriesDropdown, setEntriesForCategoriesDropdown] = useState<Entry[]>([])
    const [error, setError] = useState('')

    const fetchAllEntries = async () => {
        console.log("Fetching entries for type:", typeOfEntry);
        const response = await fetch(`http://localhost:9000/${typeOfEntry}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setEntriesForCategoriesDropdown(data);
        }
    };

    const sortCategories = () => {
        console.log("Sorting categories for type:", typeOfEntry);
        const categoriesSet = new Set(categoriesForDropdown);
        entriesForCategoriesDropdown.forEach((entry) => {
            categoriesSet.add(entry.category);
        });
        setCategoriesForDropdown(Array.from(categoriesSet));
        console.log(categoriesForDropdown);
    };

    useEffect(() => {
        fetchAllEntries();
    }, [typeOfEntry]);

    useEffect(() => {
        sortCategories();
    }, [entriesForCategoriesDropdown]);

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
            const data = await response.json();
            setEntriesForCategoriesDropdown([...entriesForCategoriesDropdown, data]);
            setCategoriesForDropdown(prevCategories => {
                const categoriesSet = new Set(prevCategories);
                categoriesSet.add(category);
                return Array.from(categoriesSet);
            });
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
                    <CategoryDropdown category={category} setCategory={setCategory} categoriesForDropdown={categoriesForDropdown} />
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
