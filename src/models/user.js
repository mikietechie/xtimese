const mongoose = require('mongoose')
const crypto = require('crypto')
const nodemailer = require("nodemailer")
const { SECRET_KEY } = require('../utils/constants')
const { mailer } = require('../utils/mailer')

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: function () {
            return this.role !== 'superuser'
        }
    },
    role: {
        type: String,
        enum: ['superuser', 'admin', 'user'],
        default: 'user',
        required: true
    },
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Pre Hooks
userSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const mailRes = await mailer.sendMail({
                from: "hi@google.com",
                to: this.email,
                subject: "Welcome to our app!",
                text: `Your email is ${this.email} and your password is ${this.password}`
            })
            console.log(nodemailer.getTestMessageUrl(mailRes))
        } catch (error) {
            console.log("Failed to send email!!! as Expected!")
        }
    }
    if (this.isModified('password')) {
        const hash = crypto.createHmac('sha256', SECRET_KEY).update(this.password).digest('hex')
        this.password = hash
    }
    return next()
})

// Virtual Property
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

// Static Methods
userSchema.statics.findByCredentials = async function (email, password) {
    const hash = crypto.createHmac('sha256', SECRET_KEY).update(password).digest('hex')
    const user = await User.findOne({ email, password: hash })
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User

