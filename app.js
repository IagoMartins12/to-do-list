const express = require('express')
const path = require('path')
const methodOverride = require('method-override')

const checklistRouter = require('./src/routes/checklist')
const taskRouter = require('./src/routes/task')

const rootRouter = require('./src/routes/index')
require('./config/database')


const app = express()

//Utilizando um middleware para verificar se a requisição esta passando um json
app.use(express.json())

//Middleware para ler parametros enviados atraves de form
app.use(express.urlencoded({extended: true}))

//Configurando o express para aceitar arquivos estaticos, indicando q os arquivos estarão na pasta 'public'
app.use(express.static(path.join(__dirname, 'public')))

app.use(methodOverride('_method' , {methods: ['POST', 'GET']}))

app.set('views', path.join(__dirname,'src/views'))
app.set('view engine', 'ejs')

app.use('/', rootRouter)
app.use('/checklists', checklistRouter)
app.use('/checklists', taskRouter.checklistDepedent)
app.use('/tasks', taskRouter.simple)



app.listen(3000, () =>{
    console.log('Servidor no ar')
})