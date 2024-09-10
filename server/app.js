import express from 'express'
import fs from 'fs'
import https from 'https'
import llmAnswersRoute from './routes/llm-answers.route.js'
import initializeData from "./database/data-init.js"

const app = express()
const key = fs.readFileSync('./certificates/key.pem')
const cert = fs.readFileSync('./certificates/cert.pem')
const server = https.createServer({ key: key, cert: cert }, app)
const port = process.env.PORT || 443

app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/api/llm-answers', llmAnswersRoute)

async function startServer() {
    const dataAvailable = true
    if (!dataAvailable) {
        const allChunks = await initializeData()
        console.log(allChunks.length)
        console.log(allChunks[0])
    }

    server.listen(port, () => {
        console.log(`App listening on port ${port}.`)
    })
}

startServer()