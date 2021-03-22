/*
    Ruta: '/api/todo/:busqueda'
*/

const { Router } = require('express');
// const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getTodo, getDocumentoColeccion } = require('../controllers/busquedas');

const router = Router();


router.get( '/:busqueda', 
    [
        validarJWT,
        // check('nombre', 'El nombre del médico es obligatorio').not().isEmpty(),
        // validarCampos
    ], 
    getTodo
);

router.get( '/coleccion/:tabla/:busqueda', validarJWT, getDocumentoColeccion );


module.exports = router;