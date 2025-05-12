import fastify from 'fastify'
import { db } from './database'
import { randomUUID } from 'node:crypto'
import { env } from './env'
import { transactinsRoutes } from './routes/transactions'
import fastifyCookie from '@fastify/cookie'

const app = fastify()

app.register(fastifyCookie)
app.register(transactinsRoutes, {
  prefix: 'transactions'
})

app.addHook('preHandler', async (req, res) => {
  console.log(`[${req.method}] ${req.url}`)
})

app.listen({
  port: env.PORT,
}).then(() => {
  console.log(`Server is running on ${env.HOST}:${env.PORT}`)
})