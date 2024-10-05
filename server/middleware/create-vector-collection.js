import { initializeData } from '../database/data.js'
import { createQdrantCollection, upsertEmbeddingsInBatches } from '../database/vector.js'

export async function createVectorCollection(req, res, next) {
    const sitemapUrl = 'https://docs.spring.io/spring-boot/sitemap.xml'
    const collectionName = 'myCollectionShort-new'
    try {
        await createQdrantCollection(collectionName)
        const chunks = await initializeData(null, sitemapUrl)
        await upsertEmbeddingsInBatches(chunks, collectionName, 30, true)
        next()
    } catch (e) {
        console.error(`Error creating embeddings: ${e.message}`)
        res.status(500).json({ "Error": "Internal database error." })
    }
}