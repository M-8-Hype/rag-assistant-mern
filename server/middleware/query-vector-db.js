import { createEmbeddings } from '../database/embedding.js'
import { client } from '../database/vector.js'
import logger from '../config/logger.js'

export async function queryVectorDatabase(req, res, next) {
    const { prompt: query, database } = req.body
    try {
        const embedding = await createEmbeddings([query], 1)
        const vector = Array.from(embedding[0])
        const queryAnswer = await client.query(database, {
            query: vector,
            limit: 3,
            with_payload: true
        })
        logger.single(`Query answer:\n${JSON.stringify(queryAnswer)}`)
        res.locals.llmText = convertQueryToText(queryAnswer)
        next()
    } catch (e) {
        console.error('Error querying the database:', e.message)
        res.status(500).json({ "Error": "Internal database error." })
    }
}

export function convertQueryToText(query) {
    const array = Array.from(query.points).map(point => point.payload.text)
    return array.join('\n\n')
}