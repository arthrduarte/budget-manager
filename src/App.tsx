import './App.css'
import Login from './components/Login'
import useToken from './hooks/useToken';

function App() {
  const { token, setToken } = useToken()

  if (!token) {
    return <Login setToken={setToken} />
  }

  return (
    <>
      <h1>Dashboard</h1>
    </>
  )
}

export default App
