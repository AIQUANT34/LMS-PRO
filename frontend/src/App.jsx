
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/Home'
import { AuthProvider } from './context/AuthContext'

// import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  
  return (
    
       <BrowserRouter>
         <AuthProvider>
         <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashboard />} />
          </Routes>
         </AuthProvider>
       </BrowserRouter>
    
  )
}

export default App
