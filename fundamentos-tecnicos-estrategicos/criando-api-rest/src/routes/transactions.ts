import { FastifyInstance } from "fastify"
import { db } from "../database"
import { randomUUID } from "crypto"
import { z } from 'zod'
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"

export async function transactinsRoutes(app: FastifyInstance) {
    app.get('/', {
        preHandler: [checkSessionIdExists]
    }, async (req, res) => {
        const sessionId = req.cookies.sessionId

        const transactions = await db('transactions')
            .where('session_id', sessionId)
            .select()

        return {
            transactions,
            total: transactions.length
        }
    })

    app.get('/:id', {
        preHandler: [checkSessionIdExists]
    }, async (req) => {
        const sessionId = req.cookies.sessionId
        const getTransactionParams = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParams.parse(req.params)

        const transaction = await db('transactions')
            .where({
                session_id: sessionId,
                id
            })
            .first()

        return {
            transaction
        }
    })

    app.get('/summary', {
        preHandler: [checkSessionIdExists]
    }, async (req, res) => {
        const sessionId = req.cookies.sessionId
        const summary = await db('transactions')
            .where('session_id', sessionId)
            .sum('amount', { as: 'amount' })
            .first()

        return {
            summary
        }
    })

    app.post('/', async (req, res) => {
        const createTransactionBody = z.object({
            title: z.string(),
            amount: z.coerce.number(),
            type: z.enum(['credit', 'debit'])
        })

        const { title, amount, type } = createTransactionBody.parse(req.body)

        let sessionId = req.cookies.sessionId
        console.log(sessionId)

        if (!sessionId) {
            sessionId = randomUUID()

            res.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })
        }

        await db('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id: sessionId
        })

        return res.status(201).send('Transação criada com sucesso')
    })

    app.delete('/:id', async (req, res) => {
        const getTransactionParams = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParams.parse(req.params)

        await db('transactions').where('id', id).delete()

        return res.status(204).send('Transação deletada com sucesso')
    })
}