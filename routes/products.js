const express = require('express')
const { Op } = require('sequelize')
const app = express()
const passport = require('../config/passport')
const path = require('path')
const multer = require('multer')
const { body, validationResult } = require('express-validator')

const { Message, Product } = require('../models/index')

app.post(
    '/',
    passport.authenticate('jwt'),
    body('title').exists().withMessage("Title length isn't right"),
    body('content').isLength({ min: 50 }).withMessage('Content is too short'),
    body('price').exists().withMessage("Price isn't right"),

    async (req, res) => {
        const { errors } = validationResult(req)
        const { title, content, price } = req.body

        if (errors.length > 0) {
            res.status(400).json(errors)
        } else {
            const products = await Product.create({
                title,
                content,
                price,
                UserId: req.user.id,
            })
            res.json(products)
        }
    }
)

app.get('/:id', async (req, res) => {
    const { id } = req.params

    const product = await Product.findOne({
        where: { id },
    })
    if (product) {
        res.json(product)
    } else {
        res.status(404).json('Product not found')
    }
})

app.get('/', async (req, res) => {
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
app.post(
    '/:id/messages',
    passport.authenticate('jwt'),
    body('title').exists().withMessage("Title length isn't right"),
    body('content').isLength({ min: 20 }).withMessage('Content is too short'),
    async (req, res) => {
        const { errors } = validationResult(req)
        const { title, content } = req.body

        if (errors.length > 0) {
            res.status(400).json(errors)
        } else {
            const messages = await Message.create({
                title,
                content,
                senderId: req.user.id,
                receiverId: req.body.receiverId,
                ProductId: req.params.id,
            })
            console.log(messages)
            res.json(messages)
        }
    }
)

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

// Post des images
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

app.post('/photos', upload.array('product_photos', 5), (req, res, next) => {})

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
