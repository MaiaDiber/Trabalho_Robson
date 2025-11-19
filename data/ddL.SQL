drop database if exists robson;
create database robson;
use robson;

create table Cadastro (
id int primary key auto_increment,
nome varchar(100),
data_nascimento date,
email varchar(50),
senha varchar(10),
tipo ENUM('paciente', 'admin') DEFAULT 'paciente'
);