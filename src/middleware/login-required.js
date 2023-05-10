const loginRequired = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({error: "Login required"}).end()
    }
    next()
}

module.exports = loginRequired