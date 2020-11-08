module.exports = (sequelize, type) => {
    const Product = sequelize.define('product', {
        product_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        description: type.STRING,
        price: type.FLOAT,
        img_url: type.STRING/*,
        is_disabled: type.INTEGER*/
    });

    return Product;
}