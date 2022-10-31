const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const Image = sequelize.define('Image', {
        link: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    return Image
}
