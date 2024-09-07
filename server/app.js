const express = require('express')

const app = express()
const server = https.createServer({ key: key, cert: cert }, app)
const port = process.env.PORT || 443

app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})

server.listen(port, () => {
    console.log(`App listening on port ${port}.`)
})