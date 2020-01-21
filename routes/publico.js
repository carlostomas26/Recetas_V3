//En este fichero se encuentran los enrutadores asociados a la parte pública de la aplicación con sus respectivos servicios

const express = require('express'); 

let Receta = require(__dirname + '/../models/receta.js'); 

let router = express.Router();


router.get('/', (req, res) => {   
    res.render('publico_index');
});

router.post('/buscar', (req, res) => {    
    Receta.find().then(resultado => {
        let existeReceta = resultado.filter(recetas =>
            recetas.titulo.toLowerCase().includes(req.body.titulo.toLowerCase()));
        if (existeReceta.length > 0 && req.body.titulo.length > 0) {
            res.render('publico_index', 
                { recetas: existeReceta });
        } else {
            res.render('publico_index',
                { mensaje: "No se encontraron recetas." });
        }
    }).catch(error => {
        res.render('publico_error');
    }) 
});

router.get('/receta/:id', (req, res) => {
    Receta.findById(req.params['id']) 
    .then(resultado => {
        if(resultado)
            res.render('publico_receta', { receta: resultado });
        else
            res.render('publico_error', {mensaje: "Receta no encontrada"});
    }).catch(error => {
        res.render('publico_error');
    })    
});

module.exports = router;