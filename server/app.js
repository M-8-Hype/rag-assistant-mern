const express = require('express')
const fs = require('fs')
const https = require('https')

const app = express()
const key = fs.readFileSync('./certificates/key.pem')
const cert = fs.readFileSync('./certificates/cert.pem')
const server = https.createServer({ key: key, cert: cert }, app)
const port = process.env.PORT || 443

app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})

server.listen(port, () => {
    console.log(`App listening on port ${port}.`)
})