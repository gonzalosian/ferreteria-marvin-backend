// response me puede servir para definir el tipo, por ejemplo, si no viene la res (response), ponemos un valor por default
const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res) => {

    // Paginación
    const desde = Number( req.query.desde ) || 0;
    // console.log(desde);

    // // const usuarios = await Usuario.find({}, 'nombre email role google');
    // const usuarios = await Usuario.find({}, 'nombre email role google')
    //                             .skip( desde )
    //                             .limit(5);

    // const total = await Usuario.count();

    const [ usuarios, total ] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip( desde )
            .limit(5),

        // Usuario.count() // se dejó de usar
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        msg: 'GET Usuarios',
        usuarios,
        uid: req.uid, // Usuario que consultó, gracias a token válido
        total
    })
}


const crearUsuario = async(req, res = response) => {

    // console.log(req.body);
    const { email, password } = req.body;

    try {
        const existeUsuario = await Usuario.findOne({ email });

        if( existeUsuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );
    
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        // Guardar usuario
        await usuario.save();

        // Generar el token - JWT
        const token = await generarJWT( usuario.id );
    
        // En Express, el res.json() solo se puede llamar una única vez.
        res.json({
            ok: true,
            msg: 'POST Usuario',
            usuario,
            token
        })
        
    } catch (error) {
        console.error(error);
        // gracias a definirle valor por default, me ayuda con el intellisense
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...revisar logs'
        });
    }
    
}


const actualizaUsuario = async(req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto
    
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        // Actualizaciones
        // const campos = req.body;
        // Si desestructuramos, podemos eliminar directamente los campos innecesarios como pass y google
        const { password, google, email, ...campos } = req.body;

        // Si el usuario no está actualizando su email, tirará error por campo único, por lo que lo borramos para evitarlo
        if( usuarioDB.email !== email ){
            // verificamos si existe en otro usuario
            const existeEmail = await Usuario.findOne({ email });
            if( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        
        // delete campos.password; // eliminamos el pass para no sobreescribirlo
        // delete campos.google;
        
        // Modificaremos el email unicamente si no es un usuario de google
        if( !usuarioDB.google ){
            campos.email = email;
        } else if ( usuarioDB.email !== email ){
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de Google no pueden cambiar su correo'
            });
        }
        
        // findByIdAndUpdate: tenemos la opción de pedir que siempre nos devuelva el usuario actualizado { new: true }
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            msg: 'PUT Usuario',
            usuario: usuarioActualizado
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado al actualizar...revisar logs'
        });
    }
}


// Esto se implementa a mero ejemplo, ya que conviene dar de baja al usuario, modificarlo, para no perder referencias.
const borrarUsuario = async(req, res = response) => {
    
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );
        
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado al eliminar...revisar logs'
        })
    }
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizaUsuario,
    borrarUsuario
}