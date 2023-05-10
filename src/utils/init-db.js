const mongoose = require('mongoose')

const initDB = async () => {
    // CONNECT TO MONGODB
    mongoose.set("strictQuery", false)
    await mongoose.connect('mongodb://localhost:27017/Test1', {})
}

module.exports = initDB
