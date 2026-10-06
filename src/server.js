const express = require('express');
const path = require('path');
const indexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRoutes);

app.listen(PORT, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
