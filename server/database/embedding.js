import Docker from 'dockerode'

const docker = new Docker()

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
                ExposedPorts: { '6333/tcp': {}, '6334/tcp': {} },
                HostConfig: {
                    PortBindings: {
                        '6333/tcp': [{ HostPort: '6333' }],
                        '6334/tcp': [{ HostPort: '6334' }]
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

// async function stopQdrant() {
//     try {
//         const container = docker.getContainer('qdrant');
//         const containerInfo = await container.inspect();
//
//         if (containerInfo.State.Running) {
//             await container.stop();
//             console.log('Qdrant container stopped.');
//         } else {
//             console.log('Qdrant container is not running.');
//         }
//     } catch (error) {
//         console.error(`Error stopping Qdrant container: ${error.message}`);
//     }
// }
//
// process.on('SIGINT', async () => {
//     console.log('Caught interrupt signal (SIGINT)');
//     await stopQdrant();
//     process.exit(0);
// });