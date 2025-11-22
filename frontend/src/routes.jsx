import { BrowserRouter, Routes, Route } from 'react-router'
import Cadastro from './pages/Cadastro/Cadastro'
import Login from './pages/Login/Entrar'
import Home from './pages/home'
import Admin from './pages/admin/admin.jsx'
import Perfil from './pages/perfil/perfil.jsx'



export default function Navegação () {
    return (
        <BrowserRouter>
        <Routes >
            <Route path='/' element={<Login/>} />
            <Route path='/Cadastrar' element={<Cadastro/>} />
            <Route path='/Home' element={<Home/>} />
            <Route path='/Admin' element={<Admin/>} />
            <Route path='/Perfil' element={<Perfil/>} />
        </Routes>
        </BrowserRouter>
    )
}