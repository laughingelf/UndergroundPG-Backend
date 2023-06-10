var express = require('express');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
var router = express.Router();


const saltRounds = 10



const User = require('../models/User.model')

router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body

    console.log('the user', req.body)

    if (email === '' || password === '' || username === '') {
        res.status(400).json({ message: "Provide Username, Email, and Password" })
        return
    }

    // //check the password strength
    // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    // if (!regex.test(password)) {
    //     res
    //         .status(500)
    //         .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    //     return;
    // }


    User.findOne({ email })
        .then((foundUser) => {
            if (foundUser) {
                res.status(400).json({ message: "User already exists." });
                return;
            }

            const salt = bcryptjs.genSaltSync(saltRounds)
            const hashedPassword = bcryptjs.hashSync(password, salt)


            User.create({
                username,
                email,
                password: hashedPassword
            })
                .then((createdUser) => {
                    const { _id, email, password } = createdUser
                    const payload = {
                        _id,
                        username,
                        email
                    }

                    const authToken = jwt.sign(
                        payload,
                        process.env.SECRET,
                        { algorithm: 'HS256', expiresIn: "6h" }
                    )
                    res.status(201).json({ authToken: authToken, user: payload })
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500).json({ message: 'Internal Server Error' })
                })
        })
        .catch((err) => {
            console.log(err)
            res.status(401).json({ message: "user already exist!" })
        })


})


router.post('/login', (req, res, next) => {
    const { email, password } = req.body

    if (email === '' || password === '') {
        res.status(400).json({ message: "Provide email and password" })
        return
    }

    User.findOne({ email })
        .then((foundUser) => {

            if (!foundUser) {
                res.status(401).json({ message: "user not found" })
                return
            }

            const passwordVerified = bcryptjs.compareSync(password, foundUser.password)

            if (passwordVerified) {
                const { _id, email, username, firstName, lastName } = foundUser

                const payload = { _id, email, username, firstName, lastName }

                const authToken = jwt.sign(
                    payload,
                    process.env.SECRET,
                    { algorithm: 'HS256', expiresIn: "6h" }
                )

                res.status(200).json({ authToken: authToken, user: payload })
            } else {
                res.status(401).json({ message: "Unable to Authenticate User" })
            }

        })
        .catch(err => res.status(500).json({ message: "Internal Server Error" }))


})



module.exports = router;