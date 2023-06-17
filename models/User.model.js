const { model, Schema } = require('mongoose')

const userSchema = new Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
        username: { type: String },
        email: { type: String },
        birthdate: { type: Date },
        password: { type: String },
        profilePic: { type: String },
        mathLevel: { type: Number },
        letterLevel: { type: Number },
        wordLevel: { type: Number },
        numberLevel: { type: Number },
        isVerified: { type: Boolean, default: false }
    },
    {
        timestamps: true
    });

module.exports = model('User', userSchema)