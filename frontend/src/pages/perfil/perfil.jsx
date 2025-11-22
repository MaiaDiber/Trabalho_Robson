import { useEffect, useState } from "react";
import './Perfil.scss';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const dados = localStorage.getItem("usuario");

    if (dados) {
      setUsuario(JSON.parse(dados));
    }
  }, []);

  if (!usuario) {
    return <p>Carregando dados...</p>;
  }

  return (
    <div className="pagina-perfil">
      <h1>Meu Perfil</h1>

      <div className="card-perfil">
        <div className="avatar">
          {usuario.nome?.charAt(0).toUpperCase()}
        </div>

        <p><strong>Nome:</strong> {usuario.nome}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Telefone:</strong> {usuario.telefone}</p>
      </div>
    </div>
  );
}
