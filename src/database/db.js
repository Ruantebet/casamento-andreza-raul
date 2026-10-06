const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function inicializarBanco() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS convidados (
            id SERIAL PRIMARY KEY,
            nome TEXT NOT NULL,
            email TEXT,
            confirmacao BOOLEAN DEFAULT FALSE,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('PostgreSQL conectado.');
    console.log('Tabela convidados verificada.');
}

module.exports = {
    pool,
    inicializarBanco
};