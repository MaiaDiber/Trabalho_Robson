import * as repo from '../Repository/pessoasRepository.js';
import jwt from 'jsonwebtoken';
import { Router } from "express";
import { getAuthentication, verificarAdmin } from '../../utils/jwt.js';

const endpoints = Router();
const autenticador = getAuthentication();
const verificadorAdmin = verificarAdmin();

endpoints.post('/cadastrar', async (req, resp) => {
    try {
        const dados = req.body;

        if (!dados.nome || !dados.data_nascimento || !dados.email || !dados.senha) {
            return resp.status(400).send({ 
                erro: 'Preencha todos os campos obrigatórios: nome, data_nascimento, email e senha' 
            });
        }

        const emailExistente = await repo.buscarUsuarioPorEmail(dados.email);
        if (emailExistente) {
            return resp.status(409).send({ 
                erro: 'Este email já está cadastrado' 
            });
        }

        const dataNasc = new Date(dados.data_nascimento);
        const hoje = new Date();
        const idade = hoje.getFullYear() - dataNasc.getFullYear();
        
        if (idade < 13) {
            return resp.status(400).send({ 
                erro: 'Usuário deve ter pelo menos 13 anos' 
            });
        }

        const idUsuario = await repo.inserirUsuario({
            nome: dados.nome,
            data_nascimento: dados.data_nascimento,
            email: dados.email,
            senha: dados.senha,
            tipo: dados.tipo || 'paciente'
        });

        resp.send({ 
            mensagem: 'Usuário cadastrado com sucesso!',
            idUsuario: idUsuario
        });

    } catch (err) {
        console.error('Erro ao cadastrar:', err);
        resp.status(500).send({ erro: 'Erro interno ao cadastrar usuário' });
    }
});

endpoints.post('/login', async (req, resp) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return resp.status(400).send({ erro: 'Informe email e senha' });
        }

        const usuario = await repo.verificarLogin(email, senha);

        if (!usuario) {
            return resp.status(401).send({ erro: 'Email ou senha incorretos' });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            },
            'ViaSaúde',
            { expiresIn: '24h' }
        );

        resp.send({
            mensagem: 'Login realizado com sucesso',
            token: token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                data_nascimento: usuario.data_nascimento
            }
        });

    } catch (err) {
        console.error('Erro no login:', err);
        resp.status(500).send({ erro: 'Erro ao realizar login' });
    }
});

endpoints.get('/perfil', autenticador, async (req, resp) => {
    try {
        const idUsuario = req.user.id;

        const usuario = await repo.buscarUsuarioPorId(idUsuario);
        if (!usuario) {
            return resp.status(404).send({ erro: 'Usuário não encontrado' });
        }

        resp.send(usuario);

    } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        resp.status(500).send({ erro: 'Erro ao buscar dados do perfil' });
    }
});

endpoints.put('/perfil', autenticador, async (req, resp) => {
    try {
        const idUsuario = req.user.id;
        const { nome, email, data_nascimento } = req.body;

        if (!nome || !email || !data_nascimento) {
            return resp.status(400).send({
                erro: 'Nome, email e data de nascimento são obrigatórios',
            });
        }

        const usuarioComEmail = await repo.buscarUsuarioPorEmail(email);
        if (usuarioComEmail && usuarioComEmail.id !== idUsuario) {
            return resp.status(409).send({ 
                erro: 'Este email já está em uso por outro usuário' 
            });
        }

        const linhasAfetadas = await repo.atualizarUsuario(idUsuario, {
            nome: nome,
            email: email,
            data_nascimento: data_nascimento
        });

        if (linhasAfetadas > 0) {
            resp.send({ mensagem: 'Perfil atualizado com sucesso!' });
        } else {
            resp.status(404).send({ erro: 'Usuário não encontrado' });
        }

    } catch (err) {
        console.error('Erro ao atualizar perfil:', err);
        resp.status(500).send({ erro: 'Erro ao atualizar perfil' });
    }
});

