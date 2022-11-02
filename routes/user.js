const express = require('express')
const app = express()
const passport = require('../config/passport')

const { Message, User } = require('../models/index')

app.get('/me', passport.authenticate('jwt'), (req, res) => {
    res.json(req.body)
})

app.put('/:id', passport.authenticate('jwt'), async (req, res) => {
    const { id } = req.params

    try {
        const user = await User.update(req.body, {
            where: {
                id,
            },
        })
        const response = await User.findOne({
            where: {
                id,
            },
        })

        res.json(response)
    } catch (e) {
        console.log(e)
        res.status(500).json('Internal server error')
    }
})

app.get('/messages', passport.authenticate('jwt'), async (req, res) => {
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

app.delete('/:id', passport.authenticate('jwt'), async (req, res) => {
    const { id } = req.params
    try {
        await User.destroy({
            where: { id },
        })
        res.status(200).json('User deleted')
    } catch (e) {
        console.log(e)
        res.status(500).json('Internal server error')
    }
})

module.exports = app
