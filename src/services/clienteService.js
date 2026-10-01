const db = require('../database/connection')

const avaliarEmprestimo = (age, income, location) => {
    const emprestimos = []
    if (income <= 3000 || (income > 3000 && income < 5000 && age < 30 && location === 'SP')) {
        emprestimos.push({ tipo: 'PERSONAL', taxa_interesse: 4 })
    }
    if (income <= 3000 || (income > 3000 && income < 5000 && age < 30 && location === 'SP')) {
        emprestimos.push({ tipo: 'GUARANTEED', taxa_interesse: 3 })
    }
    if (income >= 5000) {
        emprestimos.push({ tipo: 'CONSIGNMENT', taxa_interesse: 2 })
    }
    return emprestimos
}

const clienteService = {
    async create(data) {
        const { name, cpf, age, income, location } = data
        const [resultado] = await db.query(
            'INSERT INTO clientes (nome, cpf, idade, renda, estado) VALUES (?,?,?,?,?)',
            [name, cpf, age, income, location]
        )
        return { id: resultado.insertId, name, cpf, age, income, location }
    },

    async findAll() {
        const [colunas] = await db.query('SELECT id, nome AS name, cpf, idade AS age, renda AS income, estado AS location FROM clientes')
        return colunas
    },

    async findById(id) {
        const [colunas] = await db.query('SELECT id, nome AS name, cpf, idade AS age, renda AS income, estado AS location FROM clientes WHERE id = ?', [id])
        return colunas[0] || null
    },

    async update(id, data) {
        const { name, cpf, age, income, location } = data
        const [resultado] = await db.query(
            'UPDATE clientes SET nome = ?, cpf = ?, idade = ?, renda = ?, estado = ? WHERE id = ?',
            [name, cpf, age, income, location, id]
        )
        return resultado.affectedRows > 0
    },

    async delete(id) {
        const [resultado] = await db.query('DELETE FROM clientes WHERE id = ?', [id])
        return resultado.affectedRows > 0
    },

    async analyzeLoans(data) {
        const { name, age, income, location } = data
        const emprestimosDisponiveis = avaliarEmprestimo(age, income, location)
        return {
            cliente: name,
            emprestimos: emprestimosDisponiveis
        }
    }
}

module.exports = clienteService