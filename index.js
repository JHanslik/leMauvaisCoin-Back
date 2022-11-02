require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const cors = require('cors')
const authRoutes = require('./routes/auth')
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
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
