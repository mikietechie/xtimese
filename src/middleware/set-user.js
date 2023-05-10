const { verify } = require("../utils/jwt")
const User = require("../models/user")

const setUser = async (req, res, next) => {
    const authTokens = req.headers.authorization
    req.filters = {}
    try {
        if (authTokens) {
            const token = authTokens.split(" ")[1]
            const payload = verify(token)
            const user = await User.findById(payload.userID).select("-password")
            req.payload = payload
            req.token = token
            if (user) {
                req.user = user
                if (user.role !== "superuser") {
                    req.filters.tenant = user.tenant
                }
            }
        }
    } catch (error) {
        // throw error
    }
    next()
}

module.exports = setUser