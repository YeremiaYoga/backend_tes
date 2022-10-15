const dbConfig = require("../config/db.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password,{
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorAliases:false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.produk = require("./produk.js")(sequelize, Sequelize);
db.user = require("./user.js")(sequelize, Sequelize);

module.exports = db;