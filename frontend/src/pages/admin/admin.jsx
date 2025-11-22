import React from 'react';
import { useNavigate } from 'react-router';

export default function Admin() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Painel Administrativo</h1>
      <p>Bem-vindo à área do administrador!</p>
      <button onClick={() => navigate('/Home')}>
        Voltar para Home
      </button>
    </div>
  );
}