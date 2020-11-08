module.exports = (sequelize, type) => {
    const user = sequelize.define('user', {
        user_id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: type.STRING,
        email: type.STRING,
        password: type.STRING,
        full_name: type.STRING,
        phone: type.STRING,
        delivery_address: type.STRING,
        is_admin: type.INTEGER,
        //is_disabled: type.INTEGER
    });    

    return user;
}