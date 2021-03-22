/*
    Ruta: '/api/resenas'
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getResenas, getResenaById, crearResena, actualizaResena, borrarResena } = require('../controllers/resenas');

const router = Router();

router.get( '/', validarJWT, getResenas);

router.get( '/:id', validarJWT, getResenaById);

router.post( '/', 
    [
        validarJWT,
        check('nombre', 'El nombre de la resena es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    crearResena
);


router.put( '/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    actualizaResena );


router.delete( '/:id', validarJWT, borrarResena);


module.exports = router;