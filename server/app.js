// import express from 'express'
// import fs from 'fs'
// import https from 'https'
// import llmAnswersRoute from './routes/llm-answers.route.js'
//
// const app = express()
// const key = fs.readFileSync('./certificates/key.pem')
// const cert = fs.readFileSync('./certificates/cert.pem')
// const server = https.createServer({ key: key, cert: cert }, app)
// const port = process.env.PORT || 443
//
// app.use(express.json())
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })
// app.use('/api/llm-answers', llmAnswersRoute)
//
// server.listen(port, () => {
//     console.log(`App listening on port ${port}.`)
// })

import { getUrlsFromSitemap, scrapeTextFromUrl, splitText } from "./database/data-init.js"

const urls = await getUrlsFromSitemap()

const urlChunkPromises = urls.map(async (url) => {
    const text = await scrapeTextFromUrl(url)
    console.log(`Text length: ${text.length}`)
    const chunks = await splitText(text)
    console.log(`Chunk length: ${chunks.length}`)
    return chunks
})

const urlChunks = await Promise.all(urlChunkPromises)
const allChunks = urlChunks.flat()

console.log(allChunks.length)