const express = require("express")

const checklistDepedentRoute = express.Router()
const simpleRouter = express.Router()
const Checklist = require('../models/checklist')
const Task = require('../models/task')

//checklistDepedentRoute = rotas de task q dependem da de checklist
//simpleRouter = rotas de task q n dependem da de checklist

//Endpoint para mostrar o formulario de cadastro de tarefas
checklistDepedentRoute.get('/:id/tasks/new', async(req,res) =>{
    try {
        let task = Task();
        res.status(200).render('tasks/new', {checklistId: req.params.id, task: task})
    } catch (error) {
        res.status(422).render('pages/error', {error: "Erro ao carregar o formulario"})
    }
})

//Endpoint para salvar a tarefa do form
checklistDepedentRoute.post('/:id/tasks', async(req,res) => {
    let {name} = req.body.task
    let task = new Task({ name, checklist: req.params.id})

    try {
        await task.save();
        let checklist = await Checklist.findById(req.params.id)
        checklist.tasks.push(task) 
        await checklist.save() 
        res.redirect(`/checklists/${req.params.id}`)  
    } catch (error) {
        res.status(422).render('tasks/new', {task: {...task,errors}, checklistId: req.params.id})
    }
})

//Endpoint para deletar uma tarefa e atualizar o array
simpleRouter.delete('/:id', async(req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.params.id)
        let checklist = await Checklist.findById(task.checklist)
        let taskToRemove = checklist.tasks.indexOf(task._id)
        checklist.tasks.splice(taskToRemove, 1);
        await checklist.save()
        res.redirect(`/checklists/${checklist._id}`)
    } catch (error) {
        res.status(422).render('pages/error', {error: "Erro ao remover a tarefa"})
    }
})

//Endpoint para atualizar a tarefa, para ver se esta feita ou não
simpleRouter.put('/:id', async(req,res ) => {
    let task = await Task.findById(req.params.id)
    try {
        task.set(req.body.task)
        await task.save()
        res.status(200).json({ task })
    } catch (error) {
        let erros = error.errors
        res.status(422).json({task: {...erros}})
    }
})


module.exports = { 
    checklistDepedent: checklistDepedentRoute,
    simple: simpleRouter
}