/*
Ruta: '/api/medicos'
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getProductos, crearProducto, actualizaProducto, borrarProducto, getProductoById } = require('../controllers/productos');

const router = Router();

router.get( '/', validarJWT, getProductos);

router.get( '/:id', validarJWT, getProductoById);

router.post( '/', 
    [
        validarJWT,
        check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
        check('rubro', 'El id del rubro debe ser válido').isMongoId(),
        validarCampos
    ],
    crearProducto
);


router.put( '/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('rubro', 'El id del rubro debe ser válido').isMongoId(),
        validarCampos
    ], 
    actualizaProducto );


router.delete( '/:id', validarJWT, borrarProducto);


module.exports = router;