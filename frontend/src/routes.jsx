import { BrowserRouter, Routes, Route } from 'react-router'
import Cadastro from './pages/Cadastro/Cadastro'
import Login from './pages/Login/Entrar'



export default function Navegação () {
    return (
        <BrowserRouter>
        <Routes >
            <Route path='/' element={<Login/>} />
            <Route path='/Cadastrar' element={<Cadastro/>} />
        </Routes>
        </BrowserRouter>
    )
}