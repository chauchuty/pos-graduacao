import http from 'node:http'
import dotenv from 'dotenv'
import { json } from './utils/utils.js'
import { routes } from './routes.js'
dotenv.config()


const server = http.createServer(async (req, res) => {

    await json(res, req)

    const route = routes.find(route => {
        return route.method === req.method && route.path == req.url
    })

    if (route) {
        return route.handler(req, res)
    }

    res
        .writeHead(404)
        .end('Not found')
})

server.listen(3000, () => {
    console.log(`Server running at ${process.env.API_URL}:${process.env.API_PORT}`)
})