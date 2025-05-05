import http from 'node:http'
import dotenv from 'dotenv'
import { Database } from './database.js'
import { json } from './utils/utils.js'
import { randomUUID } from 'node:crypto'
dotenv.config()

const database = new Database()

const server = http.createServer(async (req, res) => {
    const { method, url } = req

    await json(res, req)

    if (method === 'GET' && url === '/users') {
        const users = database.select('users')

        return res
            .end(JSON.stringify(users, null, 2))
    }

    if (method === 'POST' && url === '/users') {
        const { name, email } = req.body
        const user = {
            id: randomUUID(),
            name,
            email
        }

        database.insert('users', user)

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