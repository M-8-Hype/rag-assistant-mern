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

import { getUrlsFromSitemap, scrapeTextFromUrl, scrapeTextFromUrlLangchain, splitText } from "./database/data-init.js"

const urls = await getUrlsFromSitemap()
// const urlTextPromises = urls.map(async (url) => {
//     const text = await scrapeTextFromUrlLangchain(url)
//     return text
// })
// const urlDocs = await Promise.all(urlTextPromises)

const urlDocs = await scrapeTextFromUrlLangchain(urls[0])

console.log(urlDocs.length)
console.log(urlDocs[0].pageContent.length)

const chunks = await splitText(urlDocs)
console.log(chunks.length)
console.log(chunks[0].pageContent.length)
console.log(chunks[0].pageContent)