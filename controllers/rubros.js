// response me puede servir para definir el tipo, por ejemplo, si no viene la res (response), ponemos un valor por default
const { response } = require('express');

const Rubro = require('../models/rubro');


const getRubros = async(req, res = response) => {

    // const hospitales = await Hospital.find({}, 'nombre img usuario');
    const rubros = await Rubro.find()
                                    .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        msg: 'GET Hospitales',
        rubros,
        // uid: req.uid, // Usuario que consultó, gracias a token válido
    })
}


const crearRubro = async(req, res = response) => {

    // console.log(req.body);
    const { nombre } = req.body;

    try {
        const existeRubro = await Rubro.findOne({ nombre });

        if( existeRubro ){
            return res.status(400).json({
                ok: false,
                msg: 'El nombre del rubro ya está registrado'
            });
        }

        // Después de pasar por la validación del token, siempre tendremos el uid
        const uid = req.uid;
        const rubro = new Rubro( {
            usuario: uid,
            ...req.body
        } );
    
        // Guardar usuario
        await rubro.save();

        res.json({
            ok: true,
            msg: 'POST Rubro',
            rubro,
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

const actualizaRubro = async(req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto
    
    const id = req.params.id;
    const uid = req.uid;

    try {

        const rubroDB = await Rubro.findById( id );

        if( !rubroDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un rubro con ese id'
            });
        }

        // Actualizaciones
        const cambiosRubro = {
            ...req.body,
            usuario: uid
        }

        // findByIdAndUpdate: tenemos la opción de pedir que siempre nos devuelva el usuario actualizado { new: true }
        const rubroActualizado = await Rubro.findByIdAndUpdate( id, cambiosRubro, { new: true } );

        res.json({
            ok: true,
            // msg: 'PUT Hospital',
            rubro: rubroActualizado
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
const borrarRubro = async(req, res = response) => {
    
    const id = req.params.id;

    try {

        const rubroDB = await Rubro.findById( id );

        if( !rubroDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un rubro con ese id'
            });
        }

        await Rubro.findByIdAndDelete( id );
        
        res.json({
            ok: true,
            msg: 'Rubro eliminado'
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo eliminar el rubro'
        })
    }
}


module.exports = {
    getRubros,
    crearRubro,
    actualizaRubro,
    borrarRubro
}