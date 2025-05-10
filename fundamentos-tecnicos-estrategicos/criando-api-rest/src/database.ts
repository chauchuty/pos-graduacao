import { knex, Knex } from 'knex'

export const config: Knex.Config = {
    client: 'sqlite3',
    connection: {
        filename: './db/db.db',
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations',
    }
}

export const db = knex(config)