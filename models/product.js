const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.INTEGER,
        },
    })

    return Product
}
