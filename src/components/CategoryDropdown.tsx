import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from './ui/input';


interface CategoryDropdownProps {
    setCategory: (category: string) => void,
    category: string,
    categoriesForDropdown: string[]
}

export default function CategoryDropdown({ setCategory, category, categoriesForDropdown }: CategoryDropdownProps) {

    return (
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
                {categoriesForDropdown.map((category, index) => (
                    <DropdownMenuItem
                        key={index}
                        className='flex flex-row'
                    >
                        <div className='w-full' onClick={() => setCategory(category)}>
                            <p>{category}</p>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
