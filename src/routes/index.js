const express = require('express')
const router = express.Router() 
const todo = require('./todo')

router.use('/todos', todo) // 서브(하위) URL 정의

module.exports = router