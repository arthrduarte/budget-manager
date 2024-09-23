import React, { useEffect, useState } from 'react'
import useToken from '../hooks/useToken'

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

    useEffect(()=>{
        if(logout){
            localStorage.removeItem('token');
            setLogout(false)
            window.location.reload();
        }
    }, [logout])

    return (
        <div className='flex flex-row justify-between w-full'>
            <h1>💸 Budget Tracker</h1>
            <div>
                <p>{data && data[0].first_name}</p>
                {token && <p onClick={() => setLogout(true)}>Logout</p>}
            </div>
        </div>
    )
}
