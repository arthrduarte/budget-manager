import { useState } from 'react'
import Navbar from './Navbar';

interface LoginProps {
  setToken: (token: string) => void,
  setRegistered: (registered: boolean) => void;
}

export default function Login({ setToken, setRegistered }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await fetch('https://budget-manager-backend.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (data) {
      if (data.error) {
        return setError(data.error)
      }
      setToken(data.accessToken)
    }

  }

  return (
    <div className='flex flex-col items-center p-5'>
      <Navbar/>
      <h1 className='my-5 text-2xl font-bold'>Login</h1>
      <form action="post" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <div className="flex justify-center">
            <span className="bg-red-400 text-white px-4 py-1 w-full text-center rounded-md">{error}</span>
          </div>
        )}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login
        </button>
        <p onClick={() => setRegistered(false)} className='text-center cursor-pointer underline'>Create an account</p>
      </form>
    </div>
  )
}
