import { useEffect, useState } from 'react'
import useToken from '../hooks/useToken'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface UserData {
    first_name: string;
    // add other properties if needed
}

export default function Navbar() {
    const { token } = useToken()
    const [data, setData] = useState<UserData[] | null>(null)
    const [logout, setLogout] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:9000/dashboard', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const data: UserData[] = await response.json()
            setData(data)
        }

        fetchData()
    }, [token])

    useEffect(() => {
        if (logout) {
            localStorage.removeItem('token');
            setLogout(false)
            window.location.reload();
        }
    }, [logout])

    return (
        <div className='flex justify-between items-center'>
            <h1 className='text-green-500 font-bold text-2xl'>💸 Budget Manager</h1>
            {token &&
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className='font-semibold'>{data && data[0].first_name} 👤</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>{token && <p onClick={() => setLogout(true)}>Logout</p>}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            }
        </div>
    )
}