endpoints.put('/perfil/senha', autenticador, async (req, resp) => {
    try {
        const idUsuario = req.user.id;
        const { senha_atual, nova_senha } = req.body;

        if (!senha_atual || !nova_senha) {
            return resp.status(400).send({
                erro: 'Senha atual e nova senha são obrigatórias',
            });
        }

        const usuario = await repo.verificarLogin(req.user.email, senha_atual);
        if (!usuario) {
            return resp.status(401).send({ 
                erro: 'Senha atual incorreta' 
            });
        }

        const linhasAfetadas = await repo.alterarSenha(idUsuario, nova_senha);

        if (linhasAfetadas > 0) {
            resp.send({ mensagem: 'Senha alterada com sucesso!' });
        } else {
            resp.status(404).send({ erro: 'Usuário não encontrado' });
        }

    } catch (err) {
        console.error('Erro ao alterar senha:', err);
        resp.status(500).send({ erro: 'Erro ao alterar senha' });
    }
});

endpoints.get('/usuarios', autenticador, verificadorAdmin, async (req, resp) => {
    try {
        const usuarios = await repo.listarUsuarios();
        resp.send(usuarios);
    } catch (err) {
        console.error('Erro ao listar usuários:', err);
        resp.status(500).send({ erro: 'Erro ao listar usuários' });
    }
});

endpoints.get('/admins', autenticador, verificadorAdmin, async (req, resp) => {
    try {
        const admins = await repo.listarAdmins();
        resp.send(admins);
    } catch (err) {
        console.error('Erro ao listar admins:', err);
        resp.status(500).send({ erro: 'Erro ao listar administradores' });
    }
});

endpoints.put('/usuarios/:id/promover', autenticador, verificadorAdmin, async (req, resp) => {
    try {
        const idUsuario = req.params.id;

        const linhasAfetadas = await repo.promoverParaAdmin(idUsuario);

        if (linhasAfetadas > 0) {
            resp.send({ mensagem: 'Usuário promovido a administrador com sucesso!' });
        } else {
            resp.status(404).send({ erro: 'Usuário não encontrado' });
        }

    } catch (err) {
        console.error('Erro ao promover usuário:', err);
        resp.status(500).send({ erro: 'Erro ao promover usuário' });
    }
});

endpoints.put('/usuarios/:id/rebaixar', autenticador, verificadorAdmin, async (req, resp) => {
    try {
        const idUsuario = req.params.id;

        if (idUsuario == req.user.id) {
            return resp.status(400).send({ 
                erro: 'Você não pode rebaixar a si mesmo' 
            });
        }

        const linhasAfetadas = await repo.rebaixarParaPaciente(idUsuario);

        if (linhasAfetadas > 0) {
            resp.send({ mensagem: 'Administrador rebaixado para paciente com sucesso!' });
        } else {
            resp.status(404).send({ erro: 'Usuário não encontrado' });
        }

    } catch (err) {
        console.error('Erro ao rebaixar usuário:', err);
        resp.status(500).send({ erro: 'Erro ao rebaixar usuário' });
    }
});

endpoints.delete('/usuarios/:id', autenticador, verificadorAdmin, async (req, resp) => {
    try {
        const idUsuario = req.params.id;

        if (idUsuario == req.user.id) {
            return resp.status(400).send({ 
                erro: 'Você não pode deletar a sua própria conta' 
            });
        }

        const linhasAfetadas = await repo.deletarUsuario(idUsuario);

        if (linhasAfetadas > 0) {
            resp.send({ mensagem: 'Usuário deletado com sucesso!' });
        } else {
            resp.status(404).send({ erro: 'Usuário não encontrado' });
        }

    } catch (err) {
        console.error('Erro ao deletar usuário:', err);
        resp.status(500).send({ erro: 'Erro ao deletar usuário' });
    }
});

export default endpoints;