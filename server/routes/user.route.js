import express from 'express'
import { getUsers, createUser } from '../services/user.service.js'

const router = express.Router()

router.get('/', (req, res) => {
    getUsers(req.query, (err, result) => {
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(500).json({ "Error": "Internal server error." })
        }
    })
})

router.post('/', (req, res) => {
    createUser(req.body, (err, result) => {
        if (result) {
            res.status(201).json(result)
        } else {
            res.status(500).json({ "Error": "Internal server error." })
        }
    })
})

export default router