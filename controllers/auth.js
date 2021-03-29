const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');


const login = async( req, res = response ) => {

    const { email, password } = req.body;

    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({email});

        if( !usuarioDB ){
            res.status(404).json({
                ok: false,
                msg: '1-Email o contraseña no válida.'
            })
        };

        // Verificar contraseña
        const validPass = bcrypt.compareSync( password, usuarioDB.password );
        
        if( !validPass ){
            res.status(400).json({
                ok: false,
                msg: '2-Email o contraseña no válida.'
            })
        };

        // Generar el token - JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            msg: 'Logueado',
            token,
            menu: getMenuFrontEnd( usuarioDB.role )
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Comunicarse con el Administrador'
        })
    }
}


const googleSignIn = async( req, res = response ) => {
    const googleToken = req.body.token;
    console.log(`googleToken: ${googleToken}`);

    try {
        // Verificamos el token
        const { name, email, picture } = await googleVerify( googleToken );

        console.log(`googleVerify(): ${name} - ${email} - ${picture} `);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        console.log(`usuarioDB - ${usuarioDB}`);

        if( !usuarioDB ){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true,
            })
        } else{
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
            usuario.password = '@@@'; // de esta forma pierde la autentificación mediante usuario tradicional.
        }

        console.log(`usuario: ${usuario}`);

        // Guardar en DB
        await usuario.save();
        
        // Generar el token - JWT
        const token = await generarJWT( usuario.id );

        console.log(`token de generarJWT(): ${token}`);

        res.json({
            ok: true,
            msg: 'Google SignIn',
            // googleToken,
            // name, email, picture
            token,
            menu: getMenuFrontEnd( usuario.role )
        });
        
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token incorrecto',
        });
    }
}


// Lo utilizaremos para verificar si el token aun es válido. Sino, lo renovamos.
const renewToken = async( req, res = response ) => {
    // el req viene en el header
    const uid = req.uid;
    // Generar el token - JWT
    const token = await generarJWT( uid );
    // Obtener el usuario por UID
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        msg: 'Token re-validado',
        // uid,
        token,
        usuario,
        menu: getMenuFrontEnd( usuario.role )
    })
}


module.exports = {
    login,
    googleSignIn,
    renewToken
}