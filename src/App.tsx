import { useState } from 'react';
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import useToken from './hooks/useToken';

function App() {
  const { token, setToken } = useToken()
  const [registered, setRegistered] = useState(true)

  if (!token) {
    if(!registered){
      return <Register setToken={setToken} setRegistered={setRegistered}/>  
    }
    return <Login setToken={setToken} setRegistered={setRegistered} />
  }

  return (
    <>
      <h1>Dashboard</h1>
    </>
  )
}

export default App