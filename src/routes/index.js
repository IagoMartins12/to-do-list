const express = require('express')
const router = express.Router()

//Rota principal, que irá rednderuzar a pagina index
router.get('/', async(req,res) =>{
    res.render('pages/index')
})

module.exports = router