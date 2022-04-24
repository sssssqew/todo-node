const express = require('express')
const TodoRouter = express.Router()
const Todo = require("../../models/Todo");

TodoRouter.route('/').get( async (req, res) => { // 전체 할일 목록 조회 구현
  const todos = await Todo.find()
  res.json({ status: 200, todos})
})


TodoRouter.route('/:id').get( (req, res) => {  // 특정 할일 조회 구현
  Todo.findById(req.params.id, (err, todo) => {
      if(err) throw err;
      res.json({ status: 200, todo})
  })
})

TodoRouter.route('/').post( (req, res) => { // 특정 할일 생성 구현
    console.log(`name: ${req.body.name}`)

    Todo.findOne({ name: req.body.name, done: false }, async (err, todo) => { // 중복체크
        if(err) throw err;
        if(!todo){ // 데이터베이스에서 해당 할일을 조회하지 못한 경우
            const newTodo = new Todo(req.body);
            const createdTodo = await newTodo.save() // DB에 새로운 할일 저장
            res.json({ status: 201, msg: 'new todo created in db !', createdTodo})
        }else{ // 생성하려는 할일과 같은 이름이고 아직 끝내지 않은 할일이 이미 데이터베이스에 존재하는 경우
            const msg = 'this todo already exists in db !'
            console.log(msg) 
            res.json({ status: 204, msg})
        }
    })
})


TodoRouter.route('/:id').put( (req, res) => {  // 특정 할일 업데이트
  Todo.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, todo) => {
      if(err) throw err;
      res.json({ status: 204, msg: `todo ${req.params.id} updated in db !`, todo})
  })
})


TodoRouter.route('/:id').delete( (req, res) => {  // 특정 할일 삭제 구현
  Todo.findByIdAndRemove(req.params.id, (err, todo) => {
      if(err) throw err;
      res.json({ status: 204, msg: `todo ${req.params.id} removed in db !`})
  })
})

module.exports = TodoRouter

