var express = require('express');
var router = express.Router();
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')



const saltRounds = 10



const User = require('../models/User.model')
const mailer = require('../services/mailer')
const isAuthenticated = require('../middleware/isAuthenticated')


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

                    const { _id, username, email } = createdUser
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

                    //script to send email. **currently not working
                    // mailer() 

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
                //this checks if the user have verified email. **functionality not currently working
                // if (!foundUser.isVerified) { 
                //     return res.status(401).json({ message: "Your email has not been verfied" }) 
                // }
                const { _id, email, username, firstName, lastName, birthdate, profilePic, mathLevel, letterLevel, wordLevel, numberLevel, isVerified } = foundUser

                const payload = { _id, email, username, firstName, lastName, birthdate, profilePic, mathLevel, letterLevel, wordLevel, numberLevel, isVerified }

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


router.get('/verify', isAuthenticated, (req, res, next) => {
    console.log('verifying id', req.user)
    User.findById(req.user._id)
        .then((foundUser) => {
            delete foundUser._doc.password
            console.log('founding', foundUser)
            res.status(200).json(foundUser)
        })
        .catch((err) => {
            console.log(err)
        })
})



module.exports = router;