const { Schema, model } = require('mongoose');

const NoticiaSchema = Schema({

    titulo: {
        type: String,
        required: true
    },
    subtitulo: {
        type: String
    },
    descripcion: {
        type: String
    },
    img: {
        type: String
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, { collection: 'noticias' }); // esta es la forma de renombrarlo, porque por default mongo pondría hospitals

// Esto es para fines visuales. No afecta a la DB.
NoticiaSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();

    return object;
})

// Mongoose tomará el nombre y lo llevará a plural
module.exports = model( 'Noticia', NoticiaSchema );