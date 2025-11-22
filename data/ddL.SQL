DROP DATABASE IF EXISTS robson;
CREATE DATABASE robson;
USE robson;

CREATE TABLE Cadastro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(32) NOT NULL, 
    tipo ENUM('paciente', 'admin') DEFAULT 'paciente',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);