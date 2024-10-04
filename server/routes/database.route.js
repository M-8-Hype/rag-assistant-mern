import express from 'express'
import { createDatabase, getDatabases } from '../services/database.service.js'

const router = express.Router()

router.get('/', (req, res) => {
    getDatabases(req.query, (err, result) => {
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(500).json({ "Error": "Internal server error." })
        }
    })
})

router.post('/', (req, res) => {
    createDatabase(req.body, (err, result) => {
        if (result) {
            res.status(201).json(result)
        } else {
            res.status(500).json({ "Error": "Internal server error." })
        }
    })
})

export default router