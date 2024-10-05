import express from 'express'
import { createDatabase, getDatabases } from '../services/database.service.js'
import { createVectorCollection } from '../middleware/create-vector-collection.js'

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

router.post('/', createVectorCollection, (req, res) => {
    createDatabase(req.body, res.locals.collectionName, (err, result) => {
        if (result) {
            res.status(201).json(result)
        } else {
            res.status(500).json({ "Error": "Internal server error." })
        }
    })
})

export default router