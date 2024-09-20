import React, { useEffect, useState } from 'react'
import useToken from '../hooks/useToken'

interface UserData {
    first_name: string;
    // add other properties if needed
}

export default function Navbar() {
    const { token } = useToken()
    const [data, setData] = useState<UserData[] | null>(null)

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
    }, [])

    return (
        <div className='flex flex-row justify-between w-full'>
            <h1>💸 Budget Tracker</h1>
            <h1>{data && data[0].first_name}</h1>
        </div>
    )
}
