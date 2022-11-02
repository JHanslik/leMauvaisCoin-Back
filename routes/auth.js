const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const { User } = require('../models/index')
const issueToken = require('../utils/jwt')

app.post('/login', async (req, res) => {
    const { email, password, pseudo } = req.body

    const user = await User.findOne({
        where: {
            email,
        },
    })

    if (!user) {
        res.status(404).json('Not Found')
    } else {
        const validPassword = await bcrypt.compare(password, user.password)
        if (validPassword) {
            const token = issueToken({
                id: user.id,
                email: user.email,
            })
            res.json({ token })
        } else {
            res.status(404).json('Not Found')
        }
    }
})

app.post('/signup', async (req, res) => {
    const { email, password, pseudo } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        email,
        password: hashedPassword,
        pseudo,
    })
    res.json(user)
})

module.exports = app
