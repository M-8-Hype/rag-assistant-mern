import Docker from 'dockerode'
import { QdrantClient } from "@qdrant/js-client-rest"
import { pipeline } from '@xenova/transformers'

const QDRANT_HTTP_PORT = process.env.QDRANT_HTTP_PORT || 6333
const QDRANT_GRPC_PORT = process.env.QDRANT_GRPC_PORT || 6334

const docker = new Docker()
const client = new QdrantClient({ host: "localhost", port: QDRANT_HTTP_PORT })
const extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

export async function startQdrant() {
    try {
        const containers = await docker.listContainers({ all: true })
        const qdrantContainer = containers.find(container => container.Names.includes('/qdrant'))

        if (qdrantContainer && qdrantContainer.State === 'running') {
            console.log('Qdrant is already running.')
        } else if (qdrantContainer) {
            const container = docker.getContainer(qdrantContainer.Id)
            await container.start()
            console.log('Qdrant has been started.')
        } else {
            await new Promise((resolve, reject) => {
                docker.pull('qdrant/qdrant', (err, stream) => {
                    if (err) {
                        return reject(err)
                    }
                    docker.modem.followProgress(stream, onFinished, onProgress)

                    function onFinished(err, output) {
                        if (err) {
                            return reject(err)
                        }
                        resolve(output)
                    }

                    function onProgress(event) {
                        console.log(event.status)
                    }
                });
            });

            const container = await docker.createContainer({
                Image: 'qdrant/qdrant',
                name: 'qdrant',
                ExposedPorts: {
                    [`${QDRANT_HTTP_PORT}/tcp`]: {},
                    [`${QDRANT_GRPC_PORT}/tcp`]: {}
                },
                HostConfig: {
                    PortBindings: {
                        [`${QDRANT_HTTP_PORT}/tcp`]: [{ HostPort: `${QDRANT_HTTP_PORT}` }],
                        [`${QDRANT_GRPC_PORT}/tcp`]: [{ HostPort: `${QDRANT_GRPC_PORT}` }]
                    },
                    Binds: [`${process.cwd()}/qdrant_storage:/qdrant/storage`],
                }
            });
            await container.start()
            console.log('Qdrant container has been created and started.')
        }
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

export async function createEmbeddings(chunks) {
    const extractor = await extractorPromise
    return await extractor(chunks, {
        pooling: 'mean',
        normalize: true
    })
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