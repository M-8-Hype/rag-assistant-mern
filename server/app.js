import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import https from 'https'
import chatHistoryRoute from './routes/chat-history.route.js'
import llmAnswersRoute from './routes/llm-answers.route.js'
import userRoute from './routes/user.route.js'
import { initializeData, testFunctions } from './database/data.js'
import { createEmbeddings } from "./database/embedding.js"
import { startQdrant, createQdrantCollection, upsertEmbeddings, upsertEmbeddingsInBatches } from './database/vector.js'
import { initDB, startMongoDb } from './database/mongo.js'

const app = express()
const key = fs.readFileSync('./certificates/key.pem')
const cert = fs.readFileSync('./certificates/cert.pem')
const server = https.createServer({ key: key, cert: cert }, app)
const HTTPS_PORT = process.env.HTTPS_PORT || 443

const corsOptions = {
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
    exposedHeaders: ['Authorization']
}
app.use(cors(corsOptions))
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/api/llm-answers', llmAnswersRoute)
app.use('/api/chat-history', chatHistoryRoute)
app.use('/api/users', userRoute)

async function startServer() {
    await startQdrant()
    const collectionName = 'myCollectionShort-new'
    await createQdrantCollection(collectionName)

    const dataAvailable = false
    if (!dataAvailable) {
        try {
            const chunks = await initializeData()
            // const embeddings = await createEmbeddings(chunks)
            // const embeddings = null
            // await upsertEmbeddings(chunks, embeddings, collectionName, true)
            await upsertEmbeddingsInBatches(chunks, collectionName, 35, true)
        } catch (e) {
            console.error(`Error creating embeddings: ${e.message}`)
        }
    }

    await startMongoDb()
    await initDB()

    server.listen(HTTPS_PORT, () => {
        console.log(`App listening on port ${HTTPS_PORT}.`)
    })
}

startServer()

// testFunctions()