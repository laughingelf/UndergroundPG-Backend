
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

async function mailer() {
    console.log('mailer')
    // const date = new Date()
    // const mail = {
    //     id: createdUser._id,
    //     created: date.toString()
    // }

    // const emailToken = jwt.sign(
    //     mail,
    //     process.env.EMAIL_TOKEN_SECRET,
    //     { algorithm: 'HS256', expiresIn: "1d" }
    // )



    let transporter = nodemailer.createTransport('SMTP', {
        auth: {

        }
    })

    let info = await transporter.sendMail({
        from: 'info@gmail.com',
        to: 'jaygery90@gmail.com',
        subject: 'Email Verification - UndergroundPG',
        text: 'You better verify buster',
    })
        .catch((err) => {
            console.log(err)
        })

    console.log('message sent', info.messageId)

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))


}






module.exports = mailer;





