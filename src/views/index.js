const Item = require("../models/item")
const Tenant = require("../models/tenant")
const User = require('../models/user')
const { sign } = require('../utils/jwt')

const login = async (req, res) => {
    const { username, password } = req.body
    const user = await User.schema.statics.findByCredentials(username, password)
    if (!user) {
        res.status(401).send({ error: "Invalid username and/or password" }).end()
    }
    console.log(user)
    const token = sign({ userID: user._id })
    const data = { user, token }
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
    login
}
