import { QdrantClient } from "@qdrant/js-client-rest"
import startContainer from '../docker/container.js'

const QDRANT_HTTP_PORT = process.env.QDRANT_HTTP_PORT || 6333
const QDRANT_GRPC_PORT = process.env.QDRANT_GRPC_PORT || 6334

export const client = new QdrantClient({ host: "localhost", port: QDRANT_HTTP_PORT })

export async function startQdrant() {
    try {
        await startContainer(
            'qdrant',
            'qdrant/qdrant',
            'v1.11.3',
            QDRANT_HTTP_PORT,
            QDRANT_GRPC_PORT,
            '/storage/qdrant',
            '/qdrant/storage'
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

export async function upsertEmbeddings(chunks, embeddings, collectionName, overwrite = false) {
    const points = chunks.map((chunk, index) => ({
        id: index,
        vector: Array.from(embeddings[index].data),
        payload: { text: chunk }
    }))
    const collectionInfo = await client.getCollection(collectionName)
    if (collectionInfo.points_count === 0 || overwrite) {
        if (collectionInfo.points_count > 0) {
            await client.delete(collectionName, { filter: {} })
            console.log('Collection cleared.')
        }
        await client.upsert(collectionName, { points })
        console.log('Embeddings upserted.')
    } else {
        console.log('Collection is not empty.')
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