import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './lib/utils/ProtectedRoute'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import LayoutAuth from './lib/layout/LayoutAuth'
import Layout from './lib/layout/Layout'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutAuth />}>
          <Route element={<Login />} path='/login' />
          <Route element={<Register />} path='/register' />
        </Route>
        <Route element={<Layout />} >
          <Route element={<ProtectedRoute />}>
            <Route element={<Home />} path='/' />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
