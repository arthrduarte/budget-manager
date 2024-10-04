import { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import useToken from '@/hooks/useToken';
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

interface CategoryDropdownProps {
    setCategory: (category: string) => void;
    category: string,
    typeOfEntry: string
}

export default function CategoryDropdown({ setCategory, category, typeOfEntry }: CategoryDropdownProps) {
    const { token } = useToken()
    const [categories, setCategories] = useState<string[]>([])
    const [error, setError] = useState('');
    const [entries, setEntries] = useState<Entry[]>([])

    useEffect(() => {
        const fetchEntries = async () => {
            const response = await fetch(`http://localhost:9000/${typeOfEntry}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setEntries(data)
            }
        }
        fetchEntries()
    }, [typeOfEntry])
    
    const sortCategories = () => {
        const categoriesSet = new Set(categories)
        entries.forEach((entry) => {
            categoriesSet.add(entry.category)
        })
        setCategories(Array.from(categoriesSet))
    }
    useEffect(()=>{
        sortCategories()
    },[entries])
    
    return (
        <div className="w-1/4 mx-1 h-full">
            <DropdownMenu>
                <DropdownMenuTrigger className='w-full h-full'>
                    <Input
                        type="text"
                        name="category"
                        placeholder="Category"
                        className="p-1 border rounded w-full h-full"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="mt-2">
                        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="text"
                                    className="p-1 border rounded"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder={`New category`}
                                />
                            </div>
                        </div>
                    </DropdownMenuItem>
                    {error &&
                        <DropdownMenuItem disabled>{error}</DropdownMenuItem>
                    }
                    {categories.map((category, index) => (
                        <DropdownMenuItem
                            key={index}
                            className='flex flex-row'
                        >
                            <div className='w-full' onClick={(e)=> setCategory(category)}>
                                <p>{category}</p>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
