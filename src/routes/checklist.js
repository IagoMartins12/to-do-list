const express = require("express")
const router = express.Router()
const Checklist = require('../models/checklist')

//Endpoint para renderizar o form de cadastro da checklist
router.get('/', async ( req, res) => {
  try {
    let checklists = await Checklist.find({})
    res.status(200).render('checklists/index', {checklists: checklists})
} catch (error) {
    res.status(500).render('pages/error', {error: "Erro ao exibir as listas"})
  }
})

//Endpoint para criar uma checklist
router.post('/', async (req,res) =>{
    //Pegando o parametro "name" da requisição
    let {name} = req.body.checklist
    let checklist = new Checklist({name})

    //Criando o documento de checklist no mongo
    try {
        await checklist.save();
        res.redirect('/checklists')
    } catch (error) {
        res.status(422).render('checklist/new', { checklist: {...checklist, error}})
    }
})

//Endpoint para renderizar o form de cadastro da checklist
router.get('/new', async(req, res) => {
    try {
        let checklist = new Checklist(); 
        res.status(200).render('checklists/new', {checklist: checklist})
    } catch (error) {
        res.status(500).render('pages/error', {error: "Erro ao carregar o formulario"})
    }
})

//Endpoint para renderizar o form de editar a checklist
router.get('/:id/edit', async (req,res) => {
    try {
        let checklist = await Checklist.findById(req.params.id)
        res.status(200).render('checklists/edit', {checklist: checklist})
    } catch (error) {
        res.status(500).render('pages/error', {error: "Erro ao exibir a edição da lista de tarefas"})
    }
})

//Endpoint para renderizar dentro da checklist, mostrando as tarefas
router.get('/:id', async (req,res) =>{
    try {
        let checklist = await Checklist.findById(req.params.id).populate('tasks')
        res.status(200).render('checklists/show', {checklist: checklist})
    } catch (error) {
        res.status(500).render('pages/error', {error: "Erro ao exibir as listas de tarefa"})
    }
})

//Endpoint para atualizar a checklist
router.put('/:id', async (req,res) =>{
    let { name } = req.body.checklist
    let checklist = await Checklist.findById(req.params.id)

    try {
        await checklist.updateOne({name})
        res.redirect('/checklists')
    } catch (error) {
        let errors = error.erros
        res.status(422).render('checklists/edit', {checklist: {...checklist,errors}})
    }
})

//Endpoint para deletar a checklist
router.delete('/:id', async(req,res) =>{
    try {
        await Checklist.findByIdAndRemove(req.params.id)
        res.redirect('/checklists')
    } catch (error) {
        res.status(500).render('pages/error', {error: "Erro ao deletar a lista de tarefas"})
    }
})

module.exports = router