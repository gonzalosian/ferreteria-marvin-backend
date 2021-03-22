// response me puede servir para definir el tipo, por ejemplo, si no viene la res (response), ponemos un valor por default
const { response } = require('express');
const bcrypt = require('bcryptjs');

const Producto = require('../models/producto');
const { generarJWT } = require('../helpers/jwt');


const getProductos = async(req, res = response) => {

    // const medicos = await Medico.find({}, 'nombre img usuario');
    const productos = await Producto.find()
                                .populate('usuario', 'nombre img')
                                .populate('rubro', 'nombre img');

    res.json({
        ok: true,
        msg: 'GET Productos',
        productos,
    })
}


const getProductoById = async(req, res = response) => {

    const id = req.params.id;

    try {
        const producto = await Producto.findById(id)
                                    .populate('usuario', 'nombre img')
                                    .populate('rubro', 'nombre img');
    
        res.json({
            ok: true,
            msg: 'GET Producto By Id',
            producto,
        })
        
    } catch (error) {
        console.log(error);
        
        res.json({
            ok: false,
            msg: 'Hable con el Administrador',
        })
    }

}


const crearProducto = async(req, res = response) => {

    const { nombre } = req.body;

    try {

        const existeProducto = await Producto.findOne({ nombre });

        if( existeProducto ){
            return res.status(400).json({
                ok: false,
                msg: 'El nombre del Médico ya está registrado'
            });
        }

        // Después de pasar por la validación del token, siempre tendremos el uid del usuario que lo crea.
        const uid = req.uid;
        
        const producto = new Producto( {
            usuario: uid,
            ...req.body
        } );
    
        // Guardar médico
        await producto.save();
    
        // En Express, el res.json() solo se puede llamar una única vez.
        res.json({
            ok: true,
            msg: 'POST Producto',
            producto
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

const actualizaProducto = async(req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto
    
    const id = req.params.id;
    // console.log(req.body)
    const uid = req.uid;

    try {

        const productoDB = await Producto.findById( id );

        if( !productoDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un producto con ese id'
            });
        }

        // Actualizaciones
        const cambiosProducto = {
            ...req.body,
            usuario: uid
        }

        // findByIdAndUpdate: tenemos la opción de pedir que siempre nos devuelva el usuario actualizado { new: true }
        const productoActualizado = await Producto.findByIdAndUpdate( id, cambiosProducto, { new: true } );
    
        res.json({
            ok: true,
            // msg: 'PUT Producto',
            producto: productoActualizado
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado al actualizar...revisar logs'
        });
    }
}


// Esto se implementa a mero ejemplo, ya que conviene dar de baja al medico, modificarlo, para no perder referencias.
const borrarProducto = async(req, res = response) => {

    const id = req.params.id;

    try {

        const productoDB = await Producto.findById( id );

        if( !productoDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un Producto con ese id'
            });
        }

        await Producto.findByIdAndDelete( id );
        
        res.json({
            ok: true,
            msg: 'Producto eliminado'
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
    getProductos,
    getProductoById,
    crearProducto,
    actualizaProducto,
    borrarProducto
}