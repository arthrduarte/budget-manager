import { useState } from 'react';
import './index.css'
import Login from './components/Login'
import Register from './components/Register'
import useToken from './hooks/useToken';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

function App() {
  const { token, setToken } = useToken()
  const [registered, setRegistered] = useState(true)

  if (!token) {
    if (!registered) {
      return <Register setToken={setToken} setRegistered={setRegistered} />
    }
    return <Login setToken={setToken} setRegistered={setRegistered} />
  }

  return <Dashboard />
  
}

export default App