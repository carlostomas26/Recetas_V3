//En este fichero se encuentran los enrutadores asociados a recetas con sus respectivos servicios
const express = require('express'); 
const multer = require('multer');

let Receta = require(__dirname + '/../models/receta'); 

let autenticacion = require(__dirname + '/../utils/auth'); 

let router = express.Router();

let storage = multer.diskStorage({
    destination: function (req, file, cb) {      
        cb(null, 'public/uploads')    
    },filename: function (req, file, cb) {      
        cb(null, Date.now() + "_" + file.originalname)    
    }  
})
let upload = multer({storage: storage});

router.get('/', autenticacion, (req, res) => {   
    Receta.find()
    .then(resultado => {
        res.render('admin_recetas', {recetas: resultado});
    }).catch(error => {
        res.render('admin_error');
    }) 
});

router.get('/recetas/nueva', autenticacion, (req, res) => {    
    res.render('admin_recetas_form');
});

router.get('/recetas/editar/:id', autenticacion, (req, res) => {
    Receta.findById(req.params['id']).then(resultado => {
        if (resultado)
            res.render('admin_recetas_form', {receta: resultado});
        else    
            res.render('admin_error', {mensaje: "Receta no encontrada"});
    }).catch(error => {
        res.render('admin_error');
    });
});

// Servicio de inserción 
router.post('/recetas', upload.single('imagen'), autenticacion, (req, res) => { 

    let elemento1 = null;
    let elemento2 = null; 
    let elemento3 = null;

    if (req.body.ingrediente1 && req.body.cantidad1 && req.body.unidad1){
        elemento1 = {
            ingrediente: req.body.ingrediente1,
            cantidad: req.body.cantidad1,
            unidad: req.body.unidad1
        }
    };
    if (req.body.ingrediente2 && req.body.cantidad2 && req.body.unidad2){
        elemento2 = {
            ingrediente: req.body.ingrediente2,
            cantidad: req.body.cantidad2,
            unidad: req.body.unidad2
        }
    };
    if (req.body.ingrediente3 && req.body.cantidad3 && req.body.unidad3){
        elemento3 = {
            ingrediente: req.body.ingrediente3,
            cantidad: req.body.cantidad3,
            unidad: req.body.unidad3
        }
    };
    let nuevaReceta = new Receta({
        titulo: req.body.titulo,
        comensales: req.body.comensales,
        preparacion: req.body.preparacion,
        coccion: req.body.coccion,
        descripcion: req.body.descripcion,
        imagen: req.file.filename,
        elementos: [ elemento1, elemento2, elemento3]
        });

    nuevaReceta.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error');
    })
});

// Servicio para modificar recetas 
router.put('/recetas/:id', upload.single('imagen'), autenticacion, (req, res) => {    
    Receta.findByIdAndUpdate(req.params['id'], 
    {$set: {
        titulo: req.body.titulo,
        comensales: req.body.comensales,
        preparacion: req.body.preparacion,
        coccion: req.body.coccion,
        descripcion: req.body.descripcion,
        elementos: [{
            ingrediente: req.body.ingrediente1,
            cantidad: req.body.cantidad1,
            unidad: req.body.unidad1,
        }, {
            ingrediente: req.body.ingrediente2,
            cantidad: req.body.cantidad2,
            unidad: req.body.unidad2,
        }, {
            ingrediente: req.body.ingrediente3,
            cantidad: req.body.cantidad3,
            unidad: req.body.unidad3
        }]
        }}, {new:true}
    ).then(resultado => {
        res.redirect(req.baseUrl);  
    }).catch(error => {
        res.render('admin_error');
    })
});

// Servicio de borrado
router.delete('/recetas/:id', autenticacion, (req, res) => {    
    Receta.findByIdAndRemove(req.params.id)
    .then(resultado => {
        res.redirect(req.baseUrl);  
    }).catch(error => {
        res.render('admin_error');
    })
});

module.exports = router;