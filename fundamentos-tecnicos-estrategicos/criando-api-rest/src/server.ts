import fastify from 'fastify'
import { db } from './database'

const app = fastify()

app.get('/', async (req, res) => {
  const tables = await db('sqlite_master').where('type', 'table').select('name')
  return tables
})

app.listen({
  port: 3000,
}).then(() => {
  console.log('Server is running on port 3000')
})