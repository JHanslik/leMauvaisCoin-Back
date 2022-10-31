const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        pseudoName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
    })

    return User
}
