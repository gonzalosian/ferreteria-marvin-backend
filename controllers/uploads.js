// response me puede servir para definir el tipo, por ejemplo, si no viene la res (response), ponemos un valor por default
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// const Usuario = require('../models/usuario');
// const Medico = require('../models/medico');
// const Hospital = require('../models/hospital');
const { actualizarImagen } = require('../helpers/actualizar-imagen');


const fileUpload = (req, res = response) => {

    // const tipo = req.params.tipo;
    // const id = req.params.id;
    const { tipo, id } = req.params;

    // console.log(` ${tipo} - ${id}`);
    
    // const regex = new RegExp( busqueda, 'i' );

    const tiposValidos = [ 'productos', 'rubros', 'usuarios', 'noticias', 'resenas' ];

    if( !tiposValidos.includes( tipo ) ){
        return res.status(400).json({
            ok: false,
            msg: 'No es un producto, rubro, usuario, noticia o resenas'
        })
    }

    // Validamos que exista el archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No files were uploaded.'
        });
    }

    // Procesamos la imagen. Tenemos accesos a los files gracias al middleware
    const file = req.files.imagen;
    // Obtenemos extensión del archivo
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ]; // La última posición

    // Validar extensión
    const extensionesValidas = [ 'png', 'jpg', 'jpeg', 'gif' ];

    if( !extensionesValidas.includes( extensionArchivo ) ){
        res.status(400).json({
            ok: false,
            msg: 'Las extensiones válidas son png, jpg, jpeg y gif'
        })
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // console.log(`Este es el PATH: ${path}`);

    // Use the mv() method to place the file somewhere on your server
    file.mv( path, (err) => {
        if (err){
            console.error(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // Actualizar la DB
        actualizarImagen( tipo, id, nombreArchivo );

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo,
            path
        })

    });


}


const retornaImagen = ( req, res = response ) => {
    const { tipo, foto } = req.params;
    // Acá van los dos puntos porque está posicionado en la carpeta controllers
    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );
    
    // imagen por defecto
    if( fs.existsSync( pathImg ) ){
        // Para decirle a Express que responda a esto, no un json, sino una imagen/archivo
        res.sendFile( pathImg );
    } else{
        const pathImg = path.join( __dirname, `../uploads/no-img.png` );
        res.sendFile( pathImg );
    }
    
    // if( !fs.existsSync( pathImg ) ){
    //     // Para decirle a Express que responda a esto, no un json, sino una imagen/archivo
    //     pathImg = path.join( __dirname, `../uploads/no-img.png` );
    // }
    
    // res.sendFile( pathImg );
}


module.exports = {
    fileUpload,
    retornaImagen
}