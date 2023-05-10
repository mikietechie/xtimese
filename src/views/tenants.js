const express = require('express')
const Tenant = require('../models/tenant')
const checkRole = require('../middleware/check-role')

const router = express.Router()

router.get('/', checkRole("superuser"), async (req, res) => {
    const items = await Tenant.find({})
    res.send(items)
})

router.get('/:id', checkRole(["superuser", "admin"]), async (req, res) => {
    const _id = req.filters.tenant || req.params.id
    const item = await Tenant.findById(_id)
    res.json(item).status(200).end()
})

router.post('/', checkRole("superuser"), async (req, res) => {
    try {
        const tenant = new Tenant(req.body)
        await tenant.save()
        res.send(tenant).status(201).end()
    } catch (error) {
        res.status(400).send({ error: String(error) }).end()
    }
})

router.put('/:id', checkRole("superuser"), async (req, res) => {
    try {
        const item = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.send(item).status(200).end()
    } catch (error) {
        res.status(400).send({ error: String(error) }).end()
    }
})

router.delete('/:id', checkRole(["superuser", "admin"]), async (req, res) => {
    try {
        const _id = req.filters.tenant || req.params.id
        await Tenant.findByIdAndDelete(_id)
        res.status(204).end()
    } catch (error) {
        res.status(400).send({ error: String(error) }).end()
    }
})

module.exports = router
