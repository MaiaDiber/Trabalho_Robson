import { connection } from "./conexao.js";

export async function inserirUsuario(usuario) {
    const comando = `
        INSERT INTO Cadastro 
        (nome, data_nascimento, email, senha, tipo)
        VALUES (?, ?, ?, MD5(?), ?)
    `;
    
    const [resposta] = await connection.query(comando, [
        usuario.nome,
        usuario.data_nascimento,
        usuario.email,
        usuario.senha,
        usuario.tipo || 'paciente'
    ]);

    return resposta.insertId;
}

export async function verificarLogin(email, senha) {
    const comando = `
        SELECT 
            id,
            nome,
            email,
            data_nascimento,
            tipo
        FROM Cadastro 
        WHERE email = ? 
        AND senha = MD5(?)
    `;
    
    const [resposta] = await connection.query(comando, [email, senha]);
    return resposta[0];
}

export async function buscarUsuarioPorId(id) {
    const comando = `
        SELECT 
            id,
            nome,
            email,
            data_nascimento,
            tipo
        FROM Cadastro 
        WHERE id = ?
    `;
    
    const [resposta] = await connection.query(comando, [id]);
    return resposta[0];
}

export async function buscarUsuarioPorEmail(email) {
    const comando = `
        SELECT id, email 
        FROM Cadastro 
        WHERE email = ?
    `;
    
    const [resposta] = await connection.query(comando, [email]);
    return resposta[0];
}

export async function listarUsuarios() {
    const comando = `
        SELECT 
            id,
            nome,
            email,
            data_nascimento,
            tipo
        FROM Cadastro 
        ORDER BY nome
    `;
    
    const [resposta] = await connection.query(comando);
    return resposta;
}

export async function listarAdmins() {
    const comando = `
        SELECT 
            id,
            nome,
            email,
            data_nascimento
        FROM Cadastro 
        WHERE tipo = 'admin'
        ORDER BY nome
    `;
    
    const [resposta] = await connection.query(comando);
    return resposta;
}

export async function atualizarUsuario(id, usuario) {
    const comando = `
        UPDATE Cadastro 
        SET nome = ?,
            data_nascimento = ?,
            email = ?
        WHERE id = ?
    `;
    
    const [resposta] = await connection.query(comando, [
        usuario.nome,
        usuario.data_nascimento,
        usuario.email,
        id
    ]);
    
    return resposta.affectedRows;
}

export async function alterarSenha(id, novaSenha) {
    const comando = `
        UPDATE Cadastro 
        SET senha = MD5(?)
        WHERE id = ?
    `;
    
    const [resposta] = await connection.query(comando, [novaSenha, id]);
    return resposta.affectedRows;
}

export async function deletarUsuario(id) {
    const comando = `
        DELETE FROM Cadastro 
        WHERE id = ?
    `;
    
    const [resposta] = await connection.query(comando, [id]);
    return resposta.affectedRows;
}

export async function promoverParaAdmin(id) {
    const comando = `
        UPDATE Cadastro 
        SET tipo = 'admin'
        WHERE id = ?
    `;
    
    const [resposta] = await connection.query(comando, [id]);
    return resposta.affectedRows;
}

export async function rebaixarParaPaciente(id) {
    const comando = `
        UPDATE Cadastro 
        SET tipo = 'paciente'
        WHERE id = ?
    `;
    
    const [resposta] = await connection.query(comando, [id]);
    return resposta.affectedRows;
}