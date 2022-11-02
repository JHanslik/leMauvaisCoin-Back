const express = require('express')
const app = express()
const passport = require('../config/passport')
const {Product} = require('../models/index')

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
