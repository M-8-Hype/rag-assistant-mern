import { initializeData } from '../database/data.js'
import { createQdrantCollection, upsertEmbeddingsInBatches } from '../database/vector.js'

export async function createVectorCollection(req, res, next) {
    const { game, version } = req.body
    const collectionName = (game.replace(" ", "").toLowerCase()).concat("-", version)
    res.locals.collectionName = collectionName
    try {
        await createQdrantCollection(collectionName)
        const chunks = await initializeData(req, res)
        await upsertEmbeddingsInBatches(chunks, collectionName, 30, true)
        next()
    } catch (e) {
        console.error(`Error creating embeddings: ${e.message}`)
        res.status(500).json({ "Error": "Internal database error." })
    }
}