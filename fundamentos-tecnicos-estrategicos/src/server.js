import http from 'node:http'
import dotenv from 'dotenv'

dotenv.config()

const server = http.createServer((req, res) => {
    res.end('Hello World')
})

server.listen(3000, () => {
    console.log(`Server running at ${process.env.API_URL}:${process.env.API_PORT}`)
})