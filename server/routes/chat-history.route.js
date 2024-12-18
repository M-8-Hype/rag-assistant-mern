import express from 'express'
import { getChatHistory, updateLastChatHistoryEntry } from '../services/chat-history.service.js'

const router = express.Router()

router.get('/', (req, res) => {
    getChatHistory(req.query, (err, result) => {
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(500).json({ "Error": "Internal server error." })
        }
    })
})

router.put('/', (req, res) => {
    updateLastChatHistoryEntry(req.query, req.body, (err, result) => {
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(500).json({ "Error": "Internal server error." })
        }
    })
})

export default router