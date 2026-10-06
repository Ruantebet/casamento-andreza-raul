require('dotenv').config();

const express = require('express');
const path = require('path');

const indexRoutes = require('./routes/index');
const { inicializarBanco } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', indexRoutes);

async function iniciarServidor() {
    try {
        await inicializarBanco();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (erro) {
        console.error('Erro ao iniciar o servidor:', erro);
        process.exit(1);
    }
}

iniciarServidor();