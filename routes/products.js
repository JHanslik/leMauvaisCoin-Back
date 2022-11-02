const express = require('express')
const { Op } = require('sequelize')
const app = express()
const passport = require('../config/passport')
const { Message, Product } = require('../models/index')

app.post('/', passport.authenticate('jwt'), async (req, res) => {
    const { title, content, price } = req.body

    const products = await Product.create({
        title,
        content,
        price,
        UserId: req.user.id,
    })
    res.json(products)
})

app.get('/:id', passport.authenticate('jwt'), (req, res) => {
    res.json(req.body)
})

app.get('/', passport.authenticate('jwt'), async (req, res) => {
    const products = await Product.findAll()
    res.json(products)
})

app.put('/:id', passport.authenticate('jwt'), async (req, res) => {
    const { id } = req.params

    try {
        const product = await Product.update(req.body, {
            where: {
                id,
            },
        })
        const response = await Product.findOne({
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

// post messages related to product
app.post('/:id/messages', passport.authenticate('jwt'), async (req, res) => {
    const { title, content } = req.body
    const messages = await Message.create({
        title,
        content,
        senderId: req.user.id,
        receiverId: req.body.receiverId,
        ProductId: req.params.id,
    })
    console.log(req.params.id)
    res.json(messages)
})

// Get messages related to product
app.get('/:id/messages', passport.authenticate('jwt'), async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: {
                ProductId: req.params.id,
                [Op.or]: [
                    { senderId: req.user.id },
                    { receiverId: req.user.id },
                ],
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
        await Product.destroy({
            where: { id },
        })
        res.status(200).json('Product deleted')
    } catch (e) {
        console.log(e)
        res.status(500).json('Internal server error')
    }
})

module.exports = app
