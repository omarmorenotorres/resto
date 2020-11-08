module.exports = (sequelize, type) => {
    const resume = sequelize.define('orders_products', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: type.INTEGER,
        product_id: type.INTEGER,
        product_amount: type.INTEGER
    });
   

    return orders;
}