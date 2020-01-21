//En este fichero se define el esquema para la colección de usuarios

const mongoose = require('mongoose');

let usuarioSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
});
let Usuario = mongoose.model('usuarios', usuarioSchema);

module.exports = Usuario;