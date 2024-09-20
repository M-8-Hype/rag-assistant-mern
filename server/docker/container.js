import docker from './client.js'

export default async function startContainer(containerName, imageName, imageTag, httpPort, grpcPort = null, hostDirectory, containerDirectory) {
    try {
        const containers = await docker.listContainers({all: true})
        const foundContainer = containers.find(container => container.Names.includes(`/${containerName}`))

        if (foundContainer && foundContainer.State === 'running') {
            console.log(`${containerName} is already running.`)
        } else if (foundContainer) {
            const container = docker.getContainer(foundContainer.Id)
            await container.start()
            console.log(`${containerName} has been started.`)
        } else {
            await pullImage(imageName, imageTag)
            const container = await createContainer(containerName, imageName, imageTag, httpPort, grpcPort, hostDirectory, containerDirectory)
            await container.start()
            console.log(`${containerName} container has been created and started.`)
        }
    } catch (e) {
        console.error(`Error starting ${containerName} container: ${e.message}`)
        process.exit(1)
    }
}

async function createContainer(containerName, imageName, imageTag, httpPort, grpcPort, hostDirectory, containerDirectory) {
    const exposedPorts = {
        [`${httpPort}/tcp`]: {}
    }
    const portBindings = {
        [`${httpPort}/tcp`]: [{ HostPort: `${httpPort}` }]
    }
    if (grpcPort) {
        exposedPorts[`${grpcPort}/tcp`] = {}
        portBindings[`${grpcPort}/tcp`] = [{ HostPort: `${grpcPort}` }]
    }

    return await docker.createContainer({
        Image: `${imageName}:${imageTag}`,
        name: `${containerName}`,
        ExposedPorts: exposedPorts,
        HostConfig: {
            PortBindings: portBindings,
            Binds: [`${process.cwd()}${hostDirectory}:${containerDirectory}`],
        }
    })
}

async function pullImage(imageName, imageTag) {
    await new Promise((resolve, reject) => {
        docker.pull(`${imageName}:${imageTag}`, (err, stream) => {
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
        })
    })
}