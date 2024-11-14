import { QdrantClient } from "@qdrant/js-client-rest"
import startContainer from '../docker/container.js'
import logger from '../config/logger.js'
import { createEmbeddings } from './embedding.js'
import { TRANSFORMER_MODELS } from '../utils/constants.js'

const QDRANT_HTTP_PORT = process.env.QDRANT_HTTP_PORT || 6333
const QDRANT_GRPC_PORT = process.env.QDRANT_GRPC_PORT || 6334
const { dimensions } = TRANSFORMER_MODELS["Jina DE"]

export const client = new QdrantClient({ host: "localhost", port: QDRANT_HTTP_PORT })

export async function startQdrant() {
    try {
        await startContainer(
            'qdrant',
            'qdrant/qdrant',
            'v1.11.3',
            '/storage/qdrant',
            '/qdrant/storage',
            QDRANT_HTTP_PORT,
            QDRANT_GRPC_PORT,
        )
    } catch (e) {
        console.error(`Error managing Qdrant container: ${e.message}`)
        process.exit(1)
    }
}

export async function createQdrantCollection(collectionName, resObject) {
    try {
        const exists = (await client.collectionExists(collectionName)).exists
        if (!exists) {
            await client.createCollection(collectionName, {
                vectors: {
                    size: dimensions,
                    distance: 'Cosine'
                }
            })
            logger.single(`Qdrant: Collection ${collectionName} created.`)
        } else {
            logger.single(`Qdrant: Collection ${collectionName} already exists.`)
        }
        resObject.locals.modelDimensions = dimensions
    } catch (e) {
        logger.error(`Qdrant: Error creating Qdrant collection, ${e.message}.`)
    }
}

async function upsertEmbeddings(chunks, embeddings, collectionName, startId) {
    try {
        const points = chunks.map((chunk, index) => ({
            id: startId + index,
            vector: Array.from(embeddings[index].data),
            payload: { text: chunk }
        }))
        await client.upsert(collectionName, { points })
        logger.single('Qdrant: Embeddings upserted.')
    } catch (e) {
        logger.error(`Error upserting embeddings: ${e.message}`)
    }
}

export async function upsertEmbeddingsInBatches(chunks, collectionName, resObject, batchSize = 30, overwrite = false) {
    try {
        const startTime = Date.now()
        let chunkLength = chunks.length
        let collectionInfo = await client.getCollection(collectionName)
        let startId = 0
        let isFirstBatch = true
        if (!overwrite) {
            startId = collectionInfo.points_count || 0
        }
        for (let i = 0; i < chunkLength; i += batchSize) {
            const chunkBatch = chunks.slice(i, i + batchSize)
            const embeddingsBatch = await createEmbeddings(chunkBatch, batchSize, resObject)
            if (overwrite && isFirstBatch && collectionInfo.points_count > 0) {
                await client.delete(collectionName, { filter: {} })
                logger.info('Qdrant: Collection cleared.')
                startId = 0
                isFirstBatch = false
            }
            const idRangeEnd = Math.min(i + batchSize, chunkLength)
            logger.process(`Processing embeddings [${i + 1}-${idRangeEnd}/${chunkLength}]: ${Math.round(i / chunkLength * 100)}%`)
            await upsertEmbeddings(chunkBatch, embeddingsBatch, collectionName, startId)
            startId += chunkBatch.length
        }
        collectionInfo = await client.getCollection(collectionName)
        resObject.locals.chunkCount = collectionInfo.points_count
        const endTime = Date.now()
        logger.process(`Finished processing embeddings: 100%`)
        logger.info(`Execution time [vector.js/upsertEmbeddingsInBatches]: ${((endTime - startTime) / 1000).toFixed(1)}s`)
    } catch (e) {
        logger.error(`Error upserting embeddings in batches: ${e.message}`)
    }
}