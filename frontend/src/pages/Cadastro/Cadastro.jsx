import { useState } from 'react'
import api from '../../axios'
import { useNavigate } from 'react-router'
import './Cadastro.scss'

export default function Cadastro() {
    const [nome, setNome] = useState('')
    const [dataNascimento, setDataNascimento] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [tipoUsuario, setTipoUsuario] = useState('paciente')
    const [showPassword, setShowPassword] = useState(false)
    const [erros, setErros] = useState({})
    const [carregando, setCarregando] = useState(false)

    const navigate = useNavigate()

    function validarCampos() {
        const novosErros = {}

        if (!nome.trim()) 
            novosErros.nome = "Informe o nome completo"
        else if (nome.trim().length < 2)
            novosErros.nome = "Nome deve ter pelo menos 2 caracteres"

        if (!dataNascimento) 
            novosErros.dataNascimento = "Informe a data de nascimento"
        else {
            const birthDate = new Date(dataNascimento)
            const today = new Date()
            const age = today.getFullYear() - birthDate.getFullYear()
            if (age < 13) 
                novosErros.dataNascimento = "Você deve ter pelo menos 13 anos"
        }

        if (!email.trim()) 
            novosErros.email = "Informe o e-mail"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            novosErros.email = "E-mail inválido"

        if (!senha.trim()) 
            novosErros.senha = "Informe a senha"
        else if (senha.length < 6)
            novosErros.senha = "Senha deve ter pelo menos 6 caracteres"

        setErros(novosErros)
        return Object.keys(novosErros).length === 0
    }

    async function cadastrar() {
        try {
            if (!validarCampos()) {
                alert("Por favor, corrija os erros no formulário.")
                return
            }

            setCarregando(true)

            const body = {
                "nome": nome,
                "data_nascimento": dataNascimento,
                "email": email,
                "senha": senha,
                "tipo": tipoUsuario
            }

            const response = await api.post('/cadastrar', body)
            
            alert(response.data.mensagem || 'Cadastro realizado com sucesso!')
            
            // Limpar formulário
            setNome('')
            setDataNascimento('')
            setEmail('')
            setSenha('')
            setTipoUsuario('paciente')

            // Redirecionar para login
            setTimeout(() => {
                navigate('/')
            }, 1500)

        } catch (error) {
            alert('Erro ao cadastrar: ' + (error.response?.data?.erro || error.message))
        } finally {
            setCarregando(false)
        }
    }

    const togglePasswordVisivel = () => {
        setShowPassword(!showPassword)
    }

    const limparErro = (campo) => {
        if (erros[campo]) {
            setErros({ ...erros, [campo]: '' })
        }
    }

    return (
        <section className='all-cadastro'>
            <section className='container-cadastro'>
                <img className='logosite-cadastro' src='/assets/Images/logo_ViaSaúde.png' height={70} alt='' />
                <div className='Cadastro'>
                    <div className='Cadastro-linha'>
                        <h1>Cadastro</h1>
                        <div className='linha-cadastro'></div>
                    </div>

                    <div className="dados-cadastro">
                        <label> 
                            <p>Nome Completo *</p>
                            <input 
                                type="text" 
                                placeholder='Insira seu nome completo' 
                                value={nome}
                                onChange={(e) => {
                                    setNome(e.target.value)
                                    limparErro('nome')
                                }}
                                className={erros.nome ? 'erro' : ''}
                                disabled={carregando}
                            />
                            {erros.nome && (
                                <span className="msg-erro">{erros.nome}</span>
                            )}
                        </label>
                        
                        <label> 
                            <p>Data de Nascimento *</p>
                            <input 
                                type="date" 
                                value={dataNascimento}
                                onChange={(e) => {
                                    setDataNascimento(e.target.value)
                                    limparErro('dataNascimento')
                                }}
                                className={erros.dataNascimento ? 'erro' : ''}
                                disabled={carregando}
                            />
                            {erros.dataNascimento && (
                                <span className="msg-erro">{erros.dataNascimento}</span>
                            )}
                        </label>

                        <label> 
                            <p>E-mail *</p>
                            <input 
                                type="email" 
                                placeholder='Insira seu e-mail' 
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    limparErro('email')
                                }}
                                className={erros.email ? 'erro' : ''}
                                disabled={carregando}
                            />
                            {erros.email && (
                                <span className="msg-erro">{erros.email}</span>
                            )}
                        </label>
                        
                        <label> 
                            <p>Senha *</p>
                            <div className="password-input-container">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={senha}
                                    onChange={(e) => {
                                        setSenha(e.target.value)
                                        limparErro('senha')
                                    }}
                                    placeholder='Mínimo 6 caracteres'
                                    className={erros.senha ? 'erro' : ''}
                                    disabled={carregando}
                                />
                                
                                <button 
                                    onClick={togglePasswordVisivel} 
                                    type='button' 
                                    className="toggle-password-btn"
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                    disabled={carregando}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        {showPassword ? (
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                                                <line x1="2" y1="2" x2="22" y2="22"/>
                                            </svg>
                                        ) : (
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </svg>
                                </button>
                            </div>
                            {erros.senha && (
                                <span className="msg-erro">{erros.senha}</span>
                            )}
                        </label>

                        <label className="tipo-usuario">
                            <p>Tipo de Usuário</p>
                            <div className="radio-group">
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="tipoUsuario"
                                        value="paciente"
                                        checked={tipoUsuario === 'paciente'}
                                        onChange={(e) => setTipoUsuario(e.target.value)}
                                        disabled={carregando}
                                    />
                                    <span>Paciente</span>
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="tipoUsuario"
                                        value="admin"
                                        checked={tipoUsuario === 'admin'}
                                        onChange={(e) => setTipoUsuario(e.target.value)}
                                        disabled={carregando}
                                    />
                                    <span>Administrador</span>
                                </label>
                            </div>
                        </label>
                    </div>

                    <button 
                        onClick={cadastrar} 
                        className="btn-cadastrar"
                        disabled={carregando}
                    >
                        <p>{carregando ? 'Cadastrando...' : 'Cadastrar'}</p>
                    </button>

                    <div className="jatemconta">
                        <p>Já tem uma conta?</p>
                        <button onClick={() => navigate('/')}> 
                            Fazer Login
                        </button>
                    </div>
                </div>
            </section>
        </section>
    )
}