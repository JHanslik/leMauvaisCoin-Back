const express = require('express')
const app = express()
const passport = require('../config/passport')

const { User } = require('../models/index')

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
        });
        const response = await User.findOne({
            where: {
                id,
            },
        });

        res.json(response);
    } catch (e) {
        console.log(e);
        res.status(500).json("Internal server error");
    }

})



module.exports = app 