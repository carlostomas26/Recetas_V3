//Este fichero contiene el servidor que se encarga principalmente de cargar los enrutadores y conectar con la 
//base de datos

// Librerías externas
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const session = require('express-session');
const methodOverride = require('method-override');

// Enrutadores
const auth = require(__dirname + '/routes/auth');
const publico = require(__dirname + '/routes/publico');
const recetas = require(__dirname + '/routes/recetas');

// Conexión con la BD
mongoose.connect('mongodb://localhost:27017/recetasV3',    
    {useNewUrlParser: true});

// Servidor Express
let app = express();

// Inicializamos sesión
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false,
    expires: new Date(Date.now() + (30 * 60 * 1000))
}));

// Inicializamos Nunjucks
app.set('view engine', 'njk');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Carga de middleware y enrutadores
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/public', express.static(__dirname + '/public'));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object'        
        && '_method'in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;    
    } 
}));
app.use('/auth', auth);
app.use('/recetas', recetas); 
app.use('/', publico);

// Puesta en marcha del servidor
app.listen(8080);