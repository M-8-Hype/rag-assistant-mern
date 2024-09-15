import express from 'express'
import { getLlmAnswer } from '../services/llm-answers.service.js'
import { queryVectorDatabase } from '../middleware/query-vector-db.js'

const router = express.Router()

router.post('/', queryVectorDatabase, (req, res) => {
    getLlmAnswer(res.locals.llmText, (err, result) => {
        if (result) {
            console.log(result.choices[0].message.content)
            res.status(200).json(result)
        } else {
            res.status(500).json({ "Error": "Internal server error." })
        }
    })
})

export default router