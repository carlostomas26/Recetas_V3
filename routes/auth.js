//En este fichero se encuentran los enrutadores asociados a la autenticaciónde usuarios con sus respectivos servicios

const express = require('express'); 
const CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");

let Usuario = require(__dirname + '/../models/usuario.js'); 

let router = express.Router();

router.get('/login', (req, res) => {    
    res.render('auth_login');
});

router.post('/login', (req, res) => {    
    Usuario.find().then(usuarios => {
        let login = req.body.login;
        let password = req.body.password;

        let existeUsuario = usuarios.filter(usuario =>
            usuario.login == login && 
            CryptoJS.AES.decrypt(usuario.password.toString(), 'secret key 123').toString(CryptoJS.enc.Utf8) == password);

        if (existeUsuario.length > 0) {
            req.session.usuario = existeUsuario[0].login;
            res.redirect('/');
        } else {
            res.render('auth_login',
                { mensaje: "Usuario o contraseña incorrectos." });
        }
    }).catch(error => {
        res.render('admin_error');
    });
});

router.get('/logout', (req, res) => {    
    req.session.destroy();    
    res.redirect('/');
});

module.exports = router;