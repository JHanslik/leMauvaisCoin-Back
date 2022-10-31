const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const Message = sequelize.define('Message', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
        },
    })

    return Message
}
