import http from 'node:http'
import dotenv from 'dotenv'

dotenv.config()

const users = []

const server = http.createServer(async (req, res) => {
    const { method, url } = req
    const buffers = []
    
    for await (const chunk of req) {
        buffers.push(chunk)
    }

    try {
        req.body = Buffer.concat(buffers).toString()
    } catch {
        req.body = null
    }

    console.log(req.body)

    if (method === 'GET' && url === '/users') {
        return res
                .setHeader('Content-Type', 'application/json')
                .end(JSON.stringify(users, null, 2))
    }

    if (method === 'POST' && url === '/users') {
        users.push({
            id: 1,
            name: 'John Doe',
            email: 'joe@gmail.com'
        })
        return res
                .writeHead(201)
                .end('Criação de usuários')
    }
    res
        .writeHead(404)
        .end('Not found')
})

server.listen(3000, () => {
    console.log(`Server running at ${process.env.API_URL}:${process.env.API_PORT}`)
})