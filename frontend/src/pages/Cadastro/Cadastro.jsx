import React, { useState } from 'react';
import './Register.scss';

export default function Cadastro()  {
     const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    email: '',
    senha: '',
    tipoUsuario: 'usuario'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prevState => ({
        ...prevState,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validação do nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validação da data de nascimento
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else {
      const birthDate = new Date(formData.dataNascimento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13) {
        newErrors.dataNascimento = 'Você deve ter pelo menos 13 anos';
      }
    }

    // Validação do email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação da senha
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      // Simular envio para API
      try {
        console.log('Dados do formulário:', formData);
        // Aqui você faria a chamada para sua API
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Cadastro realizado com sucesso!');
        // Limpar formulário após sucesso
        setFormData({
          nome: '',
          dataNascimento: '',
          email: '',
          senha: '',
          tipoUsuario: 'usuario'
        });
      } catch (error) {
        alert('Erro ao realizar cadastro. Tente novamente.');
      }
    } else {
      setErrors(formErrors);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Criar Conta</h1>
        <p className="register-subtitle">Preencha os dados abaixo para se cadastrar</p>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="nome" className="form-label">
              Nome Completo *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`form-input ${errors.nome ? 'error' : ''}`}
              placeholder="Digite seu nome completo"
            />
            {errors.nome && <span className="error-message">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dataNascimento" className="form-label">
              Data de Nascimento *
            </label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              className={`form-input ${errors.dataNascimento ? 'error' : ''}`}
            />
            {errors.dataNascimento && <span className="error-message">{errors.dataNascimento}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="seu@email.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="senha" className="form-label">
              Senha *
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={`form-input ${errors.senha ? 'error' : ''}`}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.senha && <span className="error-message">{errors.senha}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Usuário</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="tipoUsuario"
                  value="usuario"
                  checked={formData.tipoUsuario === 'usuario'}
                  onChange={handleChange}
                />
                <span className="radio-label">Usuário</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="tipoUsuario"
                  value="admin"
                  checked={formData.tipoUsuario === 'admin'}
                  onChange={handleChange}
                />
                <span className="radio-label">Administrador</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className={`submit-button ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>

        <div className="login-link">
          <p>Já tem uma conta? <a href="/login">Faça login</a></p>
        </div>
      </div>
    </div>
  );
};


