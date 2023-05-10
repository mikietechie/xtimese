const mongoose = require('mongoose')

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

tenantSchema.pre("save", async function (next) {
    if (this.isNew || !this.admin) {
        const user = await mongoose.model('User').create({
            username: `${this.id}-admin`,
            password: `${this.id}`,
            tenant: this._id,
            role: "admin"
        })
        this.admin = user._id
    }
    next()
})

tenantSchema.pre("remove", async function (next) {
    // TODO: username users that their tenant is being deleted
    const models = mongoose.modelNames()
    for (const model of models) {
        if (model === "Tenant") continue
        await mongoose.model(model).deleteMany({tenant: this._id})
    }
    next()
})

const Tenant = mongoose.model('Tenant', tenantSchema)

module.exports = Tenant

