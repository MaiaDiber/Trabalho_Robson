import { useState, useEffect } from 'react'
import api from '../../axios'
import { useNavigate } from 'react-router'
import './index.scss'

export default function Home() {
    const [usuario, setUsuario] = useState(null)
    const [dadosCompletos, setDadosCompletos] = useState(null)
    const [usuarios, setUsuarios] = useState([])
    const [abaAtiva, setAbaAtiva] = useState('perfil')
    const [carregando, setCarregando] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        carregarDados()
    }, [])

    async function carregarDados() {
        try {
            const token = localStorage.getItem('TOKEN')
            const userStorage = localStorage.getItem('usuario')
            
            if (!token) {
                logout()
                return
            }

            if (userStorage) {
                const userData = JSON.parse(userStorage)
                setUsuario(userData)
            }

            console.log(' Token:', token)
            console.log(' Usuário storage:', userStorage)

           
            const perfilResponse = await api.get('/perfil')
            console.log(' Perfil carregado:', perfilResponse.data)
            setDadosCompletos(perfilResponse.data.data?.usuario)

            
            const userData = JSON.parse(userStorage || '{}')
            if (userData?.tipo === 'admin') {
                console.log(' Carregando lista de usuários...')
                const usuariosResponse = await api.get('/usuarios')
                setUsuarios(usuariosResponse.data.data?.usuarios || [])
            }

        } catch (error) {
            console.error(' Erro ao carregar dados:', error)
            if (error.response?.status === 401) {
                console.log(' Token inválido ou expirado')
                logout()
            } else {
                console.log(' Dados do erro:', error.response?.data)
            }
        } finally {
            setCarregando(false)
        }
    }

    function logout() {
        console.log(' Fazendo logout...')
        localStorage.removeItem('TOKEN')
        localStorage.removeItem('usuario')
        navigate('/')
    }

    async function promoverParaAdmin(userId) {
        try {
            await api.put(`/usuarios/${userId}/promover`, {})
            alert('Usuário promovido a admin!')
            carregarDados()

        } catch (error) {
            alert('Erro: ' + (error.response?.data?.erro || error.message))
        }
    }

    if (carregando) {
        return (
            <div className="loading">
                <div>Carregando...</div>
                <small>Verificando autenticação...</small>
            </div>
        )
    }

    
    if (!usuario) {
        logout()
        return null
    }

    return (
        <div className="home-container">
            
            <header className="home-header">
                <div className="user-welcome">
                    <h1>Olá, {usuario?.nome}! </h1>
                    <span className={`user-type ${usuario?.tipo}`}>
                        {usuario?.tipo}
                    </span>
                </div>
                <button onClick={logout} className="logout-btn">
                    Sair
                </button>
            </header>

            
            <nav className="tabs">
                <button 
                    className={`tab ${abaAtiva === 'perfil' ? 'active' : ''}`}
                    onClick={() => navigate('/Perfil')}
                >
                     Meu Perfil
                </button>
                
                {usuario?.tipo === 'admin' && (
                    <button 
                        className={`tab ${abaAtiva === 'admin' ? 'active' : ''}`}
                        onClick={() => setAbaAtiva('admin')}
                    >
                         Gerenciar Usuários
                    </button>
                )}
            </nav>

            
            <div className="tab-content">
                
                
                {abaAtiva === 'perfil' && dadosCompletos && (
                    <div className="perfil-section">
                        <div className="profile-card">
                            <div className="profile-header">
                                <div className="avatar">
                                    {dadosCompletos.nome.charAt(0).toUpperCase()}
                                </div>
                                <div className="profile-info">
                                    <h2>{dadosCompletos.nome}</h2>
                                    <p>{dadosCompletos.email}</p>
                                </div>
                            </div>

                            <div className="profile-details">
                                <div className="detail-item">
                                    <label>Data de Nascimento:</label>
                                    <span>{new Date(dadosCompletos.data_nascimento).toLocaleDateString('pt-BR')}</span>
                                </div>
                                
                                <div className="detail-item">
                                    <label>Tipo de Conta:</label>
                                    <span className={`badge ${dadosCompletos.tipo}`}>
                                        {dadosCompletos.tipo}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                
                {abaAtiva === 'admin' && usuario?.tipo === 'admin' && (
                    <div className="admin-section">
                        <h3>Painel Administrativo</h3>
                        <p>Total de usuários: {usuarios.length}</p>
                        
                        {usuarios.map(user => (
                            <div key={user.id} className="user-card">
                                <p>{user.nome} - {user.tipo}</p>
                                {user.tipo === 'paciente' && (
                                    <button onClick={() => promoverParaAdmin(user.id)}>
                                        Tornar Admin
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                
                {abaAtiva === 'perfil' && !dadosCompletos && (
                    <div className="error-message">
                        <p> Não foi possível carregar os dados do perfil</p>
                        <button onClick={carregarDados}>Tentar novamente</button>
                    </div>
                )}
            </div>
        </div>
    )
}