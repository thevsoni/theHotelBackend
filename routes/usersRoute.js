const e = require('express');
const express = require('express');
const router = express.Router();
const User = require('../models/user');

//register
router.post('/register', async (req, res) => {

    // const newuser = new User(req.body)
    const newuser = new User({ name: req.body.name, email: req.body.email, password: req.body.password })
    //when we need to send data with conditions then we can firstly destructure the data from body then send else directly can send like req.body
    //since we dont want to store confirm password so destructuring required things to store into db

    try {
        const user = await newuser.save()
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

//login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email, password: password })
        if (user) {
            const temp = {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                _id: user._id
            }
            res.send(temp)
        }
        else {
            return res.status(400).json({ message: 'Login failed' })
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
})

//admin : get all users
router.get('/getallusers', async (req, res) => {

    try {
        const user = await User.find()
        if (user) {
            res.send(user)
        }
        else {
            return res.status(400).json({ message: 'no user now' })
        }
    } catch (error) {
        return res.status(400).json({ message: "error in admin , get all user", error });
    }
})




module.exports = router