const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
};

async function inicializarBanco() {
    const connection = await mysql.createConnection(dbConfig);
    const dbName = process.env.DB_NAME;
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Banco de dados "${dbName}" verificado/criado com sucesso.`);
    await connection.end();
}

inicializarBanco().catch(err => {
    console.error('Erro ao inicializar o banco de dados:', err);
});

const poolConfig = {
    ...dbConfig,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const pool = mysql.createPool(poolConfig);
async function inicializarTabela() {
    try {
        await pool.query(`DROP TABLE IF EXISTS clientes;`);
        await pool.query(`
            CREATE TABLE clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                cpf VARCHAR(14) NOT NULL UNIQUE,
                idade INT NOT NULL,
                renda DECIMAL(10, 2) NOT NULL,
                estado VARCHAR(2) NOT NULL
            );
        `);
        console.log('Tabela "clientes" recriada com sucesso com os campos em português.');
    } catch (err) {
        console.error('Erro ao criar a tabela clientes:', err);
    }
}

inicializarTabela();
module.exports = pool;
