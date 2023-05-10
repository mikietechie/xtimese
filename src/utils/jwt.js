const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('./constants')

const sign = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' })
}

const verify = (token) => {
    return jwt.verify(token, SECRET_KEY)
}


module.exports = {
    SECRET_KEY,
    sign,
    verify
}