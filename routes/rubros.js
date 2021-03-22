/*
    Ruta: '/api/hospitales'
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getRubros, crearRubro, actualizaRubro, borrarRubro } = require('../controllers/rubros');

const router = Router();

router.get( '/', [], getRubros);

router.post( '/', 
    [
        validarJWT,
        check('nombre', 'El nombre del rubro es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    crearRubro
);


router.put( '/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    actualizaRubro );


router.delete( '/:id', 
                validarJWT, 
                borrarRubro);


module.exports = router;