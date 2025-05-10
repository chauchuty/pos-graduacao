import fs from 'node:fs'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Erro ao ler o arquivo:', err);
            } else {
                this.#database = JSON.parse(data)
            }
        });
    }

    #persist(){
        fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2), (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo:', err);
            } else {
                console.log('Arquivo escrito com sucesso');
            }
        });
    }

    select(table, search) {
        let data = this.#database[table] || []

        if(search){
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
        
        return data
    }

    insert = (table, data) => {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }
        this.#persist()
        return data
    }

    edit = (table, id, data) => {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        if (rowIndex > -1) {
            this.#database[table][rowIndex] = { id, ...data }
            this.#persist()
        }
        return data
    }

    delete = (table, id) => {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }
}