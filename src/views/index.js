const Item = require("../models/item")
const Tenant = require("../models/tenant")
const User = require('../models/user')
const BlacklistedToken = require('../models/blacklisted-token')
const { sign } = require('../utils/jwt')

const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.schema.statics.findByCredentials(email, password)
    if (!user) {
        res.status(401).send({ error: "Invalid email and/or password" }).end()
    }
    user.lastLogin = Date.now()
    await user.save()
    const token = sign({ userID: user._id })
    const data = { user, token }
    res.json(data).status(200).end()
}

const logout = async (req, res) => {
    const data = { message: "Logout successful" }
    try {
        await BlacklistedToken.create({ token: req.token })
    } catch (error) {
        data.error = "No token to blacklist"
    }
    res.json(data).status(200).end()
}

const index = async (req, res) => {
    const data = {
        name: "API",
        user: req.user,
        database: {
            users: await User.find({}),
            tenants: await Tenant.find({}),
            items: await Item.find({})
        }
    }
    res.json(data).status(200).end()
}

module.exports = {
    index,
    login,
    logout
}
