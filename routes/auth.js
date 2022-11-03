const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const { User } = require('../models/index')
const issueToken = require('../utils/jwt')
const { body, validationResult } = require('express-validator')

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

app.post('/signup', 
body('pseudo').isLength({min: 5}).withMessage("Pseudo length isn't right"),
body('password').isLength({min: 8}).withMessage("Password is too short"),
body('password').isLength({max: 12}).withMessage("Password is too long"),
body('email').isEmail().withMessage("Email isn't right"),
async (req, res) => {
    const { errors } = validationResult(req)    
    const { email, password, pseudo } = req.body

    if(errors.length > 0) {
        res.status(400).json(errors)
    }else{
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        email,
        password: hashedPassword,
        pseudo,
    })
    res.json(user)
}
})

module.exports = app
