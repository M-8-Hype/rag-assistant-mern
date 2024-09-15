import 'dotenv/config'
import express from 'express'
import fs from 'fs'
import https from 'https'
import llmAnswersRoute from './routes/llm-answers.route.js'
import { initializeData, testFunctions } from './database/data.js'
import { createEmbeddings } from "./database/embedding.js"
import { startQdrant, createQdrantCollection, upsertEmbeddings } from './database/vector.js'
import { queryVectorDatabase, convertQueryToText } from './middleware/query-vector-db.js'

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
    const collectionName = 'myCollectionShort'
    await createQdrantCollection(collectionName)

    const dataAvailable = false
    if (!dataAvailable) {
        try {
            const chunks = await initializeData()
            const embeddings = await createEmbeddings(chunks)
            await upsertEmbeddings(chunks, embeddings, collectionName, false)
            // const query = await queryDatabase('register shutdown hook', collectionName)
            // console.log(`Text for the LLM:\n${convertQueryToText(query)}`)
            // console.log('Embeddings created.')
        } catch (e) {
            console.error(`Error creating embeddings: ${e.message}`)
        }
    }

    server.listen(HTTPS_PORT, () => {
        console.log(`App listening on port ${HTTPS_PORT}.`)
    })
}

startServer()

// testFunctions()