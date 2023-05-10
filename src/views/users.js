const express = require('express')
const User = require('../models/user')
const checkRole = require('../middleware/check-role')

const router = express.Router()

router.get('/', async (req, res) => {
    const items = await User.find(req.filters)
    res.send(items)
})

router.get('/:id', async (req, res) => {
    const item = await User.findOne({ _id: req.params.id, ...req.filters })
    res.json(item).status(200).end()
})

router.post('/', checkRole(["superuser", "admin"]), async (req, res) => {
    try {
        const item = new User({ ...req.body, ...req.filters })
        await item.save()
        res.send(item).status(201).end()
    } catch (error) {
        res.status(400).send({ error: String(error) }).end()
    }
})

router.put('/:id', async (req, res) => {
    try {
        const item = await User.findOneAndUpdate({ _id: req.params.id, ...req.filters }, req.body, { new: true })
        res.send(item).status(200).end()
    } catch (error) {
        res.status(400).send({ error: String(error) }).end()
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await User.findOneAndDelete({ _id: req.params.id, ...req.filters })
        res.status(204).end()
    } catch (error) {
        res.status(400).send({ error: String(error) }).end()
    }
})

module.exports = router
