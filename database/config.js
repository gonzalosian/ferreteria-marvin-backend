// Creamos este arhivo para tener mejor organizado el backend.
// Aquí las configuraciones globales.
const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex:true
        });

        console.log('DB Online');

    } catch (error) {
        console.error(error);
        // Si no inicia, no quiero que haga mas nada, por lo que aquí detengo la ejecución
        throw new Error('Error al iniciar la DB. Ver logs.');
    }
}


module.exports = {
    dbConnection
}