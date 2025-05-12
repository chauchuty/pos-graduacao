import { test, expect, beforeAll, afterAll, describe, it } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

describe('Transactions Routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    test('Usuário pode criar uma nova transação', {}, async () => {
        await request(app.server).post('/transactions').send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        }).expect(201)
    })

    it('deve listar todas as transações', async () => {
        const createTransactionResponse = await request(app.server).post('/transactions').send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        })

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies!)
            .expect(200)

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000
            })
        ])
    })
})

