const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const { Product } = require('../../db');
const user = require('./users');
const jwt = require('jwt-simple');
const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const middlewarePermisson = require('../../middlewares/middleware_permission');


const sequelize = new Sequelize('delilah_resto', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

/*****************************************************/
/***** ENDPOINT PARA LISTAR TODOS LOS PRODUCTOS ******/
/*****************************************************/

router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ message: "Error en la petición"});
        console.warn(err);
    }           
});

/******************************************/
/***** ENDPOINT PARA CREAR PRODUCTOS ******/
/******************************************/

router.post('/', middlewarePermisson.checkPermission,[
    check('name', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('price', 'El precio es obligatorio').not().isEmpty(),
    check('img_url', 'La imagen es obligatoria').not().isEmpty()
], async (req, res) => {      
    try{        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);            
            return res.status(422).json({ errores: errors.array() });   
        }else{            
            const product = await Product.create(req.body);
            res.json(`El producto fue creado exitosamente`);
        } 
    }catch(err){
        res.status(400).json({ message: "Error en la petición"});
        console.warn(err);
    }    
});

/**************************************************/
/***** ENDPOINT PARA EDITAR PRODUCTOS POR ID ******/
/**************************************************/

router.put('/:productId',middlewarePermisson.checkPermission, async (req, res) => {    
    try {
        await Product.update(req.body, {
            where: { product_id: req.params.productId }
        });
        res.status(200).json( { success: `El producto con id número ${req.params.productId} se ha actualizado exitosamente`});        
    } catch (err) {
        res.status(400).json({ message: "Error en la petición"});
        console.warn(err);
    }
});


/*****************************************************/
/***** ENDPOINT PARA ELIMINAR PRODUCTOS POR ID *******/
/*****************************************************/

router.delete('/:productId', middlewarePermisson.checkPermission, async (req, res) =>{        
    try {
        const response = await Product.destroy({
            where: { product_id: req.params.productId }
        }).catch(() =>{
            res.status(409).json({ message: "No se puede borrar este producto"});
        });
        if(!response){
            res.status(404).json( { success: 'El producto no existe'});
        }else{
            res.status(200).json( { success: 'El producto se ha borrado correctamente'});
        }        
    } catch (err) {
        //res.status(400).json({ message: "No se puede borrar este producto ya que está siendo usado por una orden "});
        //console.warn(err);
    }
});

module.exports = router;