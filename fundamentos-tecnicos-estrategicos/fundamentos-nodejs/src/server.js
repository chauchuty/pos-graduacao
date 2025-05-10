import http from 'node:http'
import dotenv from 'dotenv'
import { json } from './utils/utils.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'
dotenv.config()

const server = http.createServer(async (req, res) => {
    const { method, url } = req

    await json(res, req)

    const route = routes.find(route => {
        return route.method === method && route.path.test(req.url)
    })

    if (route) {
        const routeParams = req.url.match(route.path)
        const { query, ...params } = routeParams.groups

        req.params = params
        req.query = extractQueryParams(query)
        return route.handler(req, res)
    }

    res
        .writeHead(404)
        .end('Not found')
})

server.listen(3000, () => {
    console.log(`Server running at ${process.env.API_URL}:${process.env.API_PORT}`)
})