import { createEmbeddings } from '../database/embedding.js'
import { client } from '../database/vector.js'

export async function queryVectorDatabase(req, res, next) {
    const query = req.body.query
    try {
        const embedding = await createEmbeddings(query)
        const vector = Array.from(embedding[0])
        const queryAnswer = await client.query('myCollectionShort', {
            query: vector,
            limit: 3,
            with_payload: true
        })
        // res.locals.llmText = `Text for the LLM:\n${convertQueryToText(queryAnswer)}`
        res.locals.llmText = 'Please tell me briefly about tanukis.'
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