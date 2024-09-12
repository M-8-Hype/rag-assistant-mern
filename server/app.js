import 'dotenv/config'
import express from 'express'
import fs from 'fs'
import https from 'https'
import llmAnswersRoute from './routes/llm-answers.route.js'
import initializeData from './database/data-init.js'
import { startQdrant, createQdrantCollection, createEmbeddings } from "./database/embedding.js"

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
    await createQdrantCollection('myCollectionShort')

    const dataAvailable = true
    if (!dataAvailable) {
        const chunks = await initializeData()
        try {
            const embeddings = await createEmbeddings(chunks)
            console.log('Embeddings created.')
            console.log(typeof embeddings)
        } catch (e) {
            console.error(`Error creating embeddings: ${e.message}`)
        }
    }

    server.listen(HTTPS_PORT, () => {
        console.log(`App listening on port ${HTTPS_PORT}.`)
    })
}

startServer()