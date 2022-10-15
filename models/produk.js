
module.exports = (sequelize, Sequelize) => {
    const Produk = sequelize.define("produk", {
        name: {
            type:Sequelize.STRING
        },
        ket: {
            type:Sequelize.STRING
        },
    })
    return Produk;
};
