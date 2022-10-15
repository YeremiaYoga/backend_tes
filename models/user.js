const { refresh } = require("../config/auth");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        name: {
            type:Sequelize.STRING
        },
        email: {
            type:Sequelize.STRING
        },
        gender: {
            type:Sequelize.STRING
        },
        password: {
            type:Sequelize.STRING
        },
        refresh_token:{
            type:Sequelize.TEXT
        }
    })
    return User;
};
