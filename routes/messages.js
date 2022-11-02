const express = require('express')
const app = express()
const passport = require('../config/passport')
const { Message } = require('../models/index')

app.get('/', passport.authenticate('jwt'), async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: {
                senderId: req.user.id,
            },
        })
        res.json(messages)
    } catch (e) {
        res.status(404).json('Not found')
    }
})  

app.post('/', passport.authenticate('jwt'), async (req, res) => {
    const { title, content } = req.body
    const messages = await Message.create({
        title,
        content,
        senderId: req.user.id,
        receiverId: req.body.receiverId,
        // productId: req.body.productId,
    })
    res.json(messages)
})

module.exports = app
