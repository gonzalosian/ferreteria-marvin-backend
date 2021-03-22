const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    rubro: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Rubro'
    }
});

// Esto es para fines visuales. No afecta a la DB.
ProductoSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();

    return object;
})

// Mongoose tomará el nombre y lo llevará a plural
module.exports = model( 'Producto', ProductoSchema );