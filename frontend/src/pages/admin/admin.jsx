import React from 'react';
import { useNavigate } from 'react-router';
import './Admin.scss';

export default function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Usuário deslogado');
    navigate('/Home');
  };

  const handleQuickAction = (action) => {
    alert(`Ação executada: ${action}`);
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Painel Administrativo</h1>
        <div className="admin-actions">
          <button className="btn-secondary" onClick={() => navigate('/Home')}>
            Voltar para Home
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="welcome-section">
          <p className="welcome-message">Bem-vindo à área do administrador!</p>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Usuários</h3>
              <p className="stat-number">1.247</p>
              <span className="stat-trend">+12% este mês</span>
            </div>
            <div className="stat-card">
              <h3>Pedidos</h3>
              <p className="stat-number">356</p>
              <span className="stat-trend">+5% esta semana</span>
            </div>
            <div className="stat-card">
              <h3>Receita</h3>
              <p className="stat-number">R$ 45.678</p>
              <span className="stat-trend">+8% este mês</span>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Ações Rápidas</h2>
          <div className="actions-grid">
            <button 
              className="action-btn"
              onClick={() => handleQuickAction('Gerenciar Usuários')}
            >
              <span className="action-icon"></span>
              Gerenciar Usuários
            </button>
            <button 
              className="action-btn"
              onClick={() => handleQuickAction('Ver Relatórios')}
            >
              <span className="action-icon"></span>
              Ver Relatórios
            </button>
            <button 
              className="action-btn"
              onClick={() => handleQuickAction('Configurações')}
            >
              <span className="action-icon"></span>
              Configurações
            </button>
            <button 
              className="action-btn"
              onClick={() => handleQuickAction('Suporte')}
            >
              <span className="action-icon"></span>
              Suporte
            </button>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Atividade Recente</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">10:30</span>
              <span className="activity-text">Novo usuário registrado</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">09:45</span>
              <span className="activity-text">Pedido #1234 concluído</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">08:15</span>
              <span className="activity-text">Relatório mensal gerado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}