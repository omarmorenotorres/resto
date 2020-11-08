const jwt = require('jwt-simple');
const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

const sequelize = new Sequelize('delilah_resto', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});


const checkPermission = async (req, res, next) => {
    const userToken = req.headers['user-token'];
        let payload = {};
        payload = jwt.decode(userToken, 'frase secreta');
        console.log(payload.usuarioId);        

        const user = await sequelize.query(
            `SELECT is_admin FROM users WHERE user_id = ${payload.usuarioId}`, {
            type: QueryTypes.SELECT,
            plain: true 
        });

        if (user.is_admin === 0) {
            //console.log("No tienes permisos de administrador para ejecutar esta acción");
            res.status(403).send( { error: "No tienes permisos de administrador para ejecutar esta acción"});
        } else {
            //console.log("Tienes permisos de administrador para ejecutar esta acción");
            next();
        }        
}

module.exports = {    
    checkPermission: checkPermission
};