import { createEmbeddings } from '../database/embedding.js'
import { client } from '../database/vector.js'

export async function queryDatabase(query, collectionName) {
    const embedding = await createEmbeddings(query)
    const vector = Array.from(embedding[0])
    return await client.query(collectionName, {
        query: vector,
        limit: 3,
        with_payload: true
    })
}

export function convertQueryToText(query) {
    const array = Array.from(query.points).map(point => point.payload.text)
    return array.join('\n\n')
}