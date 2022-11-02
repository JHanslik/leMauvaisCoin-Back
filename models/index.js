const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('LeMauvaisCoin', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
})

const connectDb = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connected to db')
    } catch (e) {
        console.log(e)
    }
}

connectDb()

const User = require('./user')(sequelize)
const Product = require('./product')(sequelize)
const Message = require('./message')(sequelize)
const Image = require('./image')(sequelize)

Message.belongsTo(Product)
Product.hasMany(Message)

Message.belongsTo(User)
User.hasMany(Message)

Product.belongsTo(User)
User.hasMany(Product)

Image.belongsTo(Product)
Product.hasMany(Image)
Image.belongsTo(User)
User.hasOne(Image)

sequelize.sync({ alter: true })

const db = {
    sequelize,
    User,
    Message,
    Product,
}

module.exports = db
