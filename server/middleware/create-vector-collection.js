import { initializeData } from '../database/data.js'
import { createQdrantCollection, upsertEmbeddingsInBatches } from '../database/vector.js'

export async function createVectorCollection(req, res, next) {
    const { baseUrl, urls } = req.body.metadata
    const { game, version } = req.body
    const sitemapUrl = `${baseUrl}/sitemap.xml`
    const collectionName = (game.replace(" ", "").toLowerCase()).concat("-", version)
    res.locals.collectionName = collectionName
    try {
        await createQdrantCollection(collectionName)
        // TODO: Handle all URLs.
        const chunks = await initializeData(urls.slice(0, 1))
        await upsertEmbeddingsInBatches(chunks, collectionName, 30, true)
        next()
    } catch (e) {
        console.error(`Error creating embeddings: ${e.message}`)
        res.status(500).json({ "Error": "Internal database error." })
    }
}