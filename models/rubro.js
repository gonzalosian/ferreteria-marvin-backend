const { Schema, model } = require('mongoose');

const RubroSchema = Schema({

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
    }
}, { collection: 'rubros' }); // esta es la forma de renombrarlo, porque por default mongo pondría hospitals

// Esto es para fines visuales. No afecta a la DB.
RubroSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();

    return object;
})

// Mongoose tomará el nombre y lo llevará a plural
module.exports = model( 'Rubro', RubroSchema );