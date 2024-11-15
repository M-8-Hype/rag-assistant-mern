import { createEmbeddings } from '../database/embedding.js'
import { client } from '../database/vector.js'
import logger from '../config/logger.js'

export async function queryVectorDatabase(req, res, next) {
    const { prompt: query, database } = req.body
    logger.single(`Request body:\n${JSON.stringify(req.body)}`)
    try {
        const startTime = Date.now()
        const embedding = await createEmbeddings([query], 1)
        // logger.single(`Query embedding:\n${JSON.stringify(embedding)}`)
        const vector = Array.from(embedding[0])
        const queryAnswer = await client.query(database, {
            query: vector,
            limit: 5,
            with_payload: true
        })
        const endTime = Date.now()
        logger.info(`Execution time [query-vector-db.js/queryVectorDatabase]: ${((endTime - startTime) / 1000).toFixed(1)}s`)
        // logger.single(`Query answer:\n${JSON.stringify(queryAnswer)}`)
        res.locals.llmText = convertQueryToText(queryAnswer)

        // Actual code:
        next()

        // Testing code:
        // const filteredQueryAnswer = queryAnswer.points.map(point => ({
        //     id: point.id,
        //     score: point.score
        // }))
        // logger.single(`Response body (filtered):\n${JSON.stringify(filteredQueryAnswer)}`)
        // res.status(201).json(filteredQueryAnswer)
    } catch (e) {
        console.error('Error querying the database:', e.message)
        res.status(500).json({ "Error": "Internal database error." })
    }
}

export function convertQueryToText(query) {
    const array = Array.from(query.points).map(point => point.payload.text)
    return array.join('\n\n')
}