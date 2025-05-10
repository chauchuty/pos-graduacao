import fastify from 'fastify'
import { db } from './database'
import { randomUUID } from 'node:crypto'
import { env } from './env'

const app = fastify()

app.get('/transactions', async (req, res) => {
  const transactions = await db('transactions').select()

  return res.status(200).send(transactions)
})

app.post('/transactions', async (req, res) => {
  const { title, amount } = req.body as { title: string; amount: number }

  await db('transactions').insert({
    id: randomUUID(),
    title,
    amount: amount
  })

  return res.status(201).send()
})

app.listen({
  port: env.PORT,
}).then(() => {
  console.log(`Server is running on ${env.HOST}:${env.PORT}`)
})