const { response } = require('express')
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = ( req, res = response, next ) => {

    // Leer el token
    const token = req.header('x-token');
    console.log( `validarJWT(): ${token}`);

    if( !token ){
        res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        })
    }
    
    try {
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        // Si nos muestra el ID del user, es porque el token se verificó correctamente
        console.log(`try en validarJWT: ${uid}`);
        // en la request devolveremos el usuario que hace la petición, para mostrarlo
        req.uid = uid;

    } catch (error) {
        console.error(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();

}

const validarADMIN_ROLE = async( req, res = response, next ) => {

    const uid = req.uid;
    // console.log(`validarADMIN_ROLE: ${uid}`);
    try {
        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if( usuarioDB.role !== 'ADMIN_ROLE' ){
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }

        next();
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el ADMIN'
        })
    }
}


const validarADMIN_ROLE_o_MismoUsuario = async( req, res = response, next ) => {

    const uid = req.uid;
    const id = req.params.uid;
    console.log(`validarADMIN_ROLE_o_MismoUsuario: ${uid} - ${id}`);
    try {
        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        // Lo idea ubiese sido crear una nueva ruta para la actualización de un mismo usuario
        if( usuarioDB.role === 'ADMIN_ROLE' || uid === id ){
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el ADMIN'
        })
    }
}


module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario,
}