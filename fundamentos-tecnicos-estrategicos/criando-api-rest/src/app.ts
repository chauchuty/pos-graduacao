import fastify from 'fastify'
import { env } from './env'
import { transactinsRoutes } from './routes/transactions'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyCookie)
app.register(transactinsRoutes, {
    prefix: 'transactions'
})

app.addHook('preHandler', async (req, res) => {
    console.log(`[${req.method}] ${req.url}`)
})
