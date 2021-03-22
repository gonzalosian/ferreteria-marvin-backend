// response me puede servir para definir el tipo, por ejemplo, si no viene la res (response), ponemos un valor por default
const { response } = require('express');

const Noticia = require('../models/noticia');


const getNoticias = async(req, res = response) => {

    // Paginación
    const desde = Number( req.query.desde ) || 0;

    // const hospitales = await Hospital.find({}, 'nombre img usuario');

    // const noticias = await Noticia.find()
    //                             .populate('usuario', 'nombre img')
    //                             .limit(4)

    const [ noticias, total ] = await Promise.all([
        Noticia.find()
            .populate('usuario', 'nombre img')
            .skip( desde )
            .limit(4),

        // Usuario.count() // se dejó de usar
        Noticia.countDocuments()
    ]);

    res.json({
        ok: true,
        msg: 'GET Noticias',
        noticias,
        total
        // uid: req.uid, // Usuario que consultó, gracias a token válido
    })
}


const getNoticiaById = async(req, res = response) => {

    const id = req.params.id;
    // console.log(id);

    try {
        const noticia = await Noticia.findById(id)
                                    .populate('usuario', 'nombre img');
        
        // console.log(noticia);
    
        res.json({
            ok: true,
            msg: 'GET Noticia By Id',
            noticia,
        })
        
    } catch (error) {
        console.log(error);
        
        res.json({
            ok: false,
            msg: 'Hable con el Administrador',
        })
    }
}


const crearNoticia = async(req, res = response) => {
    // console.log(req.body);
    const { titulo } = req.body;

    try {
        const existeNoticia = await Noticia.findOne({ titulo });

        if( existeNoticia ){
            return res.status(400).json({
                ok: false,
                msg: 'El titulo de la noticia ya está registrado'
            });
        }

        // Después de pasar por la validación del token, siempre tendremos el uid
        const uid = req.uid;
        const noticia = new Noticia( {
            usuario: uid,
            ...req.body
        } );
    
        // Guardar usuario
        await noticia.save();

        res.json({
            ok: true,
            msg: 'POST Noticia',
            noticia,
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

const actualizaNoticia = async(req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto
    
    const id = req.params.id;
    const uid = req.uid;

    try {

        const noticiaDB = await Noticia.findById( id );

        if( !noticiaDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe una noticia con ese id'
            });
        }

        // Actualizaciones
        const cambiosNoticia = {
            ...req.body,
            usuario: uid
        }

        // findByIdAndUpdate: tenemos la opción de pedir que siempre nos devuelva el usuario actualizado { new: true }
        const noticiaActualizado = await Noticia.findByIdAndUpdate( id, cambiosNoticia, { new: true } );

        res.json({
            ok: true,
            // msg: 'PUT Hospital',
            noticia: noticiaActualizado
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
const borrarNoticia = async(req, res = response) => {
    
    const id = req.params.id;

    try {

        const noticiaDB = await Noticia.findById( id );

        if( !noticiaDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un noticia con ese id'
            });
        }

        await Noticia.findByIdAndDelete( id );
        
        res.json({
            ok: true,
            msg: 'Noticia eliminada'
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo eliminar la noticia'
        })
    }
}


module.exports = {
    getNoticias,
    getNoticiaById,
    crearNoticia,
    actualizaNoticia,
    borrarNoticia
}