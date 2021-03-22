const fs = require('fs');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Rubro = require('../models/rubro');
const Noticia = require('../models/noticia');
const Resena = require('../models/resena');

const borrarImagen = ( path ) => {
    if( fs.existsSync( path ) ){
        // borrar la imagen anterior
        fs.unlinkSync( path );
    }
}

const actualizarImagen = async( tipo, id, nombreArchivo ) => {

    let pathViejo = '';

    switch (tipo) {
        case 'productos':
            const producto = await Producto.findById( id );

            if( !producto ){
                console.log('No es un producto por id');
                return false
            }

            // Establecemos un path
            pathViejo = `./uploads/productos/${ producto.img }`;

            borrarImagen( pathViejo );

            // A la instancia del medico le establecemos la img
            producto.img = nombreArchivo;
            await producto.save();
            return true;

            break;
        case 'rubros':
            const rubro = await Rubro.findById( id );

            if( !rubro ){
                console.log('No es un rubro por id');
                return false
            }

            // Establecemos un path
            pathViejo = `./uploads/rubros/${ rubro.img }`;

            borrarImagen( pathViejo );

            // A la instancia del hospital le establecemos la img
            rubro.img = nombreArchivo;
            await rubro.save();
            return true;
            
            break;
        case 'noticias':
            const noticia = await Noticia.findById( id );

            if( !noticia ){
                console.log('No es una noticia por id');
                return false
            }

            // Establecemos un path
            pathViejo = `./uploads/noticias/${ noticia.img }`;

            borrarImagen( pathViejo );

            // A la instancia del hospital le establecemos la img
            noticia.img = nombreArchivo;
            await noticia.save();
            return true;
            
            break;
        case 'resenas':
            const resena = await Resena.findById( id );

            if( !resena ){
                console.log('No es una resena por id');
                return false
            }

            // Establecemos un path
            pathViejo = `./uploads/resenas/${ resena.img }`;

            borrarImagen( pathViejo );

            // A la instancia del hospital le establecemos la img
            resena.img = nombreArchivo;
            await resena.save();
            return true;
            
            break;
        case 'usuarios':
            const usuario = await Usuario.findById( id );

            if( !usuario ){
                console.log('No es un usuario por id');
                return false
            }

            // Establecemos un path
            pathViejo = `./uploads/usuarios/${ usuario.img }`;

            borrarImagen( pathViejo );

            // A la instancia del usuario le establecemos la img
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            
            break;
    
        default:
            break;
    }
}

module.exports = {
    actualizarImagen
}