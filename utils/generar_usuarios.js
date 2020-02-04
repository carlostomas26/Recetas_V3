const mongoose = require('mongoose');
const Usuario = require(__dirname + '/../models/usuario');
var AES = require("crypto-js/aes");

mongoose.connect('mongodb://localhost:27020/recetasV3');

Usuario.collection.drop();

let usu1 = new Usuario({
    login: 'nacho',
    password: AES.encrypt('12345678', 'secret key 123')
});
usu1.save();

let usu2 = new Usuario({
    login: 'arturo',
    password: AES.encrypt('12345678', 'secret key 123')
});
usu2.save();