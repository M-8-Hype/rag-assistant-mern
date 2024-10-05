import { QdrantClient } from "@qdrant/js-client-rest"
import startContainer from '../docker/container.js'
import logger from '../config/logger.js'
import { createEmbeddings } from './embedding.js'

const QDRANT_HTTP_PORT = process.env.QDRANT_HTTP_PORT || 6333
const QDRANT_GRPC_PORT = process.env.QDRANT_GRPC_PORT || 6334

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

export async function createQdrantCollection(collectionName) {
    try {
        const exists = (await client.collectionExists(collectionName)).exists
        if (!exists) {
            await client.createCollection(collectionName, {
                vectors: {
                    size: 384,
                    distance: 'Cosine'
                }
            })
            console.log(`Collection ${collectionName} has been created.`)
        } else {
            console.log(`Collection ${collectionName} already exists.`)
        }
    } catch (e) {
        console.error(`Error creating Qdrant collection: ${e.message}`)
    }
}

async function upsertEmbeddings(chunks, embeddings, collectionName, overwrite, isFirstBatch, idOffset) {
    try {
        const collectionInfo = await client.getCollection(collectionName)
        if (collectionInfo.points_count === 0 || overwrite) {
            if (collectionInfo.points_count > 0 && isFirstBatch) {
                await client.delete(collectionName, { filter: {} })
                logger.info('Qdrant: Collection cleared.')
            }
            const points = chunks.map((chunk, index) => ({
                id: index + idOffset,
                vector: Array.from(embeddings[index].data),
                payload: { text: chunk }
            }))
            await client.upsert(collectionName, { points })
            logger.single('Qdrant: Embeddings upserted.')
        } else {
            logger.info('Qdrant: Collection is not empty.')
        }
    } catch (e) {
        logger.error(`Error upserting embeddings: ${e.message}`)
    }
}

export async function upsertEmbeddingsInBatches(chunks, collectionName, batchSize = 30, overwrite = false) {
    try {
        const startTime = Date.now()
        let isFirstBatch = true
        let idOffset = 0
        let chunkLength = chunks.length
        for (let i = 0; i < chunkLength; i += batchSize) {
            const idStart = idOffset
            const idEnd = idOffset + batchSize
            const idRange = idEnd > chunkLength ? chunkLength : idEnd
            logger.process(`Processing embeddings [${idStart + 1}-${idRange}/${chunkLength}]: ${Math.round(idStart / chunkLength * 100)}%`)
            const chunkBatch = chunks.slice(i, i + batchSize)
            const embeddingsBatch = await createEmbeddings(chunkBatch, batchSize)
            await upsertEmbeddings(chunkBatch, embeddingsBatch, collectionName, overwrite, isFirstBatch, idOffset)
            isFirstBatch = false
            idOffset += batchSize
        }
        const endTime = Date.now()
        logger.process(`Finished processing embeddings: 100%`)
        logger.info(`Execution time [vector.js/upsertEmbeddingsInBatches]: ${((endTime - startTime) / 1000).toFixed(1)}s`)
    } catch (e) {
        logger.error(`Error upserting embeddings in batches: ${e.message}`)
    }
}

// async function stopQdrant() {
//     try {
//         const container = docker.getContainer('qdrant')
//         const containerInfo = await container.inspect()
//
//         if (containerInfo.State.Running) {
//             await container.stop()
//             console.log('Qdrant container stopped.')
//         } else {
//             console.log('Qdrant container is not running.')
//         }
//     } catch (error) {
//         console.error(`Error stopping Qdrant container: ${error.message}`)
//     }
// }
//
// process.on('SIGINT', async () => {
//     console.log('Caught interrupt signal (SIGINT)')
//     await stopQdrant()
//     process.exit(0)
// })