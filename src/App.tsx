import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import LayoutAuth from './layout/LayoutAuth'
import Layout from './layout/Layout'
import Board from './pages/board'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutAuth />}>
          <Route element={<Login />} path='/kaban-board/login' />
          <Route element={<Register />} path='/kaban-board/register' />
        </Route>
        <Route element={<Layout />} >
          <Route element={<ProtectedRoute />}>
            <Route element={<Home />} path='/kaban-board' />
            <Route element={<Board />} path='/kaban-board/board/:boardId' />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
