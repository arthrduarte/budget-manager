import { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import useToken from '@/hooks/useToken';
import { Input } from './ui/input';


interface Category {
    id: number;
    name: string;
    type: string;
}

interface CategoryDropdownProps {
    setCategoryId: (id: string) => void,
    category_id: string,
    categories: Category[],
    type: string,
    fetchCategories: () => void
}

export default function CategoryDropdown({ setCategoryId, categories, category_id, type, fetchCategories }: CategoryDropdownProps) {
    const { token } = useToken()
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        categories.find(category => category.id.toString() === category_id) || null
    );
    const [newCategory, setNewCategory] = useState('')
    const [error, setError] = useState('');

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        setCategoryId(category.id.toString());
    };

    const handleCreateCategory = async () => {
        if (newCategory.trim() === '') {
            setError("New category can't be empty")
            return
        }

        const response = await fetch('http://localhost:9000/category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: newCategory, type }),
        });

        if (response.ok) {
            setNewCategory('');
            setError('')
            fetchCategories();
        } else {
            console.error('Failed to create category');
        }
    };


    return (
        <div className="w-1/4 mx-1 h-full">
            <DropdownMenu>
                <DropdownMenuTrigger className='w-full h-full'>
                    <Button className='bg-white hover:bg-slate-100 text-black font-normal w-full h-full'>
                        {selectedCategory ? selectedCategory.name : "Select Category"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="mt-2">
                        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="text"
                                    className="p-1 border rounded"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder={`New ${type}`}
                                />
                                <Button
                                    className="bg-green-500 text-white p-1 rounded"
                                    onClick={handleCreateCategory}
                                >
                                    Create
                                </Button>
                            </div>
                        </div>
                    </DropdownMenuItem>
                    {error &&
                        <DropdownMenuItem disabled>{error}</DropdownMenuItem>
                    }
                    {categories.map((category) => (
                        <DropdownMenuItem
                            key={category.id}
                            onClick={() => handleCategorySelect(category)}
                        >
                            {category.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
