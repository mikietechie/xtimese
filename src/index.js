const express = require('express')
const http = require('http')
const cors = require('cors')
const initDB = require('./utils/init-db')
const { index, login } = require('./views/index')
const setUser = require('./middleware/set-user')
const loginRequired = require('./middleware/login-required')


// CREATE EXPRESS APP
const app = express()

// MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(setUser)

// ROUTES
app.get('/', index)
app.post('/login', login)
app.use("/users", loginRequired, require('./views/users'))
app.use("/tenants", loginRequired, require('./views/tenants'))
app.use("/items", loginRequired, require('./views/items'))

// RUN SERVER
const port = process.env.PORT || 3000
const server = http.createServer(app)
server.listen(port, async () => {
    // Server is listening
    await initDB()
    console.log(`listening on http://localhost:${port}`)
})
