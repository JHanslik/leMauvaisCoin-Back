require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const messagesRoutes = require('./routes/messages')
const productsRoutes = require('./routes/products')
require('./models/index')

app.use(cors('*'))
app.use(express.json())

const port = process.env.DB_PORT

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
    })
)
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/messages', messagesRoutes)
app.use('/products', productsRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
