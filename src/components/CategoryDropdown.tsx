import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';


interface Category {
    id: number;
    name: string;
    type: string;
}

interface CategoryDropdownProps {
    setCategoryId: (id: string) => void,
    category_id: string,
    categories: Category[]
}

export default function CategoryDropdown({ setCategoryId, categories, category_id }: CategoryDropdownProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        categories.find(category => category.id.toString() === category_id) || null
    );

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        setCategoryId(category.id.toString());
    };


    return (
        <div className="w-1/4 mx-1 h-full">
            <DropdownMenu>
                <DropdownMenuTrigger className='w-full h-full'>
                    <Button className='w-full h-full'>
                        {selectedCategory ? selectedCategory.name : "Select Category"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
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
        // <div className="w-1/4 mx-1">
        //     <select
        //         name="category"
        //         className="p-1 border rounded w-full"
        //         onChange={e => setCategoryId(e.target.value)}
        //     >
        //         <option value="" disabled selected>Select Category</option>
        //         {categories.map((category) => (
        //             <option key={category.id} value={category.id}>{category.name}</option>
        //         ))}
        //     </select>
        // </div>
    )
}
