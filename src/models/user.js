const mongoose = require('mongoose')
const crypto = require('crypto')
const { SECRET_KEY } = require('../utils/constants')

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: {
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
    }
})

// Pre Hooks
userSchema.pre('save', function (next) {
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
userSchema.statics.findByCredentials = async function (username, password) {
    const hash = crypto.createHmac('sha256', SECRET_KEY).update(password).digest('hex')
    const user = await User.findOne({username, password: hash})
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User

