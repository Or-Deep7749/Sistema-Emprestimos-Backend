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
        const conn = await pool.getConnection();
        await conn.query(`
            CREATE TABLE IF NOT EXISTS clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                cpf VARCHAR(14) NOT NULL UNIQUE,
                age INT NOT NULL,
                income DECIMAL(10, 2) NOT NULL,
                location VARCHAR(2) NOT NULL
            );
        `);
        conn.release();
        console.log('Tabela "clientes" verificada/criada com sucesso.');
    } catch (err) {
        console.error('Erro ao criar a tabela clientes:', err);
    }
}

inicializarTabela();
module.exports = pool;
