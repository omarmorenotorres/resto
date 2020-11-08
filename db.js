const films = require('./models/films');
const Sequelize = require('sequelize');
const products = require('./models/products');
const data_base = "";
const username = "";
const password = 'RTHkT7OxmX';
const host = 'remotemysql.com';
const dialect = 'mysql';

const FilmModel = require('./models/films');
const UserModel = require('./models/users');
const ProductModel = require('./models/products');
const OrderModel = require('./models/orders');

/****** 
 * Conexión remota a la base de datos de Delilah online cambiar los valores en todas las rutas correspondientes
 ******/

/*const sequelize = new Sequelize('hNd5PJkojo', 'hNd5PJkojo', password, {
    host: host,
    dialect: dialect
});*/

/****** Conexión local a la base de datos de Delilah ******/

const sequelize = new Sequelize('delilah_resto', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

const Film = FilmModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Product = ProductModel(sequelize, Sequelize);
const Order = OrderModel(sequelize, Sequelize);


/*sequelize.sync( {force: false} )
.then(() =>{
    console.log('Base de Datos sincronizadas');
})*/

module.exports = {
    Film,
    User,
    Product,
    Order
}