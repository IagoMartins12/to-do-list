const express = require('express')
const checklistRouter = require('./src/routes/checklist')
const jsonRouter = require('./src/routes/json')
const app = express()


//Utilizando um middleware para verificar se a requisição esta passando um json
app.use(express.json())

app.use('/checklist', checklistRouter)

app.use('/json', jsonRouter)

app.listen(3000, () =>{
    console.log('Servidor no ar')
})