module.exports = (sequelize, type) => {
    const orders = sequelize.define('orders', {
        order_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: type.STRING,
        date: type.DATE,
        description: type.STRING,
        payment_method: type.STRING,
        total: type.FLOAT,
        user_id: type.INTEGER,
        is_disabled: type.BOOLEAN        
    });

    return orders;
}