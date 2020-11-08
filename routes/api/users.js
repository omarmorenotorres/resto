const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { User } = require('../../db');
const { check, validationResult } = require('express-validator');
const moment = require('moment');
const jwt = require('jwt-simple');
const { QueryTypes } = require('sequelize');
const middleware = require('../../middlewares/middlewares');


const Sequelize = require('sequelize');
const middleware_permission = require('../../middlewares/middleware_permission');
const sequelize = new Sequelize('delilah_resto', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

/**************************************** */
/***** ENDPOINT PARA CREAR USUARIOS **** */
/**************************************** */

router.post('/', [
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email debe estar correcto').isEmail().not(),
    check('phone', 'El teléfono no debe estar vacío').not().isEmpty(),
    check('delivery_address', 'La dirección no puede estar vacía').not().isEmpty(),
    check('is_admin', 'El rol no puede estar vacío').not().isEmpty(),
    /*check('is_disabled', 'El estado no puede estar vacío').not().isEmpty()*/
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errores: errors.array() });
    } else {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        //const user = await User.create(req.body);
        await sequelize.query(
            `INSERT INTO users (username, email, password, full_name, phone, delivery_address, is_admin) ` +
            //`VALUES ('omar.moreno', 'omar.moreno@gmail.com', 'Omar Moreno', '12354', '12345', '12345', '0', '0')`,{
            `VALUES ('${req.body.username}', '${req.body.email}', '${req.body.password}', '${req.body.full_name}', '${req.body.phone}', '${req.body.delivery_address}', '${req.body.is_admin}')`, {
            type: QueryTypes.INSERT
        }).then(() => {
            res.status(200).json("Usuario creado exitosamente");
        }).catch(err => {
            res.status(409).json("Error en el formato de los datos");
        });
    }
})

/**************************************** */
/***** ENDPOINT PARA LISTAR USUARIOS **** */
/**************************************** */

router.get('/',middleware.checkToken, async (req, res) => {
    try {
        const userToken = req.headers['user-token'];
    let payload = {};
        payload = jwt.decode(userToken, 'frase secreta');
        console.log("PAYLOAD:" + payload.usuarioId);

        const is_admin = await sequelize.query(
            `SELECT users.is_admin FROM users WHERE users.user_id = ${payload.usuarioId}`, {
                type: QueryTypes.SELECT,
                plain: true
            });
            console.log(is_admin);
        
            if (is_admin.is_admin === 1) {
                const users = await User.findAll();
                res.status(200).json(users);
            }else{
                const users = await sequelize.query(
                    `SELECT username, email, full_name, phone, delivery_address
                     FROM users WHERE user_id = ${payload.usuarioId}`,{
                        type: QueryTypes.SELECT

                    });
                res.status(200).json(users);
            }        
    } catch (err) {
        res.status(400).json({ message: "Error en la petición"});
        console.warn(err);
    }           
});

/****************************************** */
/***** ENDPOINT PARA LOGGEAR USUARIOS ***** */
/****************************************** */

router.post('/login', async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    
    if (user) {
        const iguales = bcrypt.compareSync(req.body.password, user.password);
        if (iguales) {
            res.json({ token: createToken(user) })
        } else {
            res.status(400).json({ error: 'Error en usuario y/o contraseña ' });
        }
    } else {
        res.json({ error: 'Error en usuario y/o contraseña ' });
    }
});

/**************************************** */
/***** ENDPOINT PARA EDITAR USUARIOS **** */
/**************************************** */

router.put('/:userId', middleware_permission.checkPermission, async (req,res) => {
    try {
        await User.update(req.body, {
            where: { user_id: req.params.userId }
        });

        res.status(200).json( { success: `Se ha actualizado exitosamente el usuario con id número ${req.params.userId}`});        
    } catch (err) {
        console.warn(err);
    }
});

/**************************************** */
/***** ENDPOINT PARA BORRAR USUARIOS **** */
/**************************************** */

router.delete('/:userId', middleware_permission.checkPermission, async (req, res) => {
    try {
        await User.destroy({
            where: { user_id: req.params.userId }
        });
        res.status(200).json( { success: `Se ha borrado exitosamente el usuario con id ${req.params.userId}`});        
    } catch (err) {
        console.warn(err);
    } 
});

const createToken = (user) => {
    const payload = {
        usuarioId: user.user_id,
        createdAt: moment().unix(),
        expiredAt: moment().add(30, 'minutes').unix()
    }

    return jwt.encode(payload, 'frase secreta');
}

module.exports = router;