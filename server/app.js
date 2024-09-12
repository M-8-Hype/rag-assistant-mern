import 'dotenv/config'
import express from 'express'
import fs from 'fs'
import https from 'https'
import llmAnswersRoute from './routes/llm-answers.route.js'
import initializeData from './database/data-init.js'
import { startQdrant, createQdrantCollection } from "./database/embedding.js"

const app = express()
const key = fs.readFileSync('./certificates/key.pem')
const cert = fs.readFileSync('./certificates/cert.pem')
const server = https.createServer({ key: key, cert: cert }, app)
const HTTPS_PORT = process.env.HTTPS_PORT || 443

app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/api/llm-answers', llmAnswersRoute)

async function startServer() {
    await startQdrant()

    const dataAvailable = true
    if (!dataAvailable) {
        const allChunks = await initializeData()
        console.log(allChunks.length)
        console.log(allChunks[0])
    }

    await createQdrantCollection('myCollectionShort')

    server.listen(HTTPS_PORT, () => {
        console.log(`App listening on port ${HTTPS_PORT}.`)
    })
}

startServer()