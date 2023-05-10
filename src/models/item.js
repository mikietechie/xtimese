const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    imgURL: String,
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    }
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item
