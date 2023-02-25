const express = require("express")
const router = express.Router()


router.get('/', (req, res) => {
    console.log(req.body)
    res.json({title: "Tarefa X", done: true})
})

module.exports = router
