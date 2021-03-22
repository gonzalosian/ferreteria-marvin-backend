const { Schema, model } = require('mongoose');

const ResenaSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    cantidadEstrellas: {
        type: Number
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
}, { collection: 'resenas' }); // esta es la forma de renombrarlo, porque por default mongo pondría hospitals

// Esto es para fines visuales. No afecta a la DB.
ResenaSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();

    return object;
})

// Mongoose tomará el nombre y lo llevará a plural
module.exports = model( 'Resena', ResenaSchema );