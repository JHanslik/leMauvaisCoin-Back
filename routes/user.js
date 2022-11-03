const express = require('express')
const app = express()
const passport = require('../config/passport')
const path = require('path')
const multer = require('multer')
const { body, validationResult } = require('express-validator')

const { Message, User } = require('../models/index')

app.get('/me', passport.authenticate('jwt'), (req, res) => {
    res.json(req.user)
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

// post profil pic
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        const fileType = path.extname(file.originalname)
        cb(null, Date.now() + fileType)
    },
})

const upload = multer({ storage: storage, limits: { fileSize: 16777216 } })

app.post('/picture', upload.single('profile_picture'), (req, res, next) => {})

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
