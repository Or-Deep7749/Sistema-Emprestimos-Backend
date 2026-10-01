const clienteService = require('../services/clienteService')

const clienteController = {
    async create(req, res){
        try{
            const {name,cpf,age,income,location} = req.body
            if (!name || !cpf || !age || !income || !location){
                return res.status(400).json({message: 'Todos os campos são obrigatórios'})
            }
            const novoCliente = await clienteService.create(req.body)
            return res.status(201).json(novoCliente)
        } catch (error) {
            console.error("ERRO NO CREATE:", error);
            if (error.code === 'ER_DUP_ENTRY'){
                return res.status(409).json({message: 'CPF já cadastrado'})
            }
            return res.status(500).json({message: 'Erro interno no servidor', error:error.message})
        }
    },
    async getAll(req,res){
        try{
            const cliente = await clienteService.findAll()
            return res.status(200).json(cliente)
        } catch (error) {
            console.error("ERRO NO GETALL:", error); // <-- Adicionado para ver o erro real!
            return res.status(500).json({message: 'Erro ao buscar clientes', error: error.message})
        }
    },
    async getById(req,res){
        try{
            const {id} = req.params
            const cliente = await clienteService.findById(id)
            if (!cliente) {
                return res.status(404).json({message:'Cliente não encontrado'})
            }
            return res.status(200).json(cliente)
        } catch (error) {
            console.error("ERRO NO GETBYID:", error);
            return res.status(500).json({message:'Erro ao buscar cliente', error: error.message})
        }
    },
    async update(req,res){
        try{
            const {id} = req.params
            const update = await clienteService.update(id,req.body)
            if (!update) {
                return res.status(404).json({message:'Cliente não encontrado'})
            }
            return res.status(200).json({message:'Cliente atualizado com sucesso'})
        } catch (error) {
            console.error("ERRO NO UPDATE:", error);
            return res.status(500).json({message:'Erro ao atualizar cliente', error: error.message})
        }
    },
    async delete(req,res){
        try{
            const {id} = req.params
            const deleted = await clienteService.delete(Number(id))
            if (!deleted) {
                return res.status(404).json({message:'Cliente não encontrado'})
            }
            return res.status(200).json({message:'Cliente deletado com sucesso'})
        } catch (error) {
            console.error("ERRO NO DELETE:", error);
            return res.status(500).json({message:'Erro ao excluir cliente', error: error.message})
        }
    },
    async analyzeLoans(req,res){
        try{
            const {name,age,income,location} = req.body
            if (!name || !age || !income || !location) {
                return res.status(400).json({message:'Dados incompletos'})
            }
            const resultado = await clienteService.analyzeLoans(req.body)
            return res.status(200).json(resultado)
        } catch (error) {
            console.error("ERRO NO ANALYZELOANS:", error);
            return res.status(500).json({message:'Erro ao analisar empréstimos', error: error.message})
        }
    }
}

module.exports = clienteController