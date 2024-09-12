import Docker from 'dockerode'
import { QdrantClient } from "@qdrant/js-client-rest"

const QDRANT_HTTP_PORT = process.env.QDRANT_HTTP_PORT || 6333
const QDRANT_GRPC_PORT = process.env.QDRANT_GRPC_PORT || 6334

const docker = new Docker()
const client = new QdrantClient({ host: "localhost", port: QDRANT_HTTP_PORT })

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
    }
}

export async function createQdrantCollection(name) {
    try {
        const exists = (await client.collectionExists(name)).exists
        if (!exists) {
            await client.createCollection(name, {
                vectors: {
                    size: 384,
                    distance: 'Cosine'
                }
            })
            console.log(`Collection ${name} has been created.`)
        } else {
            console.log(`Collection ${name} already exists.`)
        }
    } catch (e) {
        console.error(`Error creating Qdrant collection: ${e.message}`)
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