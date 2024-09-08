import express from 'express'
import { getLlmAnswer } from '../services/llm-answers.service.js'

const router = express.Router()

router.get('/', (req, res, next) => {
    getLlmAnswer(req.query, (err, result) => {
        if (result) {
            console.log(result.choices[0].message.content)
            res.status(200).json(result)
        } else {
            res.status(500).json({ "Error": "Internal server error." })
        }
    })
})

export default router