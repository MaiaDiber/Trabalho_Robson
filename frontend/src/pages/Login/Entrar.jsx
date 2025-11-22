import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../../axios';
import './Entrar.scss';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prevState => ({
        ...prevState,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    }

    return newErrors;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const formErrors = validateForm();
  
  if (Object.keys(formErrors).length === 0) {
    try {
      const body = {
        email: formData.email,
        senha: formData.senha
      };

      console.log('📤 Enviando login...');
      const response = await api.post('/login', body);
      console.log('✅ Login bem-sucedido:', response.data);
      
      const token = response.data.token;
      const usuario = response.data.usuario;

      // Salvar no localStorage
      localStorage.setItem("TOKEN", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      
      alert(response.data.mensagem || 'Login realizado com sucesso!');

      // DEBUG: Verificar antes de redirecionar
      console.log('🔄 Tentando redirecionar...');
      console.log('Usuário:', usuario);
      console.log('Tipo:', usuario.tipo);
      
      // Redirecionar
      if (usuario.tipo === 'admin') {
        console.log('🎯 Indo para Admin');
        navigate('/Admin');
      } else {
        console.log('🎯 Indo para Home');
        navigate('/Home');
      }

    } catch (error) {
      console.error('❌ Erro no login:', error);
      alert('Erro ao fazer login: ' + (error.response?.data?.erro || error.message));
    }
  } else {
    setErrors(formErrors);
  }
  
  setIsSubmitting(false);
};

  const togglePasswordVisivel = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Entrar</h1>
        <p className="login-subtitle">Acesse sua conta para continuar</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="seu@email.com"
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="senha" className="form-label">
              Senha
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className={`form-input ${errors.senha ? 'error' : ''}`}
                placeholder="Digite sua senha"
                disabled={isSubmitting}
              />
              <button 
                type="button"
                onClick={togglePasswordVisivel}
                className="toggle-password-btn"
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" y1="2" x2="22" y2="22"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.senha && <span className="error-message">{errors.senha}</span>}
          </div>

          <button 
            type="submit" 
            className={`submit-button ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-links">
         
          
          <div className="register-link">
            <p>Não tem uma conta? 
              <button 
                onClick={() => navigate('/Cadastrar')} 
                className="link-button"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}                                                   