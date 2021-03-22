// response me puede servir para definir el tipo, por ejemplo, si no viene la res (response), ponemos un valor por default
const { response } = require('express');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Rubro = require('../models/rubro');
const Noticia = require('../models/noticia');
const Resena = require('../models/resena');


const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    // console.log(busqueda);
    const regex = new RegExp( busqueda, 'i' );

    // const usuarios = await Usuario.find( { nombre: regex } );
    // const medicos = await Medico.find( { nombre: regex } );
    // const hospitales = await Hospital.find( { nombre: regex } );

    const [ usuarios, producto, rubros, noticias ] = await Promise.all([
        Usuario.find( { nombre: regex } ),
        Producto.find( { nombre: regex } ),
        Rubro.find( { nombre: regex } ),
        Noticia.find( { titulo: regex } ),
        Resena.find( { nombre: regex } ),
    ]);

    res.json({
        ok: true,
        msg: 'GET Busqueda',
        // busqueda,
        usuarios,
        productos,
        rubros,
        noticias,
        resenas,
        // uid: req.uid, // Usuario que consultó, gracias a token válido
        // total
    })
}


const getDocumentoColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    // console.log(busqueda);
    const regex = new RegExp( busqueda, 'i' );

    let data = [];

    switch ( tabla ) {
        case 'productos':
            data = await Producto.find( { nombre: regex } )
                                .populate( 'usuario', 'nombre img' )
                                .populate( 'rubro', 'nombre img' );
            break;
        case 'rubros':
            data = await Rubro.find( { nombre: regex } )
                                .populate( 'usuario', 'nombre img' );
            break;
        case 'noticias':
            data = await Noticia.find( { titulo: regex } )
                                .populate( 'usuario', 'nombre img' );
            break;
        case 'resenas':
            data = await Resena.find( { nombre: regex } )
                                .populate( 'usuario', 'nombre img' );
            break;
        case 'usuarios':
            data = await Usuario.find( { nombre: regex } );
            break;
        default:
            res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser productos/rubros/usuarios/noticias/resenas'
            });
    }

    // const [ usuarios, medicos, hospitales ] = await Promise.all([
    //     Usuario.find( { nombre: regex } ),
    //     Medico.find( { nombre: regex } ),
    //     Hospital.find( { nombre: regex } )
    // ]);

    res.json({
        ok: true,
        msg: 'GET Busqueda',
        resultado: data
    })
}


module.exports = {
    getTodo,
    getDocumentoColeccion
}