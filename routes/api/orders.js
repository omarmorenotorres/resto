const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const { Order } = require('../../db');
const { QueryTypes } = require('sequelize');
const jwt = require('jwt-simple');

const Sequelize = require('sequelize');
const { json } = require('body-parser');
const { query } = require('express');
const { route } = require('./users');
const middleware_permission = require('../../middlewares/middleware_permission');
const sequelize = new Sequelize('delilah_resto', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

/**READ ENPOINT*/

router.get('/', async (req, res) => {    
    try {
        const userToken = req.headers['user-token'];
    let payload = {};
        payload = jwt.decode(userToken, 'frase secreta');
        //console.log("PAYLOAD:" + payload.usuarioId);

        const is_admin = await sequelize.query(
            `SELECT users.is_admin FROM users WHERE users.user_id = ${payload.usuarioId}`, {
                type: QueryTypes.SELECT,
                plain: true
            });         
            //console.log("Admin: "+ is_admin.is_admin);

        if (is_admin.is_admin === 1) {
            //console.log("Entro Admin");
            const orders = await sequelize.query(                
                `SELECT orders.order_id, orders.status,  orders.total, orders.payment_method,
                users.full_name, users.username, users.email, users.delivery_address, users.phone, 
                orders_products.product_id, 
                products.name, orders_products.product_amount, products.price
                 FROM orders INNER JOIN users ON orders.user_id = users.user_id 
                 INNER JOIN orders_products ON orders_products.order_id = orders.order_id 
                 INNER JOIN products ON orders_products.product_id = products.product_id
                 ORDER BY orders.order_id ASC`, {
                type: QueryTypes.SELECT
            });
            res.status(200).json(orders);            
        } else {
            const orders = await sequelize.query(
                `SELECT orders.order_id, orders.status,  orders.total, orders.payment_method,
                users.full_name, users.username, users.email, users.delivery_address, users.phone, 
                orders_products.product_id, 
                products.name, orders_products.product_amount, products.price
                FROM orders INNER JOIN users ON orders.user_id = users.user_id 
                INNER JOIN orders_products ON orders_products.order_id = orders.order_id 
                INNER JOIN products ON orders_products.product_id = products.product_id 
                WHERE users.user_id = ${payload.usuarioId} `, {
                type: QueryTypes.SELECT
            });
            
            if( orders.length > 0 ){
                res.status(200).json(orders);            
            }else{
                res.status(404).json({ message: "No existen pedidos para este usuario"});
            }
        }
    } catch (err) {
        res.status(400).json({ message: "Error en la petición. Id no inválido en la petición"});
        console.warn(err);
    }
});

/**************************************** */
/***** ENDPOINT PARA CREAR PEDIDOS ****** */
/**************************************** */

router.post('/', [
    check('data', 'La lista de productos es obligatorio').not().isEmpty(),
    check('user_id', 'El id de usuario es obligatorio').not().isEmpty(),
    check('payment_method', 'El método de pago es obligatoria').not().isEmpty(),    
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errores: errors.array() });
        } else {
            //const order = await Order.create(req.body);
            const { data, payment_method, user_id } = req.body;                                        
                let user = await sequelize.query(
                    `SELECT full_name FROM users WHERE user_id = ${user_id}`
                    , { plain: true
                    });
            
            let total = 0;
            for (const i in data) {
                let response = await sequelize.query(
                    `SELECT price FROM products WHERE product_id = ${data[i].product_id}`
                    , { plain: true 
                    });
                total += response.price * data[i].amount;
                console.log(response.price);
            }
            console.log("TOTAL " + total);

            const order = await Order.create({
                status: "NUEVO",
                date: new Date(),
                description: req.body.description,
                payment_method: req.body.payment_method,
                total: total,
                user_id: req.body.user_id,
                is_disable: 0
            });

            for (const i in data) {
                const order_products = await sequelize.query(
                    `INSERT INTO orders_products (order_id, product_id, product_amount) 
                    VALUES ('${order.order_id}', '${data[i].product_id}', '${data[i].amount}')`,
                    { plain: true,
                        type: QueryTypes.INSERT
                    }
                );
                console.log(data[i]);
            }                      
            res.json(`Recibimos tu pedido, ${user.full_name}, gracias por pedir a Delilah. Puedes seguir tu pedido para saber donde está.`);
        }
    } catch (err) {
        res.status(404).json({ message: "Alguno de los productos dentro de la orden no existen en nuestra base de datos, o el usuario no registra dentro de nuestra plataforma. Por favor revisar la información enviada"});
        console.warn(err);
    }
});

/************************************************/
/***** ENDPOINT PARA LISTAR PEDIDOS POR ID **** */
/************************************************/

/*router.get('/detail/:orderId', async (req, res) =>{
    try {
        const response  = await sequelize.query(
            `SELECT products.name 
            FROM products INNER JOIN orders_products ON products.product_id = orders_products.product_id 
            WHERE orders_products.order_id = ${req.params.orderId} `,
            { //plain: true,
              type: QueryTypes.SELECT
            }
            );
        res.status(200).json(response);

        res.send(users);
    } catch (err) {
        res.status(400).json({ message: "Error en la petición"});
        console.warn(err);
    }
});*/

/******************************************************************/
/***** ENDPOINT PARA LISTAR EL DETALLE DE LOS PEDIDOS POR ID ******/
/******************************************************************/

router.get('/:orderId', async (req, res) =>{
    try {
        /*const response  = await sequelize.query(
            `SELECT status, payment_method,  
            FROM products INNER JOIN orders_products ON products.product_id = orders_products.product_id 
            WHERE orders_products.order_id = ${req.params.orderId} `,
            { //plain: true,
              type: QueryTypes.SELECT
            }
            );*/
        const response = await Order.findOne({
            where: { order_id: req.params.orderId }
        });

        if( response == null ){
            res.status(404).json({ message: `El pedido con número de ID ${req.params.orderId} no existe`});
        }

        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: "Error en la petición. Id no válido en la petición"});
        console.warn(err);
    }
});

/************************************************/
/***** ENDPOINT PARA EDITAR PEDIDOS POR ID ******/
/************************************************/

router.put('/:orderId', middleware_permission.checkPermission, [
    check('status', 'el estado del pedido es obligatorio').not().isEmpty(),
],async (req, res) => {    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errores: errors.array() });
        }else{
            await Order.update(req.body, {
                where: { order_id: req.params.orderId }
            });
            res.status(200).json({ success: `La orden con id número ${req.params.orderId} se ha actualizado exitosamente` });
        }        
    } catch (err) {
        res.status(400).json({ message: "Error en la petición"});
        console.warn(err);
    }
});

/************************************************/
/***** ENDPOINT PARA BORRAR PEDIDOS POR ID **** */
/************************************************/

router.delete('/:orderId',middleware_permission.checkPermission, async (req, res) => {
    try {
        await Order.destroy({
            where: { order_id: req.params.orderId }
        });
        res.status(200).json({ success: `Se ha eliminado exitosamente el registro con id número ${req.params.orderId}`});
    } catch (err) {
        res.status(400).json({ message: "Error en la petición"});
        console.warn(err);
    }
});

module.exports = router;