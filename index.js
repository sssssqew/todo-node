var express = require('express') // node_modules 내 express 관련 코드를 가져온다
var app = express()
var cors = require('cors') 
var logger = require('morgan')
var mongoose = require('mongoose')
var routes = require('./src/routes')
const axios = require('axios')

var corsOptions = { // CORS 옵션
  origin: '*', // 주소 변경 
  credentials: true // 
}

// const CONNECT_URL = 'mongodb://localhost:27017/syleemomo'
const CONNECT_URL = 'mongodb+srv://sunrise:rkrrlska@cluster0.dqptx.mongodb.net/sunrise?retryWrites=true&w=majority'

mongoose.connect(CONNECT_URL, { // Mongo DB 서버 연결
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("mongodb connected ..."))
  .catch(e => console.log(`failed to connect mongodb: ${e}`))

app.use(cors(corsOptions)) // CORS 설정
app.use(express.json()) // request body 파싱
app.use(logger('tiny'))

app.use("/api", routes) // api 라우팅

app.get('/hello', (req, res) => { // URL 응답 테스트
    res.send('hello world !')
})

app.get('/fetch', async (req, res) => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos')
    res.send(response.data)
})

app.get('/error', (req, res) => {
  throw new Error('서버에 치명적인 에러가 발생했습니다.')
})

app.use( (req, res, next) => {  // 사용자가 요청한 페이지가 없는 경우 에러처리
    res.status(404).send("Sorry can't find page")
})
app.use( (err, req, res, next) => { // 서버 내부 오류 처리
    console.error(err.stack)
    res.status(500).send("something is broken on server !")
})
app.listen(process.env.PORT || 5000, () => { // 5000 포트로 서버 오픈
    console.log('server is running on port 5000 ...')
})