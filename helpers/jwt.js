const jwt = require('jsonwebtoken');

// require('dotenv').config();

const generarJWT = ( uid ) => {
    // El JWT no trabaja con promesa, por lo que debemos adicionarle algo, para esperar correctamente en el login

    return new Promise( ( resolve, reject ) => {

        const payload = {
            uid,
        }
    
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, ( err, token ) =>{
            if(err){
                console.error(err);
                reject('No se pudo generar el JWT');
            } else{
                resolve( token );
            }
    
        } )

    } )


}

module.exports = {
    generarJWT,
}