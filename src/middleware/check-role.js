const checkRole = (role) => (req, res, next) => {
    if (!role.includes(req.user.role)) {
        return res.status(403).send({error: "Forbidden"}).end()
    }
    next()
}

module.exports = checkRole
