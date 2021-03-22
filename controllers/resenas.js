// response me puede servir para definir el tipo, por ejemplo, si no viene la res (response), ponemos un valor por default
const { response } = require('express');

const Resena = require('../models/resena');


const getResenas = async(req, res = response) => {

    // Paginación
    const desde = Number( req.query.desde ) || 0;

    // const hospitales = await Hospital.find({}, 'nombre img usuario');

    // const noticias = await Resena.find()
    //                             .populate('usuario', 'nombre img')
    //                             .limit(4)

    const [ resenas, total ] = await Promise.all([
        Resena.find()
            .populate('usuario', 'nombre img')
            .skip( desde )
            .limit(5),

        // Usuario.count() // se dejó de usar
        Resena.countDocuments()
    ]);

    res.json({
        ok: true,
        msg: 'GET Resenas',
        resenas,
        total
        // uid: req.uid, // Usuario que consultó, gracias a token válido
    })
}


const getResenaById = async(req, res = response) => {

    const id = req.params.id;
    // console.log(id);

    try {
        const resena = await Resena.findById(id)
                                    .populate('usuario', 'nombre img');
        
        // console.log(resena);
    
        res.json({
            ok: true,
            msg: 'GET Resena By Id',
            resena,
        })
        
    } catch (error) {
        console.log(error);
        
        res.json({
            ok: false,
            msg: 'Hable con el Administrador',
        })
    }
}


const crearResena = async(req, res = response) => {
    // console.log(req.body);
    const { nombre } = req.body;

    try {
        const existeResena = await Resena.findOne({ nombre });

        if( existeResena ){
            return res.status(400).json({
                ok: false,
                msg: 'El nombre de la resena ya está registrado'
            });
        }

        // Después de pasar por la validación del token, siempre tendremos el uid
        const uid = req.uid;
        const resena = new Resena( {
            usuario: uid,
            ...req.body
        } );
    
        // Guardar usuario
        await resena.save();

        res.json({
            ok: true,
            msg: 'POST Resena',
            resena,
            // token
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

const actualizaResena = async(req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto
    
    const id = req.params.id;
    const uid = req.uid;

    try {

        const resenaDB = await Resena.findById( id );

        if( !resenaDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe una resena con ese id'
            });
        }

        // Actualizaciones
        const cambiosResena = {
            ...req.body,
            usuario: uid
        }

        // findByIdAndUpdate: tenemos la opción de pedir que siempre nos devuelva el usuario actualizado { new: true }
        const resenaActualizado = await Resena.findByIdAndUpdate( id, cambiosResena, { new: true } );

        res.json({
            ok: true,
            // msg: 'PUT Hospital',
            resena: resenaActualizado
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
const borrarResena = async(req, res = response) => {
    
    const id = req.params.id;

    try {

        const resenaDB = await Resena.findById( id );

        if( !resenaDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un resena con ese id'
            });
        }

        await Resena.findByIdAndDelete( id );
        
        res.json({
            ok: true,
            msg: 'Resena eliminada'
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo eliminar la resena'
        })
    }
}


module.exports = {
    getResenas,
    getResenaById,
    crearResena,
    actualizaResena,
    borrarResena
}