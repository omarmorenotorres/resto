const router = require('express').Router();
const apiFilmsRouter = require('./api/films');
const apiUsersRouter = require('./api/users');
const apiProductsRouter = require('./api/products');
const apiOrdersRouter = require('./api/orders');
const middleware = require('../middlewares/middlewares');

router.use('/films', middleware.checkToken, apiFilmsRouter);
router.use('/products', middleware.checkToken, apiProductsRouter);
router.use('/users', apiUsersRouter);
router.use('/orders', middleware.checkToken, apiOrdersRouter);

module.exports = router;