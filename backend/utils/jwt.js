import jwt from 'jsonwebtoken';

const JWT_SECRET = 'ViaSaúde';  

export function getAuthentication() {
    return (req, resp, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return resp.status(401).send({ 
                    erro: 'Acesso negado. Token não fornecido.' 
                });
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            
            
            req.user = {
                id: decoded.id,
                nome: decoded.nome,
                email: decoded.email,
                tipo: decoded.tipo
            };

            next();

        } catch (err) {
            console.error('Erro na autenticação:', err);
            
            if (err.name === 'JsonWebTokenError') {
                return resp.status(401).send({ 
                    erro: 'Token inválido' 
                });
            }
            
            if (err.name === 'TokenExpiredError') {
                return resp.status(401).send({ 
                    erro: 'Token expirado' 
                });
            }

            return resp.status(500).send({ 
                erro: 'Erro na autenticação' 
            });
        }
    };
}


export function verificarAdmin() {
    return (req, resp, next) => {
        try {
            if (req.user.tipo !== 'admin') {
                return resp.status(403).send({ 
                    erro: 'Acesso negado. Apenas administradores podem acessar este recurso.' 
                });
            }

            next();

        } catch (err) {
            console.error('Erro na verificação de admin:', err);
            return resp.status(500).send({ 
                erro: 'Erro na verificação de permissões' 
            });
        }
    };
}


export function gerarToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verificarToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido');
    }
}


export function decodificarToken(token) {
    return jwt.decode(token);
}

export default {
    getAuthentication,
    verificarAdmin,
    gerarToken,
    verificarToken,
    decodificarToken
};